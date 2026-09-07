import { getMockAuthHeaders } from "../config/mockAuth";

export async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...getMockAuthHeaders(),
      ...(options.headers || {})
    },
    ...options
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.success === false) {
    throw new Error(body.message || "Request failed");
  }
  return body.data;
}
