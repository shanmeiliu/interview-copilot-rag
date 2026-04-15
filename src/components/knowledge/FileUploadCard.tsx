import { useState } from "react";
import { uploadSourceFile } from "../../lib/api";

type Props = {
  onSuccess?: () => Promise<void> | void;
};

export default function FileUploadCard({ onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [sourceType, setSourceType] = useState("document");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  async function handleUpload() {
    if (!file) {
      setMessage("Please choose a file.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await uploadSourceFile(file, sourceType);
      setMessage(`Uploaded successfully: ${result?.source?.name ?? file.name}`);
      setFile(null);
      await onSuccess?.();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="text-sm font-semibold text-zinc-100">Upload Documents</div>
      <div className="mt-1 text-sm text-zinc-400">
        Add resume, job descriptions, notes, or other interview materials.
      </div>

      <div className="mt-4 space-y-3">
        <select
          value={sourceType}
          onChange={(e) => setSourceType(e.target.value)}
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"
        >
          <option value="document">Document</option>
          <option value="resume">Resume</option>
          <option value="job_description">Job Description</option>
          <option value="notes">Notes</option>
        </select>

        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt,.md"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-300 file:mr-3 file:rounded-lg file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-sm file:text-white"
        />

        {file ? (
          <div className="text-xs text-zinc-400">
            Selected: <span className="text-zinc-200">{file.name}</span>
          </div>
        ) : null}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload and Ingest"}
        </button>

        {message ? <div className="text-sm text-zinc-400">{message}</div> : null}
      </div>
    </div>
  );
}