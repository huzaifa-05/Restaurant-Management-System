const { config } = require("../config");
const { AppError } = require("../utils/AppError");
const { logger } = require("../utils/logger");

function buildHeaders() {
  const headers = { Accept: "application/json" };
  if (config.internalServiceToken) {
    headers["x-service-token"] = config.internalServiceToken;
  }
  return headers;
}

async function fetchOrder(orderId) {
  const url = `${config.orderServiceUrl}/api/orders/internal/${orderId}`;
  logger.info("order service request", { orderId, url });
  const response = await fetch(url, { headers: buildHeaders() });
  if (response.status === 404) {
    throw new AppError("Order not found", 404);
  }
  if (!response.ok) {
    throw new AppError("Order service unavailable", 502);
  }

  const body = await response.json();
  if (!body.success || !body.data) {
    throw new AppError("Order not found", 404);
  }

  return body.data;
}

async function updatePaymentStatus(orderId, paymentStatus) {
  const url = `${config.orderServiceUrl}/api/orders/internal/${orderId}/payment-status`;
  logger.info("order payment status update", { orderId, paymentStatus, url });
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      ...buildHeaders(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ paymentStatus })
  });

  if (response.status === 404) {
    throw new AppError("Order not found", 404);
  }
  if (!response.ok) {
    throw new AppError("Order service unavailable", 502);
  }

  const body = await response.json();
  if (!body.success || !body.data) {
    throw new AppError("Order update failed", 502);
  }

  return body.data;
}

module.exports = { fetchOrder, updatePaymentStatus };
