import { Navigate, Outlet } from "react-router-dom";
import { authenticatedFetch, isAuthenticated } from "../utils/auth";
import { useEffect } from "react";

export function ProtectedRoutes() {
  useEffect(() => {
    async function verifyToken() {
      await authenticatedFetch(
        `${import.meta.env.VITE_API_URL}/auth/is-first-login`
      );
    }
    verifyToken();
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
