import { useState } from "react";

type Props = {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
};

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  async function handleSend() {
    const text = value.trim();
    if (!text) return;
    setValue("");
    await onSend(text);
  }

  return (
    <div className="border-t border-zinc-800 p-4">
      <div className="flex items-end gap-3 rounded-2xl border border-zinc-700 bg-zinc-900 p-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask a recruiter, HR, or interview question..."
          className="min-h-[72px] flex-1 resize-none bg-transparent text-sm outline-none"
          disabled={disabled}
        />
        <button
          onClick={handleSend}
          disabled={disabled}
          className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}