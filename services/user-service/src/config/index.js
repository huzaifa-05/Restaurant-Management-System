require("dotenv").config();

function parseOrigins(value) {
  return String(value || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const config = {
  port: Number(process.env.PORT || 5001),
  env: process.env.NODE_ENV || "development",
  frontendOrigin: parseOrigins(process.env.FRONTEND_ORIGIN),
  usersTableName: process.env.USERS_TABLE_NAME,
  dynamoDbEndpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID,
  cognitoAppClientId: process.env.COGNITO_APP_CLIENT_ID,
  mockCognitoSub: process.env.MOCK_COGNITO_SUB || "mock-cognito-sub-123",
  mockUserRole: String(process.env.MOCK_USER_ROLE || "USER").toUpperCase()
};

module.exports = { config };
