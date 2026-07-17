"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <Button
        aria-label="Open global search"
        className="global-search-trigger"
        onClick={() => setOpen(true)}
        size="sm"
        variant="outline"
      >
        <Search size={15} />
        <span>Search everything</span>
        <kbd className="global-search-kbd">⌘K</kbd>
      </Button>
      <DialogContent aria-describedby="global-search-description">
        <DialogHeader>
          <DialogTitle>Global search</DialogTitle>
          <DialogDescription id="global-search-description">
            Structural preview only. Search is not yet connected to any source.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <Input
            aria-label="Search people, projects, communications and knowledge"
            autoFocus
            disabled
            placeholder="Search people, projects, communications, knowledge…"
          />
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            Once Adventure OS is connected to real sources, this will search
            across people, organisations, projects, operations, communications
            and knowledge — with source and freshness shown on every result.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
