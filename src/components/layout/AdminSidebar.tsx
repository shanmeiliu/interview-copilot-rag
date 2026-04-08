import { Database, LogOut, Settings, Upload } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/auth";

const navItems = [
  { to: "/admin/knowledge", label: "Knowledge", icon: Database },
  { to: "/admin/ingestion", label: "Ingestion", icon: Upload },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <aside className="flex w-72 flex-col border-r border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-5 py-4">
        <div className="text-lg font-semibold">Copilot Admin</div>
        <div className="mt-1 text-sm text-zinc-400">
          Private knowledge and ingestion controls
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm ${
                isActive
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-800/70 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-zinc-800 p-4">
        <div className="mb-3 text-xs text-zinc-500">
          Signed in as {user?.email ?? "admin"}
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}