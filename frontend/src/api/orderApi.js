import { API_URLS } from "./config";
import { apiRequest } from "./http";

export const orderApi = {
  createOrder: (payload) =>
    apiRequest(API_URLS.order, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  getOrder: (id) => apiRequest(`${API_URLS.order}/${id}`),
  listOrders: () => apiRequest(API_URLS.order),
  getUserOrders: (userId) => apiRequest(`${API_URLS.order}/user/${userId}`),
  updateStatus: (id, status) =>
    apiRequest(`${API_URLS.order}/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    }),
  cancelOrder: (id) =>
    apiRequest(`${API_URLS.order}/${id}/cancel`, {
      method: "POST"
    })
};
