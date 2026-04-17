import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type AuthUser = {
  id: number;
  username: string;
  display_name?: string;
  email?: string | null;
  role: "admin" | "recruiter";
  auth_provider: "local" | "google";
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getDefaultRoute: (user: AuthUser | null) => string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const API_BASE = "http://localhost:8080";

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshSession() {
    try {
      const res = await fetch(`${API_BASE}/api/auth/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = (await res.json()) as { user: AuthUser };
      setUser(data.user);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      await refreshSession();
      setIsLoading(false);
    })();
  }, []);

  async function login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = (await res.json()) as { user: AuthUser };
    setUser(data.user);
  }

  async function logout() {
    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  }

  // function getDefaultRoute() {
  //   if (!user) return "/login";
  //   return user.role === "admin" ? "/admin" : "/";
  // }
  function getDefaultRoute(user: AuthUser | null) {
  if (!user) return "/";
  if (user.role === "admin") {
    return "/admin/knowledge";
  }
  return "/";
}

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      refreshSession,
      login,
      logout,
      getDefaultRoute,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}