import { getMockAuthHeaders } from "../config/mockAuth";
import { getCognitoAuthorizationHeader, usesCognitoAuth } from "../config/auth";

export async function apiRequest(url, options = {}) {
  const authHeaders = usesCognitoAuth ? await getCognitoAuthorizationHeader() : getMockAuthHeaders();
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
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
