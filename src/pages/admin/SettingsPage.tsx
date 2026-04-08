import PageHeader from "../../components/common/PageHeader";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <PageHeader
        title="Settings"
        description="Configure answer policy, providers, reranker, and retrieval behavior."
      />
      <div className="p-6 text-sm text-zinc-400">
        Placeholder: provider settings, answer policy, reranker, HNSW, retrieval tuning.
      </div>
    </div>
  );
}