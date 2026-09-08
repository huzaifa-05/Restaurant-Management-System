const { UserRepository } = require("../repositories/userRepository");
const { config } = require("../config");
const { AppError } = require("../utils/AppError");

const repository = new UserRepository();

class UserService {
  getAuthConfig() {
    if (!config.cognitoUserPoolId || !config.cognitoAppClientId) {
      throw new AppError("Cognito authentication is not configured", 503);
    }
    return {
      userPoolId: config.cognitoUserPoolId,
      clientId: config.cognitoAppClientId
    };
  }

  async getUserById(id) {
    const user = await repository.findById(id);
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  async getCurrentUser(identity) {
    const identifier = identity?.cognitoSub || identity?.id || identity;
    let user = await repository.findCurrent(identifier);
    if (user) return user;

    const now = new Date().toISOString();
    const profile = {
      id: identity?.id || identifier,
      cognitoSub: identity?.cognitoSub || identifier,
      fullName: identity?.fullName || "Foodie WE Customer",
      email: identity?.email || "",
      phone: "",
      role: identity?.role || "CUSTOMER",
      createdAt: now,
      updatedAt: now
    };

    try {
      return await repository.create(profile);
    } catch (err) {
      if (err.name !== "ConditionalCheckFailedException") throw err;
      user = await repository.findCurrent(identifier);
      if (user) return user;
      throw err;
    }
  }

  async updateCurrentUser(identity, payload) {
    const identifier = identity?.cognitoSub || identity?.id || identity;
    const updates = {};
    ["fullName", "email", "phone"].forEach((field) => {
      if (payload[field] !== undefined) updates[field] = payload[field];
    });
    updates.updatedAt = new Date().toISOString();

    await this.getCurrentUser(identity);
    const user = await repository.updateCurrent(identifier, updates);
    if (!user) throw new AppError("Current user not found", 404);
    return user;
  }

}

module.exports = { UserService };
