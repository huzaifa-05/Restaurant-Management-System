const orders = [];

class OrderRepository {
  async create(order) {
    orders.push(order);
    return order;
  }

  async findAll() {
    return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async findById(orderId) {
    return orders.find((order) => order.orderId === orderId) || null;
  }

  async findByUser(userId) {
    return orders
      .filter((order) => order.customerUserId === userId || order.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async update(orderId, updates) {
    const order = await this.findById(orderId);
    if (!order) return null;
    Object.assign(order, updates, { updatedAt: new Date().toISOString() });
    return order;
  }
}

module.exports = { OrderRepository };
