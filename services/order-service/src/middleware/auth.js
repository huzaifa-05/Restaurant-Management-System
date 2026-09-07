const { error } = require("../utils/apiResponse");
const { config } = require("../config");

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
  return {
    id: userId,
    email: req.headers["x-user-email"] || claims.email || "",
    groups,
    role: groups.includes("Admins") || groups.includes("ADMIN") ? "ADMIN" : "USER"
  };
}

function resolveMockUser(req) {
  if (String(req.headers["x-mock-authenticated"]).toLowerCase() === "false") return null;

  return {
    id: req.headers["x-mock-user-id"] || process.env.MOCK_USER_ID || "user-1",
    role: String(req.headers["x-mock-user-role"] || process.env.MOCK_USER_ROLE || "USER").toUpperCase()
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

function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user.role !== "ADMIN") {
      return error(res, "Admin access required", 403);
    }
    return next();
  });
}

module.exports = { requireAuth, requireAdmin, resolveCurrentUser };
