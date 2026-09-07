const { config } = require("../config");
const { error } = require("../utils/apiResponse");

function requireInternalService(req, res, next) {
  if (config.env !== "production" && !config.internalServiceToken) {
    return next();
  }

  if (!config.internalServiceToken) {
    return error(res, "Service authentication is not configured", 503);
  }

  if (req.headers["x-service-token"] !== config.internalServiceToken) {
    return error(res, "Service access denied", 403);
  }

  return next();
}

module.exports = { requireInternalService };
