import { useMemo, useState } from "react";
import PublicChatLayout from "../../components/layout/PublicChatLayout";
import ChatMessageList from "../../components/chat/ChatMessageList";
import ChatInput from "../../components/chat/ChatInput";
import ModeSelector from "../../components/chat/ModeSelector";
import SourceSelector from "../../components/chat/SourceSelector";
import RetrievedSourcesPanel from "../../components/chat/RetrievedSourcesPanel";
import { sendChat, streamChat } from "../../lib/api";
import type { ChatMessage, ChatMode, RetrievedDoc, SourceFilter } from "../../types/chat";

function makeId() {
  return Math.random().toString(36).slice(2);
}

const suggestedQuestions = [
  "Can you summarize Charmaine's background?",
  "What experience does she have with AI systems?",
  "What are her strongest backend skills?",
  "Can you explain one of her projects?",
  "What roles is she best suited for?",
];

export default function PublicChatPage() {
  const [mode, setMode] = useState<ChatMode>("Recruiter");
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<RetrievedDoc[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: makeId(),
      role: "assistant",
      name: "Charmaine Cat",
      content:
        "I am Charmaine Cat, Charmaine's personal assistant. I can answer questions about her background, technical experience, projects, and role fit using information from her resume, GitHub repositories, and supporting materials.",
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
      { id: assistantId, role: "assistant", name: "Charmaine Cat", content: "" },
    ]);

    try {
      try {
        const normal = await sendChat({
          session_id: "public-session",
          query: `[${mode}] ${text}`,
          filters: activeFilters,
        });
        setDocs(normal.documents ?? []);
      } catch {
        // allow stream to continue even if warm-up request fails
      }

      await streamChat(
        {
          session_id: "public-session",
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
    <PublicChatLayout
      title="Interview Copilot"
      subtitle="Ask Charmaine Cat about Charmaine's background, technical experience, projects, and role fit."
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="flex min-h-0 flex-col rounded-[28px] border border-zinc-800 bg-zinc-900/70 shadow-2xl shadow-black/10 backdrop-blur">
          <div className="border-b border-zinc-800 px-6 py-6">
            <div className="flex flex-col gap-4">
              <div>
                <div className="text-2xl font-semibold tracking-tight">
                  Charmaine Cat
                </div>
                <div className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
                  Charmaine Cat answers recruiter and interviewer questions on Charmaine's behalf using grounded information from her resume, GitHub projects, and supporting materials.
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <ModeSelector value={mode} onChange={setMode} />
                <SourceSelector sources={sources} onToggle={toggleSource} />
              </div>

              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => void handleSend(q)}
                    className="rounded-full border border-zinc-700 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <ChatMessageList messages={messages} />
          <ChatInput onSend={handleSend} disabled={loading} />
        </section>

        <section className="hidden min-h-0 xl:block">
          <RetrievedSourcesPanel docs={docs} />
        </section>
      </div>
    </PublicChatLayout>
  );
}