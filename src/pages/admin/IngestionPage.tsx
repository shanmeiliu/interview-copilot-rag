import PageHeader from "../../components/common/PageHeader";

export default function IngestionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <PageHeader
        title="Ingestion Jobs"
        description="Track parsing, chunking, embedding, and indexing jobs."
      />
      <div className="p-6 text-sm text-zinc-400">
        Placeholder: queued, processing, completed, and failed ingestion jobs.
      </div>
    </div>
  );
}