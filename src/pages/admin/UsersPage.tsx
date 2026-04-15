import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { listAdminUsers } from "../../lib/api";

type AdminUser = {
  id: number;
  username: string;
  display_name?: string;
  email?: string | null;
  role: string;
  auth_provider: string;
  status: string;
  created_at?: string;
  last_login_at?: string | null;
  last_seen_at?: string | null;
  expires_at?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        setLoading(true);
        setError("");
        const data = (await listAdminUsers(200)) as { users: AdminUser[] };
        setUsers(data.users ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <PageHeader
        title="Users"
        description="View admin and recruiter accounts created through local signup or Google login."
      />

      <div className="p-6">
        <div className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900">
          {loading ? (
            <div className="p-6 text-sm text-zinc-400">Loading users...</div>
          ) : error ? (
            <div className="p-6 text-sm text-red-300">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-zinc-800 bg-zinc-950/50 text-zinc-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Username</th>
                    <th className="px-4 py-3 font-medium">Display Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Provider</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium">Last Login</th>
                    <th className="px-4 py-3 font-medium">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-zinc-800/60">
                      <td className="px-4 py-3 text-zinc-100">{user.username}</td>
                      <td className="px-4 py-3 text-zinc-300">{user.display_name || "—"}</td>
                      <td className="px-4 py-3 text-zinc-300">{user.email || "—"}</td>
                      <td className="px-4 py-3 text-zinc-300">{user.role}</td>
                      <td className="px-4 py-3 text-zinc-300">{user.auth_provider}</td>
                      <td className="px-4 py-3 text-zinc-300">{user.status}</td>
                      <td className="px-4 py-3 text-zinc-400">{formatDate(user.created_at)}</td>
                      <td className="px-4 py-3 text-zinc-400">{formatDate(user.last_login_at)}</td>
                      <td className="px-4 py-3 text-zinc-400">{formatDate(user.expires_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}