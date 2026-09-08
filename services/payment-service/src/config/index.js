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
  paymentsTableName: process.env.PAYMENTS_TABLE_NAME,
  dynamoDbEndpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  paymentSuccessRate: Number(process.env.PAYMENT_SUCCESS_RATE || 1),
  orderServiceUrl: process.env.ORDER_SERVICE_URL || "http://localhost:5003",
  internalServiceToken: process.env.INTERNAL_SERVICE_TOKEN || ""
};

const PAYMENT_METHODS = ["CARD", "CASH", "JAZZCASH", "EASYPAISA"];
const PAYMENT_STATUSES = ["PENDING", "PROCESSING", "SUCCESS", "FAILED", "REFUNDED"];

module.exports = { config, PAYMENT_METHODS, PAYMENT_STATUSES };
