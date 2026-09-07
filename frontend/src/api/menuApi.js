import { API_URLS } from "./config";
import { apiRequest } from "./http";

export const menuApi = {
  getMenu: () => apiRequest(API_URLS.menu),
  getItems: () => apiRequest(`${API_URLS.menu}/items`),
  getItem: (id) => apiRequest(`${API_URLS.menu}/items/${id}`),
  getCategory: (category) => apiRequest(`${API_URLS.menu}/category/${encodeURIComponent(category)}`),
  createItem: (payload) =>
    apiRequest(`${API_URLS.menu}/items`, {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateItem: (id, payload) =>
    apiRequest(`${API_URLS.menu}/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  deleteItem: (id) =>
    apiRequest(`${API_URLS.menu}/items/${id}`, {
      method: "DELETE"
    }),
  setAvailability: (id, available) =>
    apiRequest(`${API_URLS.menu}/items/${id}/availability`, {
      method: "PATCH",
      body: JSON.stringify({ available })
    })
};
