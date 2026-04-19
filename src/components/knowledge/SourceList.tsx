import { useState } from "react";

type SourceItem = {
  id: number;
  source_key: string;
  name: string;
  source_type: string;
  status: string;
  origin?: string | null;
  file_path?: string | null;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, unknown>;
};

type Props = {
  items: SourceItem[];
  loading?: boolean;
  error?: string;
  onSync?: (id: number) => Promise<void> | void;
  onDelete?: (id: number) => Promise<void> | void;
};

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function SourceList({
  items,
  loading,
  error,
  onSync,
  onDelete,
}: Props) {
  const [busyId, setBusyId] = useState<number | null>(null);

  async function handleSync(id: number) {
    if (!onSync) return;
    try {
      setBusyId(id);
      await onSync(id);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!onDelete) return;

    const ok = window.confirm(
      `Delete "${name}"?\n\nThis will also remove its indexed chunks from retrieval.`
    );
    if (!ok) return;

    try {
      setBusyId(id);
      await onDelete(id);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="text-sm font-semibold text-zinc-100">Knowledge Sources</div>
      <div className="mt-1 text-sm text-zinc-400">
        Uploaded and connected sources available for retrieval.
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          <div className="text-sm text-zinc-500">Loading sources...</div>
        ) : error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : items.length === 0 ? (
          <div className="text-sm text-zinc-500">No sources yet.</div>
        ) : (
          items.map((item) => {
            const isBusy = busyId === item.id;
            const kind =
              typeof item.metadata?.kind === "string"
                ? (item.metadata.kind as string)
                : "";

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-zinc-100">
                      {item.name}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-zinc-500">
                      <span>{item.source_type}</span>
                      {kind ? <span>• {kind}</span> : null}
                    </div>
                  </div>

                  <div className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
                    {item.status}
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-xs text-zinc-500">
                  <div>Key: {item.source_key}</div>
                  {item.origin ? <div>Origin: {item.origin}</div> : null}
                  <div>Created: {formatDate(item.created_at)}</div>
                  <div>Updated: {formatDate(item.updated_at)}</div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => void handleSync(item.id)}
                    disabled={isBusy}
                    className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 transition hover:bg-zinc-800 disabled:opacity-50"
                  >
                    {isBusy ? "Working..." : "Sync"}
                  </button>

                  <button
                    onClick={() => void handleDelete(item.id, item.name)}
                    disabled={isBusy}
                    className="rounded-xl border border-red-900 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-950/40 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}