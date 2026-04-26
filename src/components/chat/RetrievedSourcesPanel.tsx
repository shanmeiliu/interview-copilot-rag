import type { RetrievedDoc } from "../../types/chat";

type Props = {
  docs: RetrievedDoc[];
  query?: string;
};

function getSourceLabel(doc: RetrievedDoc, index: number) {
  const metadata = doc.metadata ?? {};

  const filename = typeof metadata.filename === "string" ? metadata.filename : "";
  const docName = typeof metadata.doc_name === "string" ? metadata.doc_name : "";
  const repoName = typeof metadata.repo_name === "string" ? metadata.repo_name : "";
  const sourceType =
    typeof metadata.source_type === "string" ? metadata.source_type : "";

  if (filename) return filename;
  if (docName) return docName;
  if (repoName) return repoName;
  if (sourceType) return sourceType;

  return `Source ${index + 1}`;
}

function getSourceBadge(doc: RetrievedDoc) {
  const metadata = doc.metadata ?? {};
  const group =
    typeof metadata.source_group === "string" ? metadata.source_group : "";
  const kind = typeof metadata.kind === "string" ? metadata.kind : "";

  if (group && kind) return `${group} • ${kind}`;
  if (group) return group;
  if (kind) return kind;
  return "Knowledge Base";
}

function getKeywords(query?: string) {
  if (!query) return [];

  const stopWords = new Set([
    "the",
    "and",
    "or",
    "is",
    "are",
    "to",
    "in",
    "of",
    "for",
    "a",
    "an",
    "she",
    "her",
    "he",
    "his",
    "what",
    "how",
    "why",
    "can",
    "does",
    "do",
    "about",
    "with",
  ]);

  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 3 && !stopWords.has(w))
    .slice(0, 8);
}

function HighlightedText({ text, query }: { text: string; query?: string }) {
  const keywords = getKeywords(query);

  if (keywords.length === 0) {
    return <>{text}</>;
  }

  const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = keywords.includes(part.toLowerCase());
        if (!isMatch) return <span key={index}>{part}</span>;

        return (
          <mark
            key={index}
            className="rounded bg-emerald-500/20 px-1 text-emerald-200"
          >
            {part}
          </mark>
        );
      })}
    </>
  );
}

export default function RetrievedSourcesPanel({ docs, query }: Props) {
  const visibleDocs = docs.slice(0, 3);

  return (
    <aside className="glass-panel soft-border h-full overflow-hidden rounded-[28px]">
      <div className="border-b border-white/5 px-5 py-4">
        <div className="text-sm font-semibold text-zinc-100">Answer Sources</div>
        <div className="mt-1 text-xs text-zinc-500">
          Evidence retrieved from Charmaine Cat's knowledge base
        </div>
      </div>

      <div className="space-y-3 p-4">
        {visibleDocs.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 px-4 py-4 text-sm text-zinc-500">
            No sources retrieved yet.
          </div>
        ) : (
          visibleDocs.map((doc, index) => (
            <div
              key={`${doc.id}-${index}`}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-100">
                    [{index + 1}] {getSourceLabel(doc, index)}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                    {getSourceBadge(doc)}
                  </div>
                </div>
              </div>

              <div className="mt-3 max-h-48 overflow-y-auto text-sm leading-6 text-zinc-300">
                <HighlightedText text={doc.content} query={query} />
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}