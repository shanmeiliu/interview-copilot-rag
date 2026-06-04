import { useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { ingestGithubRepo, uploadSourceFile } from "../../lib/api";

const INTERVIEW_PREP_SOURCE_GROUP = "interview_prep";

export default function InterviewPrepKnowledgePage() {
  const [file, setFile] = useState<File | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [branch, setBranch] = useState("");
  const [includePatterns, setIncludePatterns] = useState("*.md\n**/*.md");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleUpload() {
    if (!file) {
      setError("Please choose a file first.");
      return;
    }

    try {
      setBusy(true);
      setError("");
      setMessage("");

      await uploadSourceFile(
        file,
        "document",
        INTERVIEW_PREP_SOURCE_GROUP
      );

      setFile(null);
      setMessage(
        "Interview prep file uploaded and ingested into the interview_prep knowledge base."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setBusy(false);
    }
  }

  async function handleGithubIngest() {
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    try {
      setBusy(true);
      setError("");
      setMessage("");

      const patterns = includePatterns
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      await ingestGithubRepo({
        repo_url: repoUrl.trim(),
        branch: branch.trim() || undefined,
        include_patterns: patterns,
        source_type: "document",
        source_group: INTERVIEW_PREP_SOURCE_GROUP,
      });

      setRepoUrl("");
      setBranch("");
      setMessage(
        "GitHub markdown files ingested into the interview_prep knowledge base."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to ingest GitHub repo");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <PageHeader
        title="Interview Prep Knowledge Base"
        description="Private knowledge base for Screen2GPT and interview-prep questions. Content here is isolated from recruiter-facing profile knowledge."
      />

      <div className="space-y-6 p-6">
        {message ? (
          <div className="rounded-2xl border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">
              Upload Interview Prep File
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Upload notes, Q&A files, Python explanations, system-design notes,
              or other private learning material. This page always stores chunks
              with <span className="font-mono text-zinc-200">source_group=interview_prep</span>.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <input
              type="file"
              accept=".txt,.md,.docx"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-zinc-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-zinc-950"
            />

            <button
              onClick={() => void handleUpload()}
              disabled={busy || !file}
              className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Uploading..." : "Upload to Interview Prep KB"}
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div>
            <h2 className="text-base font-semibold text-zinc-100">
              Ingest GitHub Markdown
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Ingest Markdown files from a GitHub repository into the private
              interview-prep collection.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block text-sm text-zinc-400">
              GitHub Repository URL
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
              />
            </label>

            <label className="block text-sm text-zinc-400">
              Branch
              <input
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="optional, default branch is auto-detected"
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
              />
            </label>

            <label className="block text-sm text-zinc-400">
              Include Patterns
              <textarea
                value={includePatterns}
                onChange={(e) => setIncludePatterns(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-sm text-zinc-100 outline-none placeholder:text-zinc-600"
              />
            </label>

            <button
              onClick={() => void handleGithubIngest()}
              disabled={busy || !repoUrl.trim()}
              className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Ingesting..." : "Ingest GitHub to Interview Prep KB"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}