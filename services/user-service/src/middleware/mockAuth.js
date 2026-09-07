const { config } = require("../config");
const { error } = require("../utils/apiResponse");

function normalizeRole(role) {
  const value = String(role || "").toUpperCase();
  if (!value || value === "USER") return "CUSTOMER";
  return value;
}

function parseGroups(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((group) => group.trim())
    .filter(Boolean);
}

function resolveGatewayUser(req) {
  const userId = req.headers["x-user-id"] || req.headers["x-user-sub"];
  if (!userId) return null;

  const groups = parseGroups(req.headers["x-user-groups"]);
  const role = normalizeRole(
    req.headers["x-user-role"] ||
      (groups.some((group) => ["ADMINS", "ADMIN"].includes(group.toUpperCase())) ? "ADMIN" :
        groups.some((group) => ["STAFF", "STAFFS"].includes(group.toUpperCase())) ? "STAFF" : "CUSTOMER")
  );
  return {
    id: userId,
    cognitoSub: userId,
    email: req.headers["x-user-email"] || "",
    fullName: req.headers["x-user-name"] || "",
    groups,
    role
  };
}

function mockAuth(req, _res, next) {
  if (config.env === "production") {
    req.user = resolveGatewayUser(req);
    if (!req.user) return error(_res, "Authentication required", 401);
    return next();
  }

  if (String(req.headers["x-mock-authenticated"]).toLowerCase() !== "true") {
    return error(_res, "Authentication required", 401);
  }

  req.user = {
    id: req.headers["x-mock-user-id"] || "user-1",
    cognitoSub: req.headers["x-mock-user-id"] || config.mockCognitoSub,
    email: req.headers["x-mock-user-email"] || "",
    fullName: req.headers["x-mock-user-name"] || "",
    role: normalizeRole(req.headers["x-mock-user-role"] || config.mockUserRole)
  };
  next();
}

module.exports = { mockAuth };
