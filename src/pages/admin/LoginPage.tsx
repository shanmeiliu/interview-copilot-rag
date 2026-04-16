import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/auth";
import { signupRecruiter } from "../../lib/api";
import AssistantAvatar from "../../components/chat/AssistantAvatar";

const API_BASE = "http://localhost:8080";

type Mode = "login" | "signup";

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
    >
      <path
        d="M21.805 12.23c0-.77-.069-1.508-.197-2.216H12v4.196h5.49a4.695 4.695 0 0 1-2.038 3.082v2.56h3.296c1.929-1.777 3.057-4.395 3.057-7.622Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.76 0 5.076-.914 6.768-2.148l-3.296-2.56c-.914.613-2.084.975-3.472.975-2.669 0-4.93-1.802-5.737-4.223H2.86v2.64A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.263 14.044A5.997 5.997 0 0 1 5.94 12c0-.71.122-1.398.323-2.044v-2.64H2.86A10 10 0 0 0 2 12c0 1.614.386 3.143.86 4.684l3.403-2.64Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.733c1.501 0 2.85.516 3.91 1.53l2.93-2.93C17.072 2.687 14.757 2 12 2A10 10 0 0 0 2.86 7.316l3.403 2.64C7.07 7.535 9.331 5.733 12 5.733Z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { login, isAuthenticated, getDefaultRoute, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requestedFrom = (location.state as { from?: string } | null)?.from;
  const [mode, setMode] = useState<Mode>("login");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [signupPassword, setSignupPassword] = useState("");
  const [signupDisplayName, setSignupDisplayName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [createdUsername, setCreatedUsername] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate(requestedFrom || getDefaultRoute(), { replace: true });
    }
  }, [isAuthenticated, requestedFrom, getDefaultRoute, navigate, user]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCreatedUsername("");

    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCreatedUsername("");

    try {
      const data = await signupRecruiter({
        password: signupPassword,
        display_name: signupDisplayName || undefined,
        email: signupEmail || undefined,
      });

      if (data?.user?.username) {
        setCreatedUsername(data.user.username);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    window.location.href = `${API_BASE}/api/auth/google/start`;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 gap-8 px-4 py-6 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="fade-up flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-300">
            <AssistantAvatar size="sm" />
            <span>Charmaine Cat</span>
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
            Interview Copilot
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400">
            A recruiter-facing AI representative that answers questions about
            Charmaine’s background, technical experience, projects, and role fit.
          </p>

          <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/80">
              <div className="text-sm font-semibold text-zinc-100">
                For recruiters and HR
              </div>
              <p className="mt-2 text-sm leading-7 text-zinc-400">
                Ask about backend skills, AI systems, technical projects,
                architecture decisions, and role fit.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/80">
              <div className="text-sm font-semibold text-zinc-100">
                Grounded responses
              </div>
              <p className="mt-2 text-sm leading-7 text-zinc-400">
                Responses are grounded in resume content, GitHub repositories,
                and curated supporting materials.
              </p>
            </div>
          </div>

          <div className="mt-10 max-w-2xl rounded-[30px] border border-zinc-800 bg-zinc-900/50 p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-100">
                  Example questions
                </div>
                <div className="mt-1 text-sm text-zinc-500">
                  The kinds of questions this assistant can answer
                </div>
              </div>
              <AssistantAvatar size="md" />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Can you summarize Charmaine's background?",
                "What experience does she have with AI systems?",
                "What are her strongest backend skills?",
                "Can you explain one of her projects?",
              ].map((q) => (
                <div
                  key={q}
                  className="rounded-full border border-zinc-700 bg-zinc-950/70 px-3 py-1.5 text-xs text-zinc-300"
                >
                  {q}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="fade-in flex items-center justify-center">
          <div className="floating-panel w-full max-w-md rounded-[34px] border border-zinc-800 bg-zinc-900/85 p-8 backdrop-blur">
            <div className="flex items-center gap-3">
              <AssistantAvatar size="md" />
              <div>
                <div className="text-xl font-semibold tracking-tight">
                  Sign in
                </div>
                <div className="mt-1 text-sm text-zinc-400">
                  Access Interview Copilot with Google or a local account.
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-zinc-950 p-1">
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                  setCreatedUsername("");
                }}
                className={`rounded-xl px-4 py-2.5 text-sm transition ${
                  mode === "login"
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode("signup");
                  setError("");
                  setCreatedUsername("");
                }}
                className={`rounded-xl px-4 py-2.5 text-sm transition ${
                  mode === "signup"
                    ? "bg-white text-black shadow-sm"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3.5 text-sm font-medium text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-800"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-800" />
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                or
              </div>
              <div className="h-px flex-1 bg-zinc-800" />
            </div>

            {mode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Username
                  </label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="soft-ring w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
                    placeholder="admin or recruiter-xxxxx"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Password
                  </label>
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    className="soft-ring w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
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
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign in with password"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Display Name
                  </label>
                  <input
                    value={signupDisplayName}
                    onChange={(e) => setSignupDisplayName(e.target.value)}
                    className="soft-ring w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
                    placeholder="Recruiter Name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Email
                  </label>
                  <input
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    type="email"
                    className="soft-ring w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
                    placeholder="optional@example.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-zinc-300">
                    Password
                  </label>
                  <input
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    type="password"
                    className="soft-ring w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none placeholder:text-zinc-500"
                    placeholder="At least 8 characters"
                  />
                </div>

                {createdUsername ? (
                  <div className="rounded-2xl border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
                    Account created. Your username is{" "}
                    <span className="font-semibold">{createdUsername}</span>.
                    You are now signed in.
                  </div>
                ) : null}

                {error ? (
                  <div className="rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create local account"}
                </button>
              </form>
            )}

            <div className="mt-6 text-center text-xs leading-6 text-zinc-500">
              By signing in, recruiters and HR can interact with Charmaine Cat
              to learn about Charmaine’s background and technical experience.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}