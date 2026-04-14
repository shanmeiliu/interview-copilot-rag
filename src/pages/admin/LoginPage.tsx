import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/auth";

const API_BASE = "http://localhost:8080";

export default function LoginPage() {
  const { login, isAuthenticated, getDefaultRoute, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requestedFrom = (location.state as { from?: string } | null)?.from;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(requestedFrom || getDefaultRoute(), { replace: true });
    }
  }, [isAuthenticated, requestedFrom, getDefaultRoute, navigate, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${API_BASE}/api/auth/google/start`;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl shadow-black/20">
        <div className="text-2xl font-semibold tracking-tight">Sign in</div>
        <div className="mt-2 text-sm text-zinc-400">
          Access Interview Copilot with Google or with your assigned username and password.
        </div>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
          >
            Continue with Google
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-800" />
          <div className="text-xs uppercase tracking-wide text-zinc-500">or</div>
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-zinc-300">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
              placeholder="admin or recruiter-xxxxx"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-zinc-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
              placeholder="••••••••"
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in with password"}
          </button>
        </form>
      </div>
    </div>
  );
}