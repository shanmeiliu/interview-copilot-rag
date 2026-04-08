import { useEffect, useRef } from "react";
import type { ChatMessage } from "../../types/chat";
import ChatMessageItem from "./ChatMessageItem";

type Props = {
  messages: ChatMessage[];
};

export default function ChatMessageList({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}