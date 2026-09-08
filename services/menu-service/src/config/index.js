require("dotenv").config();

function parseOrigins(value) {
  return String(value || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const config = {
  port: Number(process.env.PORT || 5002),
  env: process.env.NODE_ENV || "development",
  frontendOrigin: parseOrigins(process.env.FRONTEND_ORIGIN),
  menuTableName: process.env.MENU_TABLE_NAME,
  dynamoDbEndpoint: process.env.DYNAMODB_ENDPOINT || undefined
};

const CATEGORIES = ["Beef Burgers", "Pizza", "Pasta", "Biryani"];

module.exports = { config, CATEGORIES };
