import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import FileUploadCard from "../../components/knowledge/FileUploadCard";
import GithubRepoCard from "../../components/knowledge/GithubRepoCard";
import SourceList from "../../components/knowledge/SourceList";
import { listSources } from "../../lib/api";

type SourceItem = {
  id: number;
  source_key: string;
  name: string;
  source_type: string;
  status: string;
  origin?: string | null;
  file_path?: string | null;
  created_at?: string;
};

export default function KnowledgePage() {
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  useEffect(() => {
    void loadSources();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <PageHeader
        title="Knowledge Base"
        description="Manage private sources used by the recruiter-facing assistant."
      />

      <div className="grid flex-1 grid-cols-1 gap-6 p-6 xl:grid-cols-[1.1fr_1.1fr_1.3fr]">
        <FileUploadCard onSuccess={loadSources} />
        <GithubRepoCard onSuccess={loadSources} />
        <SourceList items={sources} loading={loading} error={error} />
      </div>
    </div>
  );
}