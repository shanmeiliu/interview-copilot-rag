import PageHeader from "../components/common/PageHeader";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Settings"
        description="Configure providers, reranker, HNSW, retrieval tuning, and answer modes."
      />
      <div className="p-6 text-sm text-zinc-400">
        Placeholder: model settings, embedding provider, reranker, retrieval controls.
      </div>
    </div>
  );
}