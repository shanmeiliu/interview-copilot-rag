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
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ChatMode)}
      className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm"
    >
      {modes.map((mode) => (
        <option key={mode} value={mode}>
          {mode}
        </option>
      ))}
    </select>
  );
}