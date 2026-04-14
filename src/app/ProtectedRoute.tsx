import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./auth";

type Props = {
  requireRole?: "admin" | "recruiter";
};

export default function ProtectedRoute({ requireRole }: Props) {
  const { isAuthenticated, isLoading, user, getDefaultRoute } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireRole && user?.role !== requireRole) {
    return <Navigate to={getDefaultRoute()} replace />;
  }

  return <Outlet />;
}