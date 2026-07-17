"use client";

import { useState } from "react";
import { RightContextPanel } from "./right-context-panel";
import { TopNav } from "./top-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [contextOpen, setContextOpen] = useState(false);

  return (
    <div className="app-shell">
      <TopNav onToggleContext={() => setContextOpen((value) => !value)} />
      <div className="shell-body">
        <main className="shell-main">{children}</main>
        <RightContextPanel open={contextOpen} />
      </div>
    </div>
  );
}
