import { useState } from "react";
import { LogIn } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { mockGuestUser } from "../config/mockAuth";
import { confirmCognitoSignUp, signUpWithCognito, usesCognitoAuth } from "../config/auth";
import { useAuth } from "../context/AuthContext.jsx";

function getNextPath(search) {
  const params = new URLSearchParams(search);
  return params.get("next") || "/";
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", code: "" });
  const [mode, setMode] = useState("sign-in");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const next = getNextPath(location.search);
    try {
      if (!usesCognitoAuth) {
        await signIn({
          id: mockGuestUser.id,
          fullName: form.fullName.trim() || "Foodie WE Customer",
          email: form.email.trim() || "customer@foodie-we.local",
          role: mockGuestUser.role
        });
        navigate(next, { replace: true });
        return;
      }

      if (mode === "sign-up") {
        await signUpWithCognito(form.email, form.password);
        setMode("confirm");
        return;
      }
      if (mode === "confirm") {
        await confirmCognitoSignUp(form.email, form.code);
        await signIn({ email: form.email, password: form.password });
        navigate(next, { replace: true });
        return;
      }

      await signIn({ email: form.email, password: form.password });
      navigate(next, { replace: true });
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page-shell narrow">
      <div className="page-heading">
        <p className="eyebrow">Sign in required</p>
        <h1>Login to place your order</h1>
      </div>
      <div className="state-box">
        <form className="checkout-form" onSubmit={submit}>
          <label>
            {usesCognitoAuth ? "Email" : "Full name"}
            {usesCognitoAuth ? (
              <input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" required />
            ) : (
              <input name="fullName" value={form.fullName} onChange={updateField} placeholder="Your name" />
            )}
          </label>
          {usesCognitoAuth && mode !== "confirm" && (
            <label>
              Password
              <input name="password" type="password" value={form.password} onChange={updateField} minLength="8" required />
            </label>
          )}
          {usesCognitoAuth && mode === "confirm" && (
            <label>
              Verification code
              <input name="code" value={form.code} onChange={updateField} inputMode="numeric" required />
            </label>
          )}
          {error && <p className="form-error">{error}</p>}
          <button className="primary-button full" disabled={submitting} type="submit">
            <LogIn size={18} />
            {submitting ? "Please wait" : mode === "sign-up" ? "Create account" : mode === "confirm" ? "Confirm account" : "Sign in"}
          </button>
          {usesCognitoAuth && mode !== "confirm" && (
            <button className="text-button" type="button" onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}>
              {mode === "sign-in" ? "Create an account" : "I already have an account"}
            </button>
          )}
        </form>
      </div>
    </section>
  );
}
