import { useMemo, useState } from "react";
import PageHeader from "../common/PageHeader";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import ModeSelector from "./ModeSelector";
import SourceSelector from "./SourceSelector";
import RetrievedSourcesPanel from "./RetrievedSourcesPanel";
import { sendChat, streamChat } from "../../lib/api";
import type { ChatMessage, ChatMode, RetrievedDoc, SourceFilter } from "../../types/chat";

function makeId() {
  return Math.random().toString(36).slice(2);
}

export default function ChatPage() {
  const [mode, setMode] = useState<ChatMode>("Recruiter");
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<RetrievedDoc[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: makeId(),
      role: "assistant",
      content:
        "Hi — I’m Interview Copilot. Ask me recruiter, HR, or technical interview questions using your resume, repos, and uploaded documents.",
    },
  ]);

  const [sources, setSources] = useState<SourceFilter[]>([
    { id: "resume", label: "Resume", enabled: true },
    { id: "repos", label: "GitHub Repos", enabled: true },
    { id: "job-desc", label: "Job Descriptions", enabled: false },
    { id: "notes", label: "Notes", enabled: false },
  ]);

  const activeFilters = useMemo(() => {
    const enabled = sources.filter((s) => s.enabled).map((s) => s.id);
    return { metadata: { source_group: enabled.join(",") } };
  }, [sources]);

  function toggleSource(id: string) {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  }

  async function handleSend(text: string) {
    setLoading(true);

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: text,
    };

    const assistantId = makeId();

    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      let firstResponseDocs: RetrievedDoc[] = [];

      try {
        const normal = await sendChat({
          session_id: "default",
          query: `[${mode}] ${text}`,
          filters: activeFilters,
        });
        firstResponseDocs = normal.documents ?? [];
        setDocs(firstResponseDocs);
      } catch {
        // ignore warm-up failure
      }

      await streamChat(
        {
          session_id: "default",
          query: `[${mode}] ${text}`,
          filters: activeFilters,
        },
        (token) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + token } : m
            )
          );
        }
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  err instanceof Error ? `Error: ${err.message}` : "Unknown error",
              }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex min-w-0 flex-1 flex-col">
        <PageHeader
          title="Interview Chat"
          description="Ask recruiter, HR, and technical interview questions grounded on your own materials."
        />

        <div className="border-b border-zinc-800 px-6 py-4">
          <div className="flex flex-col gap-3">
            <ModeSelector value={mode} onChange={setMode} />
            <SourceSelector sources={sources} onToggle={toggleSource} />
          </div>
        </div>

        <ChatMessageList messages={messages} />
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>

      <RetrievedSourcesPanel docs={docs} />
    </>
  );
}