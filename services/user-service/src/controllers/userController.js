const { UserService } = require("../services/userService");
const { success } = require("../utils/apiResponse");
const { AppError } = require("../utils/AppError");

const service = new UserService();

function canAccessProfile(req, targetId) {
  return req.user.role === "ADMIN" || req.user.role === "STAFF" || req.user.id === targetId;
}

async function getUser(req, res, next) {
  try {
    if (!canAccessProfile(req, req.params.id)) {
      throw new AppError("Profile access denied", 403);
    }
    success(res, await service.getUserById(req.params.id));
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res, next) {
  try {
    success(res, await service.getCurrentUser(req.user.cognitoSub || req.user.id));
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    success(res, await service.updateCurrentUser(req.user.cognitoSub || req.user.id, req.body));
  } catch (err) {
    next(err);
  }
}

module.exports = { getUser, getMe, updateMe };
