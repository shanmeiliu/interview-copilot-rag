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
          <div className="mb-2 text-right text-xs font-medium uppercase tracking-wide text-zinc-500">
            You
          </div>
          <div className="rounded-3xl rounded-br-md bg-white px-5 py-4 text-sm leading-7 text-black shadow-md shadow-black/10">
            {message.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3">
      <AssistantAvatar />

      <div className="max-w-3xl">
        <div className="mb-2 flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-100">
            {message.name || "Charmaine Cat"}
          </span>
          <span className="text-xs text-zinc-500">Personal Assistant</span>
        </div>

        <div className="rounded-3xl rounded-tl-md border border-zinc-800 bg-zinc-900 px-5 py-4 text-sm leading-7 text-zinc-100 shadow-lg shadow-black/10">
          {message.content}
        </div>
      </div>
    </div>
  );
}