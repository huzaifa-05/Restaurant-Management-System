const { error } = require("../utils/apiResponse");
const { logger } = require("../utils/logger");

function errorHandler(err, _req, res, _next) {
  const status = err.statusCode || 500;
  logger.error("request failed", { status, message: err.message });
  return error(res, status === 500 ? "Internal server error" : err.message, status);
}

module.exports = { errorHandler };
