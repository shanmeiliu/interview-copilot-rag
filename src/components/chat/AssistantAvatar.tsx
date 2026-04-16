import avatarSrc from "../../assets/Chatbot-kitten.png";
import { useState } from "react";


type Props = {
  size?: "sm" | "md";
};

export default function AssistantAvatar({ size = "md" }: Props) {
  const [failed, setFailed] = useState(false);

  const sizeClass = size === "sm" ? "h-9 w-9" : "h-11 w-11";
  const textClass = size === "sm" ? "text-xs" : "text-sm";

  if (failed) {
    return (
      <div
        className={`flex ${sizeClass} items-center justify-center rounded-full border border-zinc-700 bg-gradient-to-br from-amber-300 to-orange-500 font-bold text-black shadow-sm ${textClass}`}
        aria-label="Charmaine Cat"
        title="Charmaine Cat"
      >
        CC
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-full border border-zinc-700 bg-zinc-900 shadow-sm ${sizeClass}`}
      aria-label="Charmaine Cat"
      title="Charmaine Cat"
    >
      <img
        src={avatarSrc}
        alt="Charmaine Cat"
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
        loading="eager"
      />
    </div>
  );
}