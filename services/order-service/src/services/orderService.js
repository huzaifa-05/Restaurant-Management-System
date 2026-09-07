const { randomUUID } = require("crypto");
const { ORDER_STATUSES, ORDER_TYPES, ORDER_SOURCES, PAYMENT_STATUSES } = require("../config");
const { MenuClient } = require("../clients/menuClient");
const { OrderRepository } = require("../repositories/orderRepository");
const { AppError } = require("../utils/AppError");
const { logger } = require("../utils/logger");

const repository = new OrderRepository();
const menuClient = new MenuClient();

const OPERATIONAL_STATUSES = ["CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];

const STATUS_TRANSITIONS = {
  PENDING_PAYMENT: ["CONFIRMED", "PAYMENT_FAILED", "CANCELLED"],
  PAYMENT_FAILED: ["PENDING_PAYMENT", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: []
};

function normalizeRole(role) {
  const value = String(role || "").toUpperCase();
  if (!value || value === "USER") return "CUSTOMER";
  return value;
}

function trimOrNull(value) {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function normalizeStatus(order) {
  return order.orderStatus || order.status || "PENDING_PAYMENT";
}

function canSelfService(actorRole) {
  return normalizeRole(actorRole) === "CUSTOMER";
}

function isPrivileged(actorRole) {
  return ["STAFF", "ADMIN"].includes(normalizeRole(actorRole));
}

function validateOrderType(orderType) {
  if (!ORDER_TYPES.includes(orderType)) {
    throw new AppError("Invalid order type", 400);
  }
}

function validateQuantity(quantity) {
  const parsed = Number(quantity);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new AppError("Each item quantity must be greater than zero", 400);
  }
  return parsed;
}

function validateItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("Order must include at least one item", 400);
  }
}

function buildSnapshot(menuItem, quantity) {
  const unitPrice = Number(menuItem.price);
  const subtotal = Number((unitPrice * quantity).toFixed(2));

  return {
    itemId: menuItem.id,
    name: menuItem.name,
    quantity,
    unitPrice,
    subtotal
  };
}

function ensureOperationalTransition(order, nextStatus) {
  const currentStatus = normalizeStatus(order);
  if (!OPERATIONAL_STATUSES.includes(nextStatus)) {
    throw new AppError("Invalid order status", 400);
  }

  if (nextStatus === currentStatus) {
    return order;
  }

  if (nextStatus === "CONFIRMED") {
    if (order.paymentStatus !== "SUCCESS") {
      throw new AppError("Order must be paid before confirmation", 409);
    }
    return order;
  }

  const allowed = STATUS_TRANSITIONS[currentStatus] || [];
  if (!allowed.includes(nextStatus)) {
    throw new AppError("Invalid order status transition", 400);
  }

  return null;
}

function ensurePaymentTransition(order, nextPaymentStatus) {
  const currentOrderStatus = normalizeStatus(order);
  if (!PAYMENT_STATUSES.includes(nextPaymentStatus)) {
    throw new AppError("Invalid payment status", 400);
  }

  if (nextPaymentStatus === "SUCCESS") {
    if (order.paymentStatus === "SUCCESS" || currentOrderStatus === "CONFIRMED") {
      throw new AppError("Order already paid", 409);
    }
    if (!["PENDING_PAYMENT", "PAYMENT_FAILED"].includes(currentOrderStatus)) {
      throw new AppError("Invalid payment state", 409);
    }
    return null;
  }

  if (nextPaymentStatus === "FAILED") {
    if (order.paymentStatus === "SUCCESS" || currentOrderStatus === "CONFIRMED") {
      throw new AppError("Order already paid", 409);
    }
    if (currentOrderStatus === "PAYMENT_FAILED" && order.paymentStatus === "FAILED") {
      return order;
    }
    if (currentOrderStatus !== "PENDING_PAYMENT") {
      throw new AppError("Invalid payment state", 409);
    }
    return null;
  }

  return order;
}

class OrderService {
  async createOrder({ actor, payload }) {
    if (!actor?.id) throw new AppError("Authentication required", 401);
    validateItems(payload.items);
    validateOrderType(payload.orderType);

    const role = normalizeRole(actor.role);
    const requestedSource = trimOrNull(payload.orderSource);
    const orderSource = role === "CUSTOMER" ? "SELF_SERVICE" : "STAFF";

    if (requestedSource && !ORDER_SOURCES.includes(requestedSource)) {
      throw new AppError("Invalid order source", 400);
    }

    if (requestedSource && requestedSource !== orderSource) {
      throw new AppError("Invalid order source for the current user", 400);
    }

    if (orderSource === "SELF_SERVICE" && !canSelfService(role)) {
      throw new AppError("Customer authentication required", 401);
    }

    const snapshots = [];
    for (const item of payload.items) {
      if (!item?.itemId) {
        throw new AppError("Each item must include an itemId", 400);
      }

      const quantity = validateQuantity(item.quantity);
      const menuItem = await menuClient.getMenuItem(item.itemId);
      snapshots.push(buildSnapshot(menuItem, quantity));
    }

    const totalAmount = Number(
      snapshots.reduce((total, item) => total + item.subtotal, 0).toFixed(2)
    );
    const now = new Date().toISOString();
    const customerUserId = orderSource === "SELF_SERVICE" ? actor.id : trimOrNull(payload.customerUserId);

    const order = {
      orderId: `order-${randomUUID()}`,
      orderSource,
      createdBy: actor.id,
      createdByRole: role,
      customerUserId,
      customerName: trimOrNull(payload.customerName) || (orderSource === "SELF_SERVICE" ? trimOrNull(actor.fullName) : null),
      tableNumber: trimOrNull(payload.tableNumber),
      items: snapshots,
      totalAmount,
      paymentStatus: "PENDING",
      orderStatus: "PENDING_PAYMENT",
      status: "PENDING_PAYMENT",
      orderType: payload.orderType,
      pickupTime: trimOrNull(payload.pickupTime),
      notes: trimOrNull(payload.notes) || "",
      createdAt: now,
      updatedAt: now
    };

    if (customerUserId) {
      order.userId = customerUserId;
    }

    const created = await repository.create(order);
    logger.info("order created", {
      orderId: created.orderId,
      orderSource: created.orderSource,
      totalAmount: created.totalAmount
    });
    return created;
  }

  async listOrders() {
    return repository.findAll();
  }

  async getOrder(orderId) {
    const order = await repository.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    return order;
  }

  async getUserOrders(userId) {
    return repository.findByUser(userId);
  }

  async updatePaymentStatus(orderId, paymentStatus) {
    const order = await this.getOrder(orderId);
    ensurePaymentTransition(order, paymentStatus);

    if (paymentStatus === "SUCCESS") {
      const updated = await repository.update(orderId, {
        paymentStatus: "SUCCESS",
        orderStatus: "CONFIRMED",
        status: "CONFIRMED"
      });
      logger.info("order payment confirmed", { orderId, paymentStatus });
      return updated;
    }

    if (paymentStatus === "FAILED" && normalizeStatus(order) === "PAYMENT_FAILED" && order.paymentStatus === "FAILED") {
      return order;
    }

    const updated = await repository.update(orderId, {
      paymentStatus: "FAILED",
      orderStatus: "PAYMENT_FAILED",
      status: "PAYMENT_FAILED"
    });
    logger.info("order payment failed", { orderId, paymentStatus });
    return updated;
  }

  async updateStatus(orderId, status) {
    const order = await this.getOrder(orderId);
    const nextStatus = String(status || "").toUpperCase();
    ensureOperationalTransition(order, nextStatus);

    if (nextStatus === normalizeStatus(order)) {
      return order;
    }

    const updated = await repository.update(orderId, {
      orderStatus: nextStatus,
      status: nextStatus
    });

    logger.info("order status updated", { orderId, status: nextStatus });
    return updated;
  }

  async cancelOrder(orderId) {
    const order = await this.getOrder(orderId);
    const currentStatus = normalizeStatus(order);
    if (currentStatus === "COMPLETED" || currentStatus === "CANCELLED") {
      throw new AppError("Invalid order status transition", 400);
    }

    const updated = await repository.update(orderId, {
      orderStatus: "CANCELLED",
      status: "CANCELLED"
    });
    logger.info("order cancelled", { orderId });
    return updated;
  }
}

module.exports = { OrderService };
