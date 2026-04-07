import type { ChatMessage } from "../../types/chat";
import ChatMessageItem from "./ChatMessageItem";

type Props = {
  messages: ChatMessage[];
};

export default function ChatMessageList({ messages }: Props) {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6 scrollbar-thin">
      {messages.map((message) => (
        <ChatMessageItem key={message.id} message={message} />
      ))}
    </div>
  );
}