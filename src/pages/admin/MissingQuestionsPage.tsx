import { useEffect, useState } from "react";
import {
  clearMissingQuestions,
  deleteMissingQuestion,
  listMissingQuestions,
  type MissingQuestion,
} from "../../lib/api";

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function MissingQuestionsPage() {
  const [items, setItems] = useState<MissingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      setLoading(true);
      setError("");
      const data = await listMissingQuestions(200);
      setItems(data.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load missing questions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleDelete(id: number) {
    try {
      setError("");
      await deleteMissingQuestion(id);
      setMessage("Missing question removed.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete question");
    }
  }

  async function handleClearAll() {
    const ok = window.confirm(
      "Clear all missing question logs?\n\nOnly do this after you have reviewed or addressed them."
    );
    if (!ok) return;

    try {
      setError("");
      await clearMissingQuestions();
      setMessage("All missing questions cleared.");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to clear questions");
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-100">
            Missing Questions
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            Review questions where the RAG system could not find relevant
            context. Use this list to decide what knowledge source should be
            added or improved.
          </p>
        </div>

        <button
          onClick={() => void handleClearAll()}
          disabled={items.length === 0}
          className="rounded-xl border border-red-900 px-4 py-2 text-sm text-red-300 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Clear All
        </button>
      </div>

      {message ? (
        <div className="rounded-2xl border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-zinc-100">
              Review Queue
            </div>
            <div className="mt-1 text-sm text-zinc-500">
              {items.length} unanswered or weak-retrieval question
              {items.length === 1 ? "" : "s"}
            </div>
          </div>

          <button
            onClick={() => void load()}
            className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
          >
            Refresh
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {loading ? (
            <div className="text-sm text-zinc-500">Loading missing questions...</div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 text-sm text-zinc-500">
              No missing questions logged yet.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                      {item.mode || "Unknown mode"} • {item.reason}
                    </div>

                    <div className="mt-3 text-base font-medium leading-7 text-zinc-100">
                      {item.question}
                    </div>

                    {item.rewritten_query &&
                    item.rewritten_query !== item.question ? (
                      <div className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-400">
                        <span className="text-zinc-500">Rewritten:</span>{" "}
                        {item.rewritten_query}
                      </div>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-zinc-500">
                      <span>Session: {item.session_id || "—"}</span>
                      <span>•</span>
                      <span>{formatDate(item.created_at)}</span>
                    </div>

                    {item.filters ? (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-xs text-zinc-500 hover:text-zinc-300">
                          View filters
                        </summary>
                        <pre className="mt-2 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-400">
                          {JSON.stringify(item.filters, null, 2)}
                        </pre>
                      </details>
                    ) : null}
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      onClick={() => void handleDelete(item.id)}
                      className="rounded-xl border border-red-900 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-950/40"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 text-xs leading-5 text-zinc-500">
                  Address this by uploading a new note/document, updating the
                  resume, adding a GitHub source, or improving the existing
                  knowledge content. After addressing it, delete this item from
                  the queue.
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}