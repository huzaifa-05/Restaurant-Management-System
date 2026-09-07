require("dotenv").config();

const config = {
  port: Number(process.env.PORT || 5004),
  env: process.env.NODE_ENV || "development",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  paymentSuccessRate: Number(process.env.PAYMENT_SUCCESS_RATE || 0.9)
};

const PAYMENT_METHODS = ["CARD", "CASH", "JAZZCASH", "EASYPAISA"];
const PAYMENT_STATUSES = ["PENDING", "PROCESSING", "SUCCESS", "FAILED", "REFUNDED"];

module.exports = { config, PAYMENT_METHODS, PAYMENT_STATUSES };
