import { Outlet } from "react-router-dom";
import AppTopNav from "../../components/layout/AppTopNav";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <AppTopNav />

      <div className="page-shell py-6 md:py-8">
        <div className="glass-panel soft-border overflow-hidden rounded-[32px]">
          <div className="border-b border-white/5 px-6 py-6 md:px-8">
            <div className="hero-chip">Admin workspace</div>
            <div className="mt-4 text-3xl font-semibold tracking-tight leading-[1.1] md:text-4xl">
              Knowledge and Source Management
            </div>
            <div className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400 md:text-base">
              Manage uploaded documents, GitHub sources, ingestion workflows, users, and configuration for the recruiter-facing assistant.
            </div>
          </div>

          <div className="p-0">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}