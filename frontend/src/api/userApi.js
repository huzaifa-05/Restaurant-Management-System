import { API_URLS } from "./config";
import { apiRequest } from "./http";

export const userApi = {
  getMe: () => apiRequest(`${API_URLS.user}/me`),
  updateMe: (payload) =>
    apiRequest(`${API_URLS.user}/me`, {
      method: "PUT",
      body: JSON.stringify(payload)
    })
};
