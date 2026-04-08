import PageHeader from "../../components/common/PageHeader";
import FileUploadCard from "../../components/knowledge/FileUploadCard";
import GithubRepoCard from "../../components/knowledge/GithubRepoCard";
import SourceList from "../../components/knowledge/SourceList";

const initialSources = [
  { id: "1", name: "Resume.pdf", type: "resume", status: "ready" },
  { id: "2", name: "rag-infra-go", type: "github_repo", status: "ready" },
];

export default function KnowledgePage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-100">
      <PageHeader
        title="Knowledge Base"
        description="Manage private sources used by the public-facing candidate assistant."
      />

      <div className="grid flex-1 grid-cols-1 gap-6 p-6 xl:grid-cols-[1.1fr_1.1fr_1.3fr]">
        <FileUploadCard />
        <GithubRepoCard />
        <SourceList items={initialSources} />
      </div>
    </div>
  );
}