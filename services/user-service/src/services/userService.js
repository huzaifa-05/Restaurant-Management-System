const { UserRepository } = require("../repositories/userRepository");
const { AppError } = require("../utils/AppError");

const repository = new UserRepository();

class UserService {
  async getUserById(id) {
    const user = await repository.findById(id);
    if (!user) throw new AppError("User not found", 404);
    return user;
  }

  async getCurrentUser(cognitoSub) {
    const user = await repository.findByCognitoSub(cognitoSub);
    if (!user) throw new AppError("Current user not found", 404);
    return user;
  }

  async updateCurrentUser(cognitoSub, payload) {
    const updates = {};
    ["fullName", "email", "phone"].forEach((field) => {
      if (payload[field] !== undefined) updates[field] = payload[field];
    });

    const user = await repository.updateByCognitoSub(cognitoSub, updates);
    if (!user) throw new AppError("Current user not found", 404);
    return user;
  }

}

module.exports = { UserService };
