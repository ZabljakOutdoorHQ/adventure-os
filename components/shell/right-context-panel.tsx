"use client";

import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContextSelection } from "./context-selection";
import { EntityDetail } from "./entity-detail";

export function RightContextPanel({ open }: { open: boolean }) {
  const { selected } = useContextSelection();

  if (selected) {
    return (
      <aside
        aria-label="Context panel"
        className={cn("context-panel", open && "context-panel-open")}
      >
        <EntityDetail entity={selected} />
      </aside>
    );
  }

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
          Select an item and its connected context will appear here, with source
          and freshness shown for everything.
        </p>
        <ul className="list-disc space-y-1.5 pl-4 text-sm">
          <li>
            <strong>Person</strong> — their organisations, projects and recent
            activity.
          </li>
          <li>
            <strong>Booking</strong> — participants, payments and related
            documents.
          </li>
          <li>
            <strong>Project</strong> — owner, status, next action and related
            work.
          </li>
          <li>
            <strong>Organisation</strong> — people, projects and shared history.
          </li>
          <li>
            <strong>Document</strong> — where it lives, who it mentions and what
            it's linked to.
          </li>
        </ul>
      </div>
    </aside>
  );
}
