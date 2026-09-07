require("dotenv").config();

const config = {
  port: Number(process.env.PORT || 5002),
  env: process.env.NODE_ENV || "development",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173"
};

const CATEGORIES = ["Beef Burgers", "Pizza", "Pasta", "Biryani"];

module.exports = { config, CATEGORIES };
