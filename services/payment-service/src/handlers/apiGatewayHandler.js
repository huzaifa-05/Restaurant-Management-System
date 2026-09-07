const { PaymentService } = require("../services/paymentService");
const { AppError } = require("../utils/AppError");

const paymentService = new PaymentService();

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  };
}

function parseBody(event) {
  if (!event.body) return {};
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
  try {
    return JSON.parse(rawBody);
  } catch (_err) {
    throw new AppError("Invalid JSON body", 400);
  }
}

function getMethod(event) {
  return event.requestContext?.http?.method || event.httpMethod || "GET";
}

function getPath(event) {
  return event.rawPath || event.path || "/";
}

function getPaymentId(event, path) {
  if (event.pathParameters?.paymentId) return event.pathParameters.paymentId;
  if (event.pathParameters?.id) return event.pathParameters.id;
  const match = path.match(/^\/api\/payments\/([^/]+)(?:\/refund)?$/);
  return match ? match[1] : null;
}

function getOrderId(event, path) {
  if (event.pathParameters?.orderId) return event.pathParameters.orderId;
  const match = path.match(/^\/api\/payments\/order\/([^/]+)$/);
  return match ? match[1] : null;
}

async function routePaymentRequest(event) {
  const method = getMethod(event).toUpperCase();
  const path = getPath(event);

  if (method === "POST" && path === "/api/payments") {
    return jsonResponse(201, { success: true, data: await paymentService.createPayment(parseBody(event)) });
  }

  if (method === "GET" && /^\/api\/payments\/order\/[^/]+$/.test(path)) {
    return jsonResponse(200, { success: true, data: await paymentService.getOrderPayments(getOrderId(event, path)) });
  }

  if (method === "GET" && /^\/api\/payments\/[^/]+$/.test(path)) {
    return jsonResponse(200, { success: true, data: await paymentService.getPayment(getPaymentId(event, path)) });
  }

  if (method === "POST" && /^\/api\/payments\/[^/]+\/refund$/.test(path)) {
    return jsonResponse(200, { success: true, data: await paymentService.refundPayment(getPaymentId(event, path)) });
  }

  if (method === "POST" && path === "/api/payments/webhook") {
    return jsonResponse(200, { success: true, data: await paymentService.processWebhook(parseBody(event)) });
  }

  throw new AppError("Route not found", 404);
}

async function handler(event) {
  try {
    return await routePaymentRequest(event);
  } catch (err) {
    const statusCode = err.statusCode || 500;
    return jsonResponse(statusCode, {
      success: false,
      message: statusCode === 500 ? "Internal server error" : err.message
    });
  }
}

module.exports = { handler, routePaymentRequest };
