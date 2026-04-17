//import avatarSrc from "../../assets/Chatbot-kitten.png";
import avatarSrc from "../../assets/Chatbot.png";
import { useState } from "react";

type Props = {
  size?: "sm" | "md" | "lg";
};

export default function AssistantAvatar({ size = "md" }: Props) {
  const [failed, setFailed] = useState(false);

  const sizeClass =
    size === "sm" ? "h-9 w-9" : size === "lg" ? "h-16 w-16" : "h-11 w-11";

  const textClass =
    size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm";

  if (failed) {
    return (
      <div
        className={`flex shrink-0 ${sizeClass} items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-gradient-to-br from-amber-300 to-orange-500 font-bold text-black shadow-sm ${textClass}`}
        aria-label="Charmaine Cat"
        title="Charmaine Cat"
      >
        CC
      </div>
    );
  }

  return (
    <div
      className={`shrink-0 ${sizeClass} overflow-hidden rounded-full border border-zinc-700 bg-zinc-900 shadow-sm`}
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