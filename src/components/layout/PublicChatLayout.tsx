import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title?: string;
  subtitle?: string;
}>;

export default function PublicChatLayout({
  children,
  title = "Interview Copilot",
  subtitle = "Ask Charmaine Cat about Charmaine's background, technical experience, projects, and role fit.",
}: Props) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="page-shell flex min-h-screen flex-col py-6 md:py-8">
        <header className="glass-panel soft-border overflow-hidden rounded-[32px]">
          <div className="border-b border-white/5 px-6 py-6 md:px-8">
            <div className="hero-chip">AI candidate representative</div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400 md:text-base">
              {subtitle}
            </p>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col pt-6">{children}</div>
      </div>
    </div>
  );
}