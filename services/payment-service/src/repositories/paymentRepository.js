const payments = [];

class PaymentRepository {
  async create(payment) {
    payments.push(payment);
    return payment;
  }

  async findById(paymentId) {
    return payments.find((payment) => payment.paymentId === paymentId) || null;
  }

  async findByOrder(orderId) {
    return payments.filter((payment) => payment.orderId === orderId);
  }

  async findSuccessfulByOrder(orderId) {
    return payments.find((payment) => payment.orderId === orderId && payment.status === "SUCCESS") || null;
  }

  async update(paymentId, updates) {
    const payment = await this.findById(paymentId);
    if (!payment) return null;
    Object.assign(payment, updates);
    return payment;
  }
}

module.exports = { PaymentRepository };
