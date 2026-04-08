type SourceItem = {
  id: string;
  name: string;
  type: string;
  status: string;
};

type Props = {
  items: SourceItem[];
};

export default function SourceList({ items }: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="text-sm font-semibold text-zinc-100">Knowledge Sources</div>
      <div className="mt-1 text-sm text-zinc-400">
        Uploaded and connected sources available for retrieval.
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <div className="text-sm text-zinc-500">No sources yet.</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3"
            >
              <div>
                <div className="text-sm text-zinc-100">{item.name}</div>
                <div className="mt-1 text-xs text-zinc-500">{item.type}</div>
              </div>
              <div className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-300">
                {item.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}