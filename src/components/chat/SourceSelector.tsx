import type { SourceFilter } from "../../types/chat";

type Props = {
  sources: SourceFilter[];
  onToggle: (id: string) => void;
};

export default function SourceSelector({ sources, onToggle }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {sources.map((source) => (
        <button
          key={source.id}
          onClick={() => onToggle(source.id)}
          className={`rounded-full border px-3 py-1.5 text-xs transition ${
            source.enabled
              ? "border-emerald-700/70 bg-emerald-950/60 text-emerald-300"
              : "border-zinc-700 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {source.label}
        </button>
      ))}
    </div>
  );
}