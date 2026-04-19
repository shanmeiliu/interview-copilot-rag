import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import FileUploadCard from "../../components/knowledge/FileUploadCard";
import GithubRepoCard from "../../components/knowledge/GithubRepoCard";
import SourceList from "../../components/knowledge/SourceList";
import { deleteSource, listSources, syncSource } from "../../lib/api";

type SourceItem = {
  id: number;
  source_key: string;
  name: string;
  source_type: string;
  status: string;
  origin?: string | null;
  file_path?: string | null;
  created_at?: string;
  updated_at?: string;
  metadata?: Record<string, unknown>;
};

export default function KnowledgePage() {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadSources() {
    try {
      setLoading(true);
      setError("");
      const data = (await listSources(200)) as { sources: SourceItem[] };
      setSources(data.sources ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sources");
    } finally {
      setLoading(false);
    }
  }

  async function handleSync(id: number) {
    setError("");
    setMessage("");

    try {
      const data = (await syncSource(id)) as { source?: { name?: string } };
      setMessage(`Synced source: ${data?.source?.name ?? id}`);
      await loadSources();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync source");
    }
  }

  async function handleDelete(id: number) {
    setError("");
    setMessage("");

    try {
      await deleteSource(id);
      setMessage("Source deleted.");
      await loadSources();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete source");
    }
  }

  useEffect(() => {
    void loadSources();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <PageHeader
        title="Knowledge Base"
        description="Manage private sources used by the recruiter-facing assistant."
      />

      <div className="p-6">
        {message ? (
          <div className="mb-4 rounded-2xl border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.1fr_1.3fr]">
          <FileUploadCard
            onSuccess={async () => {
              setMessage("Source uploaded.");
              await loadSources();
            }}
          />
          <GithubRepoCard
            onSuccess={async () => {
              setMessage("GitHub source added.");
              await loadSources();
            }}
          />
          <SourceList
            items={sources}
            loading={loading}
            error={error}
            onSync={handleSync}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}