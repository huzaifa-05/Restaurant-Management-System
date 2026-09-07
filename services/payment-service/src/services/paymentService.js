const { randomUUID } = require("crypto");
const { config, PAYMENT_METHODS } = require("../config");
const { fetchOrder, updatePaymentStatus } = require("../clients/orderClient");
const { PaymentRepository } = require("../repositories/paymentRepository");
const { AppError } = require("../utils/AppError");
const { logger } = require("../utils/logger");

const repository = new PaymentRepository();

function buildPaymentRecord(order, paymentMethod, status) {
  return {
    paymentId: `payment-${randomUUID()}`,
    orderId: order.orderId,
    userId: order.customerUserId || order.userId || order.createdBy || null,
    amount: Number(order.totalAmount),
    paymentMethod,
    status,
    transactionId: status === "SUCCESS" ? `txn-${randomUUID()}` : null,
    createdAt: new Date().toISOString()
  };
}

class PaymentService {
  async createPayment(payload) {
    if (!payload.orderId) throw new AppError("orderId is required", 400);
    if (!PAYMENT_METHODS.includes(payload.paymentMethod)) throw new AppError("Invalid payment method", 400);

    const order = await fetchOrder(payload.orderId);
    const existingSuccess = await repository.findSuccessfulByOrder(order.orderId);
    if (existingSuccess) {
      throw new AppError("Order already paid", 409);
    }

    if (order.paymentStatus === "SUCCESS" || order.orderStatus === "CONFIRMED") {
      throw new AppError("Order already paid", 409);
    }

    const shouldSucceed = payload.paymentMethod === "CASH" || Math.random() <= config.paymentSuccessRate;
    const baseRecord = buildPaymentRecord(order, payload.paymentMethod, shouldSucceed ? "SUCCESS" : "FAILED");

    if (shouldSucceed) {
      const created = await repository.create({ ...baseRecord, status: "PENDING", transactionId: null });
      try {
        await updatePaymentStatus(order.orderId, "SUCCESS");
        const finalized = await repository.update(created.paymentId, {
          status: "SUCCESS",
          transactionId: `txn-${randomUUID()}`
        });
        logger.info("payment processed", {
          paymentId: finalized.paymentId,
          orderId: finalized.orderId,
          status: finalized.status
        });
        return finalized;
      } catch (err) {
        await repository.update(created.paymentId, { status: "FAILED", transactionId: null });
        throw err;
      }
    }

    const created = await repository.create(baseRecord);
    try {
      await updatePaymentStatus(order.orderId, "FAILED");
    } catch (err) {
      logger.error("failed to update order payment status", {
        orderId: order.orderId,
        error: err.message
      });
    }

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
