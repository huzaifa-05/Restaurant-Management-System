require("dotenv").config();

const config = {
  port: Number(process.env.PORT || 5001),
  env: process.env.NODE_ENV || "development",
  frontendOrigin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  mockCognitoSub: process.env.MOCK_COGNITO_SUB || "mock-cognito-sub-123",
  mockUserRole: String(process.env.MOCK_USER_ROLE || "USER").toUpperCase()
};

module.exports = { config };
