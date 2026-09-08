function trimTrailingSlash(value) {
  return value ? value.replace(/\/$/, "") : "";
}

const apiBaseUrl = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || "");

function isLocalDevelopmentHost() {
  if (typeof window === "undefined") return false;
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function serviceUrl(envUrl, localOrigin, apiPath) {
  if (apiBaseUrl) return `${apiBaseUrl}${apiPath}`;
  if (!isLocalDevelopmentHost()) return apiPath;
  return `${trimTrailingSlash(envUrl || localOrigin)}${apiPath}`;
}

export const API_URLS = {
  user: serviceUrl(import.meta.env.VITE_USER_API_URL, "http://localhost:5001", "/api/users"),
  menu: serviceUrl(import.meta.env.VITE_MENU_API_URL, "http://localhost:5002", "/api/menu"),
  order: serviceUrl(import.meta.env.VITE_ORDER_API_URL, "http://localhost:5003", "/api/orders"),
  payment: serviceUrl(import.meta.env.VITE_PAYMENT_API_URL, "http://localhost:5004", "/api/payments")
};
