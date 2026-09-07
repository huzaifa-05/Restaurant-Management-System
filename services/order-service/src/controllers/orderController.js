const { OrderService } = require("../services/orderService");
const { success } = require("../utils/apiResponse");
const { AppError } = require("../utils/AppError");

const service = new OrderService();

function ensureOrderAccess(req, order) {
  if (req.user.role === "ADMIN" || order.userId === req.user.id) return;
  throw new AppError("Order access denied", 403);
}

async function createOrder(req, res, next) {
  try {
    success(res, await service.createOrder({ ...req.body, userId: req.user.id }), 201);
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

async function getUserOrders(req, res, next) {
  try {
    if (req.user.role !== "ADMIN" && req.params.userId !== req.user.id) {
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

async function cancelOrder(req, res, next) {
  try {
    const order = await service.getOrder(req.params.id);
    ensureOrderAccess(req, order);
    success(res, await service.cancelOrder(req.params.id));
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, listOrders, getOrder, getUserOrders, updateStatus, cancelOrder };
