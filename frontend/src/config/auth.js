import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool
} from "amazon-cognito-identity-js";

const authMode = import.meta.env.VITE_AUTH_MODE || (import.meta.env.PROD ? "cognito" : "mock");
const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;

export const usesCognitoAuth = authMode === "cognito";

function getPool() {
  if (!userPoolId || !clientId) {
    throw new Error("Cognito authentication is not configured for this application.");
  }
  return new CognitoUserPool({ UserPoolId: userPoolId, ClientId: clientId });
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
  const user = getPool().getCurrentUser();
  if (!user) return null;
  const session = await getSessionForUser(user);
  return { user: toUser(session), idToken: session.getIdToken().getJwtToken() };
}

export async function getCognitoAuthorizationHeader() {
  const session = await restoreCognitoSession();
  return session ? { Authorization: `Bearer ${session.idToken}` } : {};
}

export function signUpWithCognito(email, password) {
  return new Promise((resolve, reject) => {
    getPool().signUp(
      email.trim(),
      password,
      [new CognitoUserAttribute({ Name: "email", Value: email.trim() })],
      null,
      (error, result) => (error ? reject(error) : resolve(result))
    );
  });
}

export function confirmCognitoSignUp(email, code) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email.trim(), Pool: getPool() });
    user.confirmRegistration(code.trim(), true, (error, result) => (error ? reject(error) : resolve(result)));
  });
}

export function signInWithCognito(email, password) {
  return new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email.trim(), Pool: getPool() });
    const details = new AuthenticationDetails({ Username: email.trim(), Password: password });
    user.authenticateUser(details, {
      onSuccess: (session) => resolve(toUser(session)),
      onFailure: reject,
      newPasswordRequired: () => reject(new Error("A new password is required before you can sign in."))
    });
  });
}

export function signOutFromCognito() {
  getPool().getCurrentUser()?.signOut();
}
