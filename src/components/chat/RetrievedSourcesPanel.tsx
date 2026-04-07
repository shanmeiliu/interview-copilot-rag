import type { RetrievedDoc } from "../../types/chat";

type Props = {
  docs: RetrievedDoc[];
};

export default function RetrievedSourcesPanel({ docs }: Props) {
  return (
    <aside className="hidden w-96 border-l border-zinc-800 bg-zinc-900 xl:block">
      <div className="border-b border-zinc-800 px-4 py-4">
        <div className="text-sm font-semibold">Retrieved Sources</div>
      </div>
      <div className="space-y-3 p-4">
        {docs.length === 0 ? (
          <div className="text-sm text-zinc-500">No sources yet.</div>
        ) : (
          docs.map((doc) => (
            <div key={doc.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-3">
              <div className="text-xs font-medium text-zinc-300">{doc.source}</div>
              <div className="mt-2 line-clamp-6 text-sm text-zinc-400">{doc.content}</div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}