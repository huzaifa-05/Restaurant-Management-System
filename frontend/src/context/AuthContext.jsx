import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mockGuestUser, readStoredUser, storeUserSession } from "../config/mockAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readStoredUser());

  useEffect(() => {
    storeUserSession(currentUser);
  }, [currentUser]);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      signIn(user) {
        setCurrentUser({
          id: user.id || mockGuestUser.id,
          fullName: user.fullName,
          email: user.email,
          role: (user.role || "USER").toUpperCase()
        });
      },
      signOut() {
        setCurrentUser(null);
      },
      hasRole(role) {
        return currentUser?.role === role;
      },
      isAdmin() {
        return currentUser?.role === "ADMIN";
      }
    }),
    [currentUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
