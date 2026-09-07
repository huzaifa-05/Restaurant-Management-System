const { config } = require("../config");
const { error } = require("../utils/apiResponse");

function parseGroups(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((group) => group.trim())
    .filter(Boolean);
}

function resolveGatewayUser(req) {
  const userId = req.headers["x-user-id"];
  if (!userId) return null;

  const groups = parseGroups(req.headers["x-user-groups"]);
  return {
    id: userId,
    cognitoSub: userId,
    email: req.headers["x-user-email"] || "",
    groups,
    role: groups.includes("Admins") || groups.includes("ADMIN") ? "ADMIN" : "USER"
  };
}

function mockAuth(req, _res, next) {
  if (config.env === "production") {
    req.user = resolveGatewayUser(req);
    if (!req.user) return error(_res, "Authentication required", 401);
    return next();
  }

  req.user = {
    id: "user-1",
    cognitoSub: config.mockCognitoSub,
    role: String(req.headers["x-mock-user-role"] || config.mockUserRole).toUpperCase()
  };
  next();
}

module.exports = { mockAuth };
