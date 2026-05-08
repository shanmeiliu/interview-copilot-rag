import type { ChatResponse, RetrievedDoc } from "../types/chat";

const API_BASE = import.meta.env.VITE_API_BASE_PATH || "";

export function apiUrl(path: string) {
  const base = API_BASE.endsWith("/") ? API_BASE.slice(0, -1) : API_BASE;
  return `${base}${path}`;
}

async function readJsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(await res.text());
  }
  return res.json() as Promise<T>;
}

export async function sendChat(body: Record<string, unknown>): Promise<ChatResponse> {
  const res = await fetch(apiUrl("/api/chat"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return readJsonOrThrow<ChatResponse>(res);
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

  return readJsonOrThrow(res);
}

export async function listAdminUsers(limit = 100) {
  const res = await fetch(apiUrl(`/api/admin/users?limit=${limit}`), {
    method: "GET",
    credentials: "include",
  });

  return readJsonOrThrow(res);
}

export async function listSources(limit = 100) {
  const res = await fetch(apiUrl(`/api/sources?limit=${limit}`), {
    method: "GET",
    credentials: "include",
  });

  return readJsonOrThrow(res);
}

export async function syncSource(id: number) {
  const res = await fetch(apiUrl(`/api/sources/${id}/sync`), {
    method: "POST",
    credentials: "include",
  });

  return readJsonOrThrow(res);
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

  return readJsonOrThrow(res);
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

  return readJsonOrThrow(res);
}

export async function ingestChunks(body: Record<string, unknown>) {
  const res = await fetch(apiUrl("/api/ingest"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return readJsonOrThrow(res);
}

export type CatProfile = {
  display_name: string;
  tagline: string;
  bio: string;
  avatar_photo_id?: number | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CatStory = {
  id: number;
  title: string;
  body: string;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CatPhoto = {
  id: number;
  filename: string;
  original_filename: string;
  content_type: string;
  public_url: string;
  caption: string;
  alt_text: string;
  sort_order: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CatProfilePayload = {
  profile: CatProfile;
  stories: CatStory[];
  photos: CatPhoto[];
};

export function catPhotoUrl(publicUrl?: string | null) {
  if (!publicUrl) return "";
  return apiUrl(publicUrl);
}

export async function getPublicCatProfile(): Promise<CatProfilePayload> {
  const res = await fetch(apiUrl("/api/cat-profile"), {
    method: "GET",
    credentials: "include",
  });

  return readJsonOrThrow<CatProfilePayload>(res);
}

export async function getAdminCatProfile(): Promise<CatProfilePayload> {
  const res = await fetch(apiUrl("/api/admin/cat-profile"), {
    method: "GET",
    credentials: "include",
  });

  return readJsonOrThrow<CatProfilePayload>(res);
}

export async function updateAdminCatProfile(body: {
  display_name: string;
  tagline: string;
  bio: string;
  avatar_photo_id?: number | null;
}) {
  const res = await fetch(apiUrl("/api/admin/cat-profile"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return readJsonOrThrow<{ profile: CatProfile }>(res);
}

export async function createCatStory(body: {
  title: string;
  body: string;
  sort_order: number;
  is_published: boolean;
}) {
  const res = await fetch(apiUrl("/api/admin/cat-profile/stories"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return readJsonOrThrow<{ story: CatStory }>(res);
}

export async function updateCatStory(
  id: number,
  body: {
    title: string;
    body: string;
    sort_order: number;
    is_published: boolean;
  }
) {
  const res = await fetch(apiUrl(`/api/admin/cat-profile/stories/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return readJsonOrThrow<{ story: CatStory }>(res);
}

export async function deleteCatStory(id: number) {
  const res = await fetch(apiUrl(`/api/admin/cat-profile/stories/${id}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

export async function uploadCatPhoto(file: File, body?: {
  caption?: string;
  alt_text?: string;
  sort_order?: number;
  is_published?: boolean;
}) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("caption", body?.caption ?? "");
  formData.append("alt_text", body?.alt_text ?? "");
  formData.append("sort_order", String(body?.sort_order ?? 0));
  formData.append("is_published", String(body?.is_published ?? true));

  const res = await fetch(apiUrl("/api/admin/cat-profile/photos"), {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  return readJsonOrThrow<{ photo: CatPhoto }>(res);
}

export async function updateCatPhoto(
  id: number,
  body: {
    caption: string;
    alt_text: string;
    sort_order: number;
    is_published: boolean;
  }
) {
  const res = await fetch(apiUrl(`/api/admin/cat-profile/photos/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  return readJsonOrThrow<{ photo: CatPhoto }>(res);
}

export async function deleteCatPhoto(id: number) {
  const res = await fetch(apiUrl(`/api/admin/cat-profile/photos/${id}`), {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}