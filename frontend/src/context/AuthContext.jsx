import { createContext, useContext, useMemo } from "react";
import { mockCurrentUser } from "../config/mockAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const value = useMemo(
    () => ({
      currentUser: mockCurrentUser,
      hasRole(role) {
        return mockCurrentUser.role === role;
      },
      isAdmin() {
        return mockCurrentUser.role === "ADMIN";
      }
    }),
    []
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
