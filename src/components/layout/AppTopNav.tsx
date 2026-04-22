import { NavLink, useNavigate } from "react-router-dom";
import AssistantAvatar from "../chat/AssistantAvatar";
import { useAuth } from "../../app/auth";

export default function AppTopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-xl px-3 py-2 text-sm transition",
      isActive
        ? "bg-zinc-800 text-white"
        : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
    ].join(" ");

  return (
    <div className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
      <div className="page-shell flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <AssistantAvatar size="sm" />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-zinc-100">
              Interview Copilot
            </div>
            <div className="truncate text-xs text-zinc-500">
              Charmaine Cat
            </div>
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" end className={linkClass}>
            💬 Chat
          </NavLink>

          {isAdmin && (
            <NavLink to="/admin/knowledge" className={linkClass}>
              🧠 Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right md:block">
            <div className="text-sm text-zinc-200">
              {user?.display_name || user?.username || "User"}
            </div>
            <div className="text-xs text-zinc-500">
              {user?.role || "guest"}
              {user?.auth_provider ? ` • ${user.auth_provider}` : ""}
            </div>
          </div>

          <button
            onClick={() => void handleLogout()}
            className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="page-shell flex gap-2 overflow-x-auto pb-3 md:hidden">
        <NavLink to="/" end className={linkClass}>
          💬 Chat
        </NavLink>

        {isAdmin && (
          <NavLink to="/admin/knowledge" className={linkClass}>
            🧠 Admin
          </NavLink>
        )}
      </div>
    </div>
  );
}