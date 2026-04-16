import type { ChatMessage } from "../../types/chat";
import AssistantAvatar from "./AssistantAvatar";

type Props = {
  message: ChatMessage;
};

export default function ChatMessageItem({ message }: Props) {
  const isUser = message.role === "user";

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
      <AssistantAvatar size="md" />

      <div className="max-w-3xl">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-100">
            {message.name || "Charmaine Cat"}
          </span>
          <span className="rounded-full border border-zinc-700/70 bg-zinc-900/60 px-2 py-0.5 text-[11px] text-zinc-400">
            Personal Assistant
          </span>
        </div>

        <div className="glass-panel soft-border rounded-[26px] rounded-tl-md px-5 py-4 text-sm leading-7 text-zinc-100 shadow-2xl shadow-black/10">
          {message.content}
        </div>
      </div>
    </div>
  );
}