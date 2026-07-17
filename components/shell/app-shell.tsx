"use client";

import { useEffect, useState } from "react";
import {
  ContextSelectionProvider,
  useContextSelection,
} from "./context-selection";
import { RightContextPanel } from "./right-context-panel";
import { TopNav } from "./top-nav";

function ShellChrome({ children }: { children: React.ReactNode }) {
  const [contextOpen, setContextOpen] = useState(false);
  const { selected } = useContextSelection();

  useEffect(() => {
    if (selected) setContextOpen(true);
  }, [selected]);

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

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ContextSelectionProvider>
      <ShellChrome>{children}</ShellChrome>
    </ContextSelectionProvider>
  );
}
