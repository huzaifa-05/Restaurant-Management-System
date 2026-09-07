const { error } = require("../utils/apiResponse");
const { config } = require("../config");

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

function decodeJwtPayload(authorizationHeader) {
  if (!authorizationHeader) return {};

  const [scheme, token] = String(authorizationHeader).split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return {};

  const parts = token.split(".");
  if (parts.length < 2) return {};

  const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const padded = payload.padEnd(Math.ceil(payload.length / 4) * 4, "=");

  try {
    return JSON.parse(Buffer.from(padded, "base64").toString("utf8"));
  } catch {
    return {};
  }
}

function resolveGatewayUser(req) {
  const claims = decodeJwtPayload(req.headers.authorization);
  const userId = req.headers["x-user-id"] || claims.sub;
  if (!userId) return null;
  const groups = parseGroups(req.headers["x-user-groups"] || claims["cognito:groups"]);
  const role = normalizeRole(
    req.headers["x-user-role"] ||
      (groups.some((group) => ["ADMINS", "ADMIN"].includes(group.toUpperCase())) ? "ADMIN" :
        groups.some((group) => ["STAFF", "STAFFS"].includes(group.toUpperCase())) ? "STAFF" : "CUSTOMER")
  );
  return {
    id: userId,
    email: req.headers["x-user-email"] || claims.email || "",
    groups,
    role
  };
}

function resolveMockUser(req) {
  if (String(req.headers["x-mock-authenticated"]).toLowerCase() !== "true") return null;

  return {
    id: req.headers["x-mock-user-id"] || process.env.MOCK_USER_ID || "user-1",
    email: req.headers["x-mock-user-email"] || "",
    fullName: req.headers["x-mock-user-name"] || "",
    role: normalizeRole(req.headers["x-mock-user-role"] || process.env.MOCK_USER_ROLE || "CUSTOMER")
  };
}

function resolveCurrentUser(req) {
  return config.env === "production" ? resolveGatewayUser(req) : resolveMockUser(req);
}

function requireAuth(req, res, next) {
  const user = resolveCurrentUser(req);
  if (!user) return error(res, "Authentication required", 401);

  req.user = user;
  return next();
}

function requireStaffOrAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (!["STAFF", "ADMIN"].includes(req.user.role)) {
      return error(res, "Staff access required", 403);
    }
    return next();
  });
}

const requireAdmin = requireStaffOrAdmin;

module.exports = { requireAuth, requireAdmin, requireStaffOrAdmin, resolveCurrentUser };
