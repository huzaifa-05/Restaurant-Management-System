import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mockGuestUser, readStoredUser, storeUserSession } from "../config/mockAuth";
import {
  restoreCognitoSession,
  signInWithCognito,
  signOutFromCognito,
  usesCognitoAuth
} from "../config/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => (usesCognitoAuth ? null : readStoredUser()));
  const [isLoading, setIsLoading] = useState(usesCognitoAuth);

  useEffect(() => {
    if (usesCognitoAuth) return;
    storeUserSession(currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (!usesCognitoAuth) return undefined;
    let active = true;
    restoreCognitoSession()
      .then((session) => {
        if (active) setCurrentUser(session?.user || null);
      })
      .catch(() => {
        if (active) setCurrentUser(null);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isLoading,
      isAuthenticated: Boolean(currentUser),
      async signIn(user) {
        if (usesCognitoAuth) {
          const authenticatedUser = await signInWithCognito(user.email, user.password);
          setCurrentUser(authenticatedUser);
          return authenticatedUser;
        }
        setCurrentUser({
          id: user.id || mockGuestUser.id,
          fullName: user.fullName,
          email: user.email,
          role: (user.role || "CUSTOMER").toUpperCase()
        });
      },
      signOut() {
        if (usesCognitoAuth) signOutFromCognito();
        setCurrentUser(null);
      },
      hasRole(role) {
        return currentUser?.role === role;
      },
      isAdmin() {
        return currentUser?.role === "ADMIN";
      },
      isStaff() {
        return currentUser?.role === "STAFF";
      }
    }),
    [currentUser, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
