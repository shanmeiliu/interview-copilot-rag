import { useMemo, useState } from "react";
import { ingestGithubRepo } from "../../lib/api";

type Props = {
  onSuccess?: () => void;
};

export default function GithubRepoCard({ onSuccess }: Props) {
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [patterns, setPatterns] = useState("README.md,docs/**,*.md");
  const [sourceType, setSourceType] = useState("github_repo");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const includePatterns = useMemo(
    () =>
      patterns
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [patterns]
  );

  async function handleIngest() {
    if (!repoUrl.trim()) {
      setMessage("Please enter a GitHub repository URL.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await ingestGithubRepo({
        repo_url: repoUrl.trim(),
        branch: branch.trim() || undefined,
        include_patterns: includePatterns,
        source_type: sourceType,
      });

      setMessage(`Repository submitted: ${result?.message ?? repoUrl}`);
      onSuccess?.();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "GitHub ingestion failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="text-sm font-semibold text-zinc-100">Ingest GitHub Repository</div>
      <div className="mt-1 text-sm text-zinc-400">
        Add README files, docs, and selected source files from a repository.
      </div>

      <div className="mt-4 space-y-3">
        <input
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/yourname/repo"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        />

        <input
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          placeholder="Branch (optional)"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        />

        <input
          value={patterns}
          onChange={(e) => setPatterns(e.target.value)}
          placeholder="README.md, docs/**, *.md"
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        />

        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        >
          <option value="github_repo">GitHub Repo</option>
          <option value="portfolio_project">Portfolio Project</option>
          <option value="technical_project">Technical Project</option>
        </select>

        <button
          onClick={handleIngest}
          disabled={loading}
          className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Sync Repository"}
        </button>

        {message ? <div className="text-sm text-zinc-400">{message}</div> : null}
      </div>
    </div>
  );
}