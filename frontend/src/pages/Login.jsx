import { useState } from "react";
import { LogIn } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { mockGuestUser } from "../config/mockAuth";
import { useAuth } from "../context/AuthContext.jsx";

function getNextPath(search) {
  const params = new URLSearchParams(search);
  return params.get("next") || "/";
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: ""
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const next = getNextPath(location.search);
    signIn({
      id: mockGuestUser.id,
      fullName: form.fullName.trim() || "Foodie WE Customer",
      email: form.email.trim() || "customer@foodie-we.local",
      role: mockGuestUser.role
    });
    navigate(next, { replace: true });
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
            Full name
            <input name="fullName" value={form.fullName} onChange={updateField} placeholder="Your name" />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" />
          </label>
          <p className="form-note">
            You need to sign in before checkout. Menu browsing stays public.
          </p>
          <button className="primary-button full" type="submit">
            <LogIn size={18} />
            Continue to checkout
          </button>
        </form>
      </div>
    </section>
  );
}
