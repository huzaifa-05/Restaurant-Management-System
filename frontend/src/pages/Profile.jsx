import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { userApi } from "../api/userApi";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    userApi
      .getMe()
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    try {
      const updated = await userApi.updateMe(profile);
      setProfile(updated);
      setMessage("Profile saved.");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <LoadingState label="Loading profile" />;
  if (error && !profile) return <ErrorState message={error} />;

  return (
    <section className="page-shell narrow">
      <div className="page-heading">
        <p className="eyebrow">Signed in as {currentUser.role}</p>
        <h1>Profile</h1>
      </div>
      <form className="checkout-form" onSubmit={submit}>
        <label>
          Full name
          <input name="fullName" value={profile.fullName} onChange={updateField} />
        </label>
        <label>
          Email
          <input name="email" type="email" value={profile.email} onChange={updateField} />
        </label>
        <label>
          Phone
          <input name="phone" value={profile.phone} onChange={updateField} />
        </label>
        {message && <p className="form-success">{message}</p>}
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" type="submit">
          <Save size={18} />
          Save Profile
        </button>
      </form>
    </section>
  );
}
