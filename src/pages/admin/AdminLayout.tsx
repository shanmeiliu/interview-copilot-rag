import { Outlet } from "react-router-dom";
import AdminSidebar from "../../components/layout/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <AdminSidebar />
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}