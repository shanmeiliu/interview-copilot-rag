import type { RetrievedDoc } from "../../types/chat";

type Props = {
  docs: RetrievedDoc[];
};

export default function RetrievedSourcesPanel({ docs }: Props) {
  return (
    <aside className="glass-panel soft-border h-full overflow-hidden rounded-[28px]">
      <div className="border-b border-white/5 px-5 py-4">
        <div className="text-sm font-semibold text-zinc-100">Sources Used</div>
        <div className="mt-1 text-xs text-zinc-500">
          Grounding context used by Charmaine Cat
        </div>
      </div>

      <div className="space-y-3 p-4">
        {docs.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-4 text-sm text-zinc-500">
            No sources retrieved yet.
          </div>
        ) : (
          docs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4"
            >
              <div className="text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                {doc.source}
              </div>
              <div className="mt-2 text-sm leading-6 text-zinc-300">
                {doc.content}
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}