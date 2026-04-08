import avatar from "../../assets/Chatbot-kitten.png";

export default function AssistantAvatar() {
  return (
    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 shadow-sm">
      <img
        src={avatar}
        alt="Charmaine Cat"
        className="h-full w-full object-cover"
      />
    </div>
  );
}