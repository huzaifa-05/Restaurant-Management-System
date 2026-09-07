const sessionStorageKey = "foodie-we-session";

export const mockGuestUser = {
  id: import.meta.env.VITE_MOCK_USER_ID || "user-1",
  fullName: import.meta.env.VITE_MOCK_USER_NAME || "Foodie WE Guest",
  email: import.meta.env.VITE_MOCK_USER_EMAIL || "guest@foodie-we.local",
  role: (import.meta.env.VITE_MOCK_USER_ROLE || "USER").toUpperCase()
};

export function readStoredUser() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(sessionStorageKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeUserSession(user) {
  if (typeof window === "undefined") return;
  if (!user) {
    window.localStorage.removeItem(sessionStorageKey);
    return;
  }

  window.localStorage.setItem(sessionStorageKey, JSON.stringify(user));
}

export function getMockAuthHeaders() {
  const currentUser = readStoredUser() || mockGuestUser;
  return {
    "x-mock-user-id": currentUser.id,
    "x-mock-user-role": currentUser.role
  };
}
