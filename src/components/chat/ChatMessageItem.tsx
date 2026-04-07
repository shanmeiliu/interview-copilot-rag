import type { ChatMessage } from "../../types/chat";

type Props = {
  message: ChatMessage;
};

export default function ChatMessageItem({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3xl rounded-2xl px-4 py-3 text-sm leading-7 ${
          isUser ? "bg-white text-black" : "bg-zinc-900 text-zinc-100"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}