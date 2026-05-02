import type { ChatResponse, RetrievedDoc } from "../types/chat";

const API_BASE = import.meta.env.VITE_API_BASE_PATH || "";

export function apiUrl(path: string) {
  const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  return `${base}${path}`;
}

export async function sendChat(body: Record<string, unknown>): Promise<ChatResponse> {
  const res = await fetch(apiUrl("/api/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function streamChat(
  body: Record<string, unknown>,
  onToken: (token: string) => void,
  onSources?: (docs: RetrievedDoc[]) => void
): Promise<void> {
  const res = await fetch(apiUrl("/api/chat/stream"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok || !res.body) {
    throw new Error(await res.text());
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";

    for (const part of parts) {
      if (!part.startsWith("data: ")) continue;

      const payload = JSON.parse(part.slice(6));

      if (payload.type === "sources") {
        onSources?.(payload.documents ?? []);
      }

      if (payload.type === "token") {
        onToken(payload.content);
      }
    }
  }
}

export async function signupRecruiter(body: {
  password: string;
  display_name?: string;
  email?: string;
}) {
  const res = await fetch(apiUrl("/api/auth/signup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function listAdminUsers(limit = 100) {
  const res = await fetch(apiUrl(`/api/admin/users?limit=${limit}`), {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function listSources(limit = 100) {
  const res = await fetch(apiUrl(`/api/sources?limit=${limit}`), {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function syncSource(id: number) {
  const res = await fetch(apiUrl(`/api/sources/${id}/sync`), {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function deleteSource(id: number) {
  const res = await fetch(apiUrl(`/api/sources/${id}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

export async function uploadSourceFile(file: File, sourceType = "document") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("source_type", sourceType);

  const res = await fetch(apiUrl("/api/sources/upload"), {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function ingestGithubRepo(body: {
  repo_url: string;
  branch?: string;
  include_patterns?: string[];
  source_type?: string;
}) {
  const res = await fetch(apiUrl("/api/sources/github"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}

export async function ingestChunks(body: Record<string, unknown>) {
  const res = await fetch(apiUrl("/api/ingest"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}