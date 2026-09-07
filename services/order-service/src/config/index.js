require("dotenv").config();

const config = {
  port: Number(process.env.PORT || 5003),
  env: process.env.NODE_ENV || "development",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  menuServiceUrl: process.env.MENU_SERVICE_URL || "http://localhost:5002"
};

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "READY", "COMPLETED", "CANCELLED"];
const ORDER_TYPES = ["DINE_IN", "TAKEAWAY", "PRE_ORDER"];

module.exports = { config, ORDER_STATUSES, ORDER_TYPES };
