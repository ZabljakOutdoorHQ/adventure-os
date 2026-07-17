"use client";

import { Search } from "lucide-react";

function openGlobalSearch() {
  // Reuses the existing global search dialog's own Cmd/Ctrl+K listener
  // (components/shell/global-search.tsx) instead of duplicating dialog
  // state here, so the search experience stays a single source of truth.
  document.dispatchEvent(
    new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
  );
}

export function QuickSearchBanner() {
  return (
    <button
      className="flex w-full items-center gap-3 rounded-xl border bg-[var(--card)] px-5 py-4 text-left text-[var(--muted-foreground)] shadow-sm transition-colors hover:border-[var(--ring)] hover:text-[var(--foreground)]"
      onClick={openGlobalSearch}
      type="button"
    >
      <Search size={18} />
      <span className="flex-1 text-sm">
        Search people, projects, bookings, documents…
      </span>
      <kbd className="global-search-kbd">⌘K</kbd>
    </button>
  );
}
