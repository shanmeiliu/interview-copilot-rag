import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { apiUrl } from "../lib/api";

type AuthUser = {
  id: number;
  username: string;
  display_name?: string;
  email?: string | null;
  role: "admin" | "recruiter";
  auth_provider: "local" | "google";

  mfa_enabled?: boolean;
  mfa_confirmed_at?: string | null;
  mfa_email_enabled?: boolean;
  mfa_email?: string | null;
};

export type LoginResult =
  | {
      user: AuthUser;
      mfa_required?: false;
    }
  | {
      mfa_required: true;
      mfa_token: string;
      user?: AuthUser;
    };

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  refreshSession: () => Promise<void>;

  login: (
    username: string,
    password: string
  ) => Promise<LoginResult>;

  verifyMFA: (
    mfaToken: string,
    code: string
  ) => Promise<void>;

  logout: () => Promise<void>;

  getDefaultRoute: (user: AuthUser | null) => string;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function refreshSession() {
    try {
      const res = await fetch(apiUrl("/api/auth/me"), {
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

  async function login(
    username: string,
    password: string
  ): Promise<LoginResult> {
    const res = await fetch(apiUrl("/api/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = (await res.json()) as LoginResult;

    if ("mfa_required" in data && data.mfa_required) {
      return data;
    }

    if ("user" in data) {
      setUser(data.user);
    }

    return data;
  }

  async function verifyMFA(
    mfaToken: string,
    code: string
  ) {
    const res = await fetch(apiUrl("/api/auth/mfa/verify"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        mfa_token: mfaToken,
        code,
      }),
    });

    if (!res.ok) {
      throw new Error(await res.text());
    }

    const data = (await res.json()) as {
      user: AuthUser;
    };

    setUser(data.user);
  }

  async function logout() {
    try {
      await fetch(apiUrl("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  }

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
      verifyMFA,
      logout,

      getDefaultRoute,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return ctx;
}