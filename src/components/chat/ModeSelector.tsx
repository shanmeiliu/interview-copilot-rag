import type { ChatMode } from "../../types/chat";

type Props = {
  value: ChatMode;
  onChange: (value: ChatMode) => void;
};

const modes: ChatMode[] = [
  "Recruiter",
  "HR",
  "Hiring Manager",
  "Technical Interviewer",
  "Resume Reviewer",
];

export default function ModeSelector({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-2xl border border-zinc-800 bg-zinc-950/70 p-1">
      {modes.map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={`rounded-xl px-3 py-2 text-sm transition ${
            value === mode
              ? "bg-white text-black"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          {mode}
        </button>
      ))}
    </div>
  );
}