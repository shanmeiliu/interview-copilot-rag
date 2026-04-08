import { useState } from "react";
import PageHeader from "../components/common/PageHeader";
import FileUploadCard from "../components/knowledge/FileUploadCard";
import GithubRepoCard from "../components/knowledge/GithubRepoCard";
import SourceList from "../components/knowledge/SourceList";

type SourceItem = {
  id: string;
  name: string;
  type: string;
  status: string;
};

const initialSources: SourceItem[] = [
  { id: "1", name: "Resume.pdf", type: "resume", status: "ready" },
  { id: "2", name: "rag-infra-go", type: "github_repo", status: "ready" },
];

export default function KnowledgePage() {
  const [sources, setSources] = useState<SourceItem[]>(initialSources);

  function refreshSources() {
    setSources((prev) => [...prev]);
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <PageHeader
        title="Knowledge Base"
        description="Upload documents and connect GitHub repositories for interview-grounded answers."
      />

      <div className="grid flex-1 grid-cols-1 gap-6 p-6 xl:grid-cols-[1.1fr_1.1fr_1.3fr]">
        <FileUploadCard onSuccess={refreshSources} />
        <GithubRepoCard onSuccess={refreshSources} />
        <SourceList items={sources} />
      </div>
    </div>
  );
}