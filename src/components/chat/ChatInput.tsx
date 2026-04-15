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
    <div className="border-t border-white/5 px-4 py-5 md:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="glass-panel soft-border overflow-hidden rounded-[30px] shadow-2xl shadow-black/10">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask Charmaine Cat a recruiter or interview question..."
            className="min-h-[110px] w-full resize-none bg-transparent px-5 py-4 text-sm leading-7 text-zinc-100 outline-none placeholder:text-zinc-500"
            disabled={disabled}
          />

          <div className="flex items-center justify-between border-t border-white/5 px-4 py-3">
            <div className="text-xs text-zinc-500">
              Grounded in resume, GitHub projects, and supporting materials
            </div>

            <button
              onClick={handleSend}
              disabled={disabled}
              className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:opacity-90 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}