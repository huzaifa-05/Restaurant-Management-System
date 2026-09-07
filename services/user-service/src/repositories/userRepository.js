const now = new Date().toISOString();

const users = [
  {
    id: "user-1",
    cognitoSub: "mock-cognito-sub-123",
    fullName: "Foodie WE Guest",
    email: "guest@foodiewe.local",
    phone: "+92 300 1234567",
    role: String(process.env.MOCK_USER_ROLE || "CUSTOMER").toUpperCase(),
    createdAt: now,
    updatedAt: now
  }
];

class UserRepository {
  async findById(id) {
    return users.find((user) => user.id === id) || null;
  }

  async findByCognitoSub(cognitoSub) {
    return users.find((user) => user.cognitoSub === cognitoSub) || null;
  }

  async findCurrent(identifier) {
    return (await this.findByCognitoSub(identifier)) || (await this.findById(identifier)) || null;
  }

  async updateByCognitoSub(cognitoSub, updates) {
    const user = await this.findByCognitoSub(cognitoSub);
    if (!user) return null;
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    return user;
  }

  async updateCurrent(identifier, updates) {
    const user = (await this.findByCognitoSub(identifier)) || (await this.findById(identifier));
    if (!user) return null;
    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    return user;
  }
}

module.exports = { UserRepository };
