import { Outlet, NavLink, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const navItems = [
    { to: "/admin/knowledge", label: "Knowledge" },
    { to: "/admin/ingestion", label: "Ingestion" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/settings", label: "Settings" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <aside className="w-64 border-r border-zinc-800 bg-zinc-900 p-6">
        <div className="mb-8 text-lg font-semibold tracking-tight">
          🧠 Admin Panel
        </div>

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "rounded-xl px-3 py-2 text-sm transition",
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
          <div className="text-sm text-zinc-400">
            Admin / Knowledge System
          </div>

          <button
            onClick={() => navigate("/")}
            className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
          >
            💬 Back to Chat
          </button>
        </div>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}