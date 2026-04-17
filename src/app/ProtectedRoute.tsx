import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth";

type Props = {
  requireRole?: string; // note: matches your current App.tsx usage
};

export default function ProtectedRoute({ requireRole }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Role check (for admin routes)
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }

  // Authorized → render nested routes
  return <Outlet />;
}