import PageHeader from "../components/common/PageHeader";

export default function KnowledgePage() {
  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title="Knowledge Base"
        description="Manage resumes, GitHub repos, job descriptions, and notes."
      />
      <div className="p-6 text-sm text-zinc-400">
        Placeholder: source list, upload dialog, GitHub repo sync form.
      </div>
    </div>
  );
}