const { OrderService } = require("../services/orderService");
const { success } = require("../utils/apiResponse");
const { AppError } = require("../utils/AppError");

const service = new OrderService();

function ensureOrderAccess(req, order) {
  if (req.user.role === "ADMIN" || req.user.role === "STAFF") return;
  if (order.customerUserId && order.customerUserId === req.user.id) return;
  if (order.userId && order.userId === req.user.id) return;
  throw new AppError("Order access denied", 403);
}

async function createOrder(req, res, next) {
  try {
    success(res, await service.createOrder({ actor: req.user, payload: req.body }), 201);
  } catch (err) {
    next(err);
  }
}

async function listOrders(_req, res, next) {
  try {
    success(res, await service.listOrders());
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await service.getOrder(req.params.id);
    ensureOrderAccess(req, order);
    success(res, order);
  } catch (err) {
    next(err);
  }
}

async function getInternalOrder(req, res, next) {
  try {
    success(res, await service.getOrder(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function getUserOrders(req, res, next) {
  try {
    if (req.user.role !== "ADMIN" && req.user.role !== "STAFF" && req.params.userId !== req.user.id) {
      throw new AppError("Order access denied", 403);
    }
    success(res, await service.getUserOrders(req.params.userId));
  } catch (err) {
    next(err);
  }
}

async function updateStatus(req, res, next) {
  try {
    success(res, await service.updateStatus(req.params.id, req.body.status));
  } catch (err) {
    next(err);
  }
}

async function updatePaymentStatus(req, res, next) {
  try {
    const order = await service.getOrder(req.params.id);
    ensureOrderAccess(req, order);
    success(res, await service.updatePaymentStatus(req.params.id, req.body.paymentStatus));
  } catch (err) {
    next(err);
  }
}

async function updateInternalPaymentStatus(req, res, next) {
  try {
    success(res, await service.updatePaymentStatus(req.params.id, req.body.paymentStatus));
  } catch (err) {
    next(err);
  }
}

async function cancelOrder(req, res, next) {
  try {
    const order = await service.getOrder(req.params.id);
    ensureOrderAccess(req, order);
    success(res, await service.cancelOrder(req.params.id));
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  listOrders,
  getOrder,
  getInternalOrder,
  getUserOrders,
  updateStatus,
  updatePaymentStatus,
  updateInternalPaymentStatus,
  cancelOrder
};
