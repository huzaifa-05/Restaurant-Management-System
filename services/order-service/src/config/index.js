require("dotenv").config();

const config = {
  port: Number(process.env.PORT || 5003),
  env: process.env.NODE_ENV || "development",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  menuServiceUrl: process.env.MENU_SERVICE_URL || "http://localhost:5002",
  internalServiceToken: process.env.INTERNAL_SERVICE_TOKEN || ""
};

const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PAYMENT_FAILED",
  "PREPARING",
  "READY",
  "COMPLETED",
  "CANCELLED"
];
const ORDER_TYPES = ["DINE_IN", "TAKEAWAY", "PRE_ORDER"];
const ORDER_SOURCES = ["STAFF", "SELF_SERVICE"];
const PAYMENT_STATUSES = ["PENDING", "SUCCESS", "FAILED"];

module.exports = { config, ORDER_STATUSES, ORDER_TYPES, ORDER_SOURCES, PAYMENT_STATUSES };
