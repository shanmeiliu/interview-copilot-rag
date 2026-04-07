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
          className={`rounded-full border px-3 py-1 text-xs ${
            source.enabled
              ? "border-emerald-600 bg-emerald-950 text-emerald-300"
              : "border-zinc-700 bg-zinc-900 text-zinc-400"
          }`}
        >
          {source.label}
        </button>
      ))}
    </div>
  );
}