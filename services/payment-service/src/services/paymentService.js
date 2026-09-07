const { randomUUID } = require("crypto");
const { config, PAYMENT_METHODS } = require("../config");
const { PaymentRepository } = require("../repositories/paymentRepository");
const { AppError } = require("../utils/AppError");
const { logger } = require("../utils/logger");

const repository = new PaymentRepository();

class PaymentService {
  async createPayment(payload) {
    if (!payload.orderId) throw new AppError("orderId is required", 400);
    if (Number(payload.amount) <= 0) throw new AppError("amount must be greater than 0", 400);
    if (!PAYMENT_METHODS.includes(payload.paymentMethod)) throw new AppError("Invalid payment method", 400);

    const succeeded = payload.paymentMethod === "CASH" || Math.random() <= config.paymentSuccessRate;
    const payment = {
      paymentId: `payment-${randomUUID()}`,
      orderId: payload.orderId,
      amount: Number(payload.amount),
      paymentMethod: payload.paymentMethod,
      status: succeeded ? "SUCCESS" : "FAILED",
      transactionId: succeeded ? `txn-${randomUUID()}` : null,
      createdAt: new Date().toISOString()
    };

    const created = await repository.create(payment);
    logger.info("payment processed", {
      paymentId: created.paymentId,
      orderId: created.orderId,
      status: created.status
    });
    return created;
  }

  async getPayment(paymentId) {
    const payment = await repository.findById(paymentId);
    if (!payment) throw new AppError("Payment not found", 404);
    return payment;
  }

  async getOrderPayments(orderId) {
    return repository.findByOrder(orderId);
  }

  async refundPayment(paymentId) {
    const payment = await repository.findById(paymentId);
    if (!payment) throw new AppError("Payment not found", 404);
    if (payment.status !== "SUCCESS") throw new AppError("Only successful payments can be refunded", 400);
    const refunded = await repository.update(paymentId, { status: "REFUNDED" });
    logger.info("payment refunded", { paymentId });
    return refunded;
  }

  async processWebhook(payload) {
    logger.info("payment webhook received", { eventType: payload.type || "unknown" });
    return {
      received: true,
      eventType: payload.type || "unknown"
    };
  }
}

module.exports = { PaymentService };
