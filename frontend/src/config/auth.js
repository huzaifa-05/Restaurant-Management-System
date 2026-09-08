import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from "amazon-cognito-identity-js";
import { API_URLS } from "../api/config";

const authMode = import.meta.env.VITE_AUTH_MODE || (import.meta.env.PROD ? "cognito" : "mock");
const configuredAuth = {
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID
};
let authConfigPromise;

export const usesCognitoAuth = authMode === "cognito";

async function getAuthConfig() {
  if (configuredAuth.userPoolId && configuredAuth.clientId) return configuredAuth;

  if (!authConfigPromise) {
    authConfigPromise = fetch(`${API_URLS.user}/auth-config`)
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok || !body.success || !body.data?.userPoolId || !body.data?.clientId) {
          throw new Error(body.message || "Cognito authentication is not configured for this application.");
        }
        return body.data;
      })
      .catch((error) => {
        authConfigPromise = null;
        throw error;
      });
  }
  return authConfigPromise;
}

async function getPool() {
  const authConfig = await getAuthConfig();
  return new CognitoUserPool({ UserPoolId: authConfig.userPoolId, ClientId: authConfig.clientId });
}

function toUser(session) {
  const claims = session.getIdToken().decodePayload();
  const groups = claims["cognito:groups"] || [];
  const role = groups.some((group) => ["admins", "admin"].includes(String(group).toLowerCase()))
    ? "ADMIN"
    : groups.some((group) => ["staff", "staffs"].includes(String(group).toLowerCase()))
      ? "STAFF"
      : "CUSTOMER";

  return {
    id: claims.sub,
    fullName: claims.name || claims.email || "Foodie WE Customer",
    email: claims.email || "",
    role
  };
}

function getSessionForUser(user) {
  return new Promise((resolve, reject) => {
    user.getSession((error, session) => {
      if (error || !session?.isValid()) {
        reject(error || new Error("Your session has expired. Please sign in again."));
        return;
      }
      resolve(session);
    });
  });
}

export async function restoreCognitoSession() {
  const pool = await getPool();
  const user = pool.getCurrentUser();
  if (!user) return null;
  const session = await getSessionForUser(user);
  return { user: toUser(session), idToken: session.getIdToken().getJwtToken() };
}

export async function getCognitoAuthorizationHeader() {
  const session = await restoreCognitoSession();
  return session ? { Authorization: `Bearer ${session.idToken}` } : {};
}

export async function signUpWithCognito(email, password) {
  const pool = await getPool();
  return new Promise((resolve, reject) => {
    pool.signUp(
      email.trim(),
      password,
      [new CognitoUserAttribute({ Name: "email", Value: email.trim() })],
      null,
      (error, result) => (error ? reject(error) : resolve(result))
    );
  });
}

export async function confirmCognitoSignUp(email, code) {
  const pool = await getPool();
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email.trim(), Pool: pool });
    user.confirmRegistration(code.trim(), true, (error, result) => (error ? reject(error) : resolve(result)));
  });
}

export async function signInWithCognito(email, password) {
  const pool = await getPool();
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email.trim(), Pool: pool });
    const details = new AuthenticationDetails({ Username: email.trim(), Password: password });
    user.authenticateUser(details, {
      onSuccess: (session) => resolve(toUser(session)),
      onFailure: reject,
      newPasswordRequired: () => reject(new Error("A new password is required before you can sign in."))
    });
  });
}

export async function signOutFromCognito() {
  const pool = await getPool();
  pool.getCurrentUser()?.signOut();
}
