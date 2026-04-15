type SourceItem = {
  id: number;
  source_key: string;
  name: string;
  source_type: string;
  status: string;
  origin?: string | null;
  file_path?: string | null;
  created_at?: string;
};

type Props = {
  items: SourceItem[];
  loading?: boolean;
  error?: string;
};

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default function SourceList({ items, loading, error }: Props) {
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
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-zinc-100">
                    {item.name}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    {item.source_type}
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}