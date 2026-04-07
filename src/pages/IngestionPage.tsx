import PageHeader from "../components/common/PageHeader";

export default function IngestionPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Ingestion Jobs"
        description="Track parsing, chunking, embedding, and indexing jobs."
      />
      <div className="p-6 text-sm text-zinc-400">
        Placeholder: queued, processing, completed, failed jobs.
      </div>
    </div>
  );
}