import type { PropsWithChildren } from "react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="flex h-full bg-zinc-950 text-zinc-100">
      <Sidebar />
      <main className="flex min-w-0 flex-1">{children}</main>
    </div>
  );
}