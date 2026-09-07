import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export function ProtectedAdminRoute() {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin()) {
    return <Navigate to="/unauthorized" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
