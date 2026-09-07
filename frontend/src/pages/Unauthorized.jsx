import { Link, useLocation } from "react-router-dom";

export function Unauthorized() {
  const location = useLocation();

  return (
    <section className="page-shell narrow">
      <div className="state-box unauthorized">
        <div>
          <p className="eyebrow">Unauthorized</p>
          <h1>Admin access required</h1>
          <p>{location.state?.from || "This page"} is only available to Foodie WE admins.</p>
          <Link className="primary-button" to="/">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
