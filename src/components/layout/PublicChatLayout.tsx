import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title?: string;
  subtitle?: string;
}>;

export default function PublicChatLayout({
  children,
  title = "Interview Copilot",
  subtitle = "Ask Charmaine Cat about Charmaine's background, technical experience, projects, and role fit."
}: Props) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-6 md:px-6 lg:px-8">
        <header className="border-b border-zinc-800 pb-6">
          <div className="text-2xl font-semibold tracking-tight">{title}</div>
          <div className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            {subtitle}
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col pt-6">{children}</div>
      </div>
    </div>
  );
}