const { UserService } = require("../services/userService");
const { success } = require("../utils/apiResponse");

const service = new UserService();

async function getUser(req, res, next) {
  try {
    success(res, await service.getUserById(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    success(res, await service.getCurrentUser(req.user.cognitoSub));
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    success(res, await service.updateCurrentUser(req.user.cognitoSub, req.body));
  } catch (err) {
    next(err);
  }
}

module.exports = { getUser, getMe, updateMe };
