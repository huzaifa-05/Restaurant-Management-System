const { error } = require("../utils/apiResponse");
const { config } = require("../config");

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
    email: req.headers["x-user-email"] || "",
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
