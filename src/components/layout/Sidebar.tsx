import { Bot, Database, Settings, Upload } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/chat/default", label: "Chat", icon: Bot },
  { to: "/knowledge", label: "Knowledge", icon: Database },
  { to: "/ingestion", label: "Ingestion", icon: Upload },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="flex w-72 flex-col border-r border-zinc-800 bg-zinc-900">
      <div className="border-b border-zinc-800 px-5 py-4">
        <div className="text-lg font-semibold">Interview Copilot</div>
        <div className="mt-1 text-sm text-zinc-400">
          Recruiter, HR, and interview Q&A assistant
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${
                isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-800/70 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-zinc-800 p-4 text-xs text-zinc-500">
        Backend: rag-infra-go
      </div>
    </aside>
  );
}