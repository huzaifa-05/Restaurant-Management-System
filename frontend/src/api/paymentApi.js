import { API_URLS } from "./config";
import { apiRequest } from "./http";

export const paymentApi = {
  createPayment: (payload) =>
    apiRequest(API_URLS.payment, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getPayment: (id) => apiRequest(`${API_URLS.payment}/${id}`),
  getOrderPayments: (orderId) => apiRequest(`${API_URLS.payment}/order/${orderId}`),
  refundPayment: (id) =>
    apiRequest(`${API_URLS.payment}/${id}/refund`, {
      method: "POST"
    })
};
