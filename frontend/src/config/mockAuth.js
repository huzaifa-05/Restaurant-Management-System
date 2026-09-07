export const mockCurrentUser = {
  id: import.meta.env.VITE_MOCK_USER_ID || "user-1",
  fullName: import.meta.env.VITE_MOCK_USER_NAME || "Foodie WE Guest",
  role: (import.meta.env.VITE_MOCK_USER_ROLE || "USER").toUpperCase()
};

export function getMockAuthHeaders() {
  return {
    "x-mock-user-id": mockCurrentUser.id,
    "x-mock-user-role": mockCurrentUser.role
  };
}
