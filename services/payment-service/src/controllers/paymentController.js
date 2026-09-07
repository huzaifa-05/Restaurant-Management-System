const { PaymentService } = require("../services/paymentService");
const { success } = require("../utils/apiResponse");

const service = new PaymentService();

async function createPayment(req, res, next) {
  try {
    success(res, await service.createPayment(req.body), 201);
  } catch (err) {
    next(err);
  }
}

async function getPayment(req, res, next) {
  try {
    success(res, await service.getPayment(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function getOrderPayments(req, res, next) {
  try {
    success(res, await service.getOrderPayments(req.params.orderId));
  } catch (err) {
    next(err);
  }
}

async function refundPayment(req, res, next) {
  try {
    success(res, await service.refundPayment(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function processWebhook(req, res, next) {
  try {
    success(res, await service.processWebhook(req.body));
  } catch (err) {
    next(err);
  }
}

module.exports = { createPayment, getPayment, getOrderPayments, refundPayment, processWebhook };
