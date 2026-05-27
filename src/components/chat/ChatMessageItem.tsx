import { Link } from "react-router-dom";
import type { ChatMessage } from "../../types/chat";
import AssistantAvatar from "./AssistantAvatar";

type Props = {
  message: ChatMessage;
};

function WorkingIndicator() {
  return (
    <div className="flex items-center gap-3 text-sm text-zinc-300">
      <div className="flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.2s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.1s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" />
      </div>
      <span>Charmaine Cat is searching and thinking...</span>
    </div>
  );
}

export default function ChatMessageItem({ message }: Props) {
  const isUser = message.role === "user";
  const isAssistantWorking = !isUser && message.content.trim() === "";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-3xl">
          <div className="mb-2 text-right text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
            You
          </div>
          <div className="rounded-[26px] rounded-br-md bg-white px-5 py-4 text-sm leading-7 text-black shadow-xl shadow-black/10">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <Link
        to="/charmaine-cat"
        title="View Charmaine Cat profile"
        className="shrink-0 transition hover:scale-105 hover:opacity-90"
      >
        <AssistantAvatar size="md" />
      </Link>

      <div className="max-w-3xl">
        <div className="mb-2 flex items-center gap-2">
          <Link
            to="/charmaine-cat"
            title="View Charmaine Cat profile"
            className="text-sm font-semibold text-zinc-100 transition hover:text-white hover:underline"
          >
            {message.name || "Charmaine Cat"}
          </Link>

          <span className="rounded-full border border-zinc-700/70 bg-zinc-900/60 px-2 py-0.5 text-[11px] text-zinc-400">
            Personal Assistant
          </span>
        </div>

        <div className="glass-panel soft-border rounded-[26px] rounded-tl-md px-5 py-4 text-sm leading-7 text-zinc-100 shadow-2xl shadow-black/10">
          {isAssistantWorking ? <WorkingIndicator /> : message.content}
        </div>
      </div>
    </div>
  );
}