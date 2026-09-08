require("dotenv").config();

function parseOrigins(value) {
  return String(value || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const config = {
  port: Number(process.env.PORT || 5004),
  env: process.env.NODE_ENV || "development",
  frontendOrigin: parseOrigins(process.env.FRONTEND_ORIGIN),
  paymentSuccessRate: Number(process.env.PAYMENT_SUCCESS_RATE || 0.9),
  orderServiceUrl: process.env.ORDER_SERVICE_URL || "http://localhost:5003",
  internalServiceToken: process.env.INTERNAL_SERVICE_TOKEN || ""
};

const PAYMENT_METHODS = ["CARD", "CASH", "JAZZCASH", "EASYPAISA"];
const PAYMENT_STATUSES = ["PENDING", "PROCESSING", "SUCCESS", "FAILED", "REFUNDED"];

module.exports = { config, PAYMENT_METHODS, PAYMENT_STATUSES };
