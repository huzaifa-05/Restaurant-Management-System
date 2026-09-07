const { randomUUID } = require("crypto");
const { ORDER_STATUSES, ORDER_TYPES } = require("../config");
const { MenuClient } = require("../clients/menuClient");
const { OrderRepository } = require("../repositories/orderRepository");
const { AppError } = require("../utils/AppError");
const { logger } = require("../utils/logger");

const repository = new OrderRepository();
const menuClient = new MenuClient();

class OrderService {
  async createOrder(payload) {
    if (!payload.userId) throw new AppError("userId is required", 400);
    if (!Array.isArray(payload.items) || payload.items.length === 0) {
      throw new AppError("Order must include at least one item", 400);
    }
    if (!ORDER_TYPES.includes(payload.orderType)) {
      throw new AppError("Invalid order type", 400);
    }

    const snapshots = [];
    for (const item of payload.items) {
      if (!item.itemId || Number(item.quantity) < 1) {
        throw new AppError("Each item must include itemId and quantity", 400);
      }
      const menuItem = await menuClient.getMenuItem(item.itemId);
      snapshots.push({
        itemId: menuItem.id,
        itemName: menuItem.name,
        unitPrice: Number(menuItem.price),
        quantity: Number(item.quantity)
      });
    }

    const totalAmount = Number(
      snapshots.reduce((total, item) => total + item.unitPrice * item.quantity, 0).toFixed(2)
    );
    const now = new Date().toISOString();
    const order = {
      orderId: `order-${randomUUID()}`,
      userId: payload.userId,
      items: snapshots,
      totalAmount,
      status: "PENDING",
      orderType: payload.orderType,
      pickupTime: payload.pickupTime || null,
      notes: payload.notes || "",
      createdAt: now,
      updatedAt: now
    };

    const created = await repository.create(order);
    logger.info("order created", { orderId: created.orderId, totalAmount: created.totalAmount });
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

  async updateStatus(orderId, status) {
    if (!ORDER_STATUSES.includes(status)) throw new AppError("Invalid order status", 400);
    const order = await repository.update(orderId, { status });
    if (!order) throw new AppError("Order not found", 404);
    logger.info("order status updated", { orderId, status });
    return order;
  }

  async cancelOrder(orderId) {
    const order = await repository.update(orderId, { status: "CANCELLED" });
    if (!order) throw new AppError("Order not found", 404);
    logger.info("order cancelled", { orderId });
    return order;
  }
}

module.exports = { OrderService };
