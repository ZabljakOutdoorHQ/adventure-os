"use client";

import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export function RightContextPanel({ open }: { open: boolean }) {
  return (
    <aside
      aria-label="Context panel"
      className={cn("context-panel", open && "context-panel-open")}
    >
      <div className="context-panel-empty">
        <div className="context-panel-icon">
          <Layers size={18} />
        </div>
        <p className="context-panel-title">No context selected</p>
        <p className="context-panel-body">
          Open a person, project, organisation or item and its connected context
          — summary, related entities, documents and source — will appear here.
        </p>
      </div>
    </aside>
  );
}
