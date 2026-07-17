"use client";

import { useMemo, useState } from "react";
import { EntityList } from "@/components/demo/entity-list";
import { entityKindPluralLabel } from "@/components/demo/entity-meta";
import { SectionHeader } from "@/components/demo/section-header";
import { Input } from "@/components/ui/input";
import { allEntities } from "@/lib/demo/data";
import type { DemoEntityKind } from "@/lib/demo/types";

const GROUP_ORDER: DemoEntityKind[] = [
  "person",
  "organisation",
  "project",
  "task",
  "booking",
  "document",
  "message",
  "event",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = term
      ? allEntities.filter((entity) =>
          [entity.title, entity.subtitle, entity.description]
            .filter((field): field is string => Boolean(field))
            .some((field) => field.toLowerCase().includes(term)),
        )
      : allEntities;

    return GROUP_ORDER.map((kind) => ({
      kind,
      items: matches.filter((entity) => entity.kind === kind),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  const resultCount = groups.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <SectionHeader
        description="Search across people, organisations, projects, tasks, bookings, documents, messages and events. This page queries demo data only — it is not connected to any live source."
        eyebrow="Search"
        title="Search"
      />

      <Input
        aria-label="Search everything"
        autoFocus
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search people, projects, bookings, tasks, documents…"
        value={query}
      />

      <p className="text-sm text-[var(--muted-foreground)]">
        {resultCount} result{resultCount === 1 ? "" : "s"}
        {query.trim() && ` for "${query.trim()}"`}
      </p>

      <div className="flex flex-col gap-6">
        {groups.map((group) => (
          <div key={group.kind}>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
              {entityKindPluralLabel[group.kind]}
            </p>
            <EntityList items={group.items} />
          </div>
        ))}
        {resultCount === 0 && (
          <p className="text-sm text-[var(--muted-foreground)]">
            No results for "{query.trim()}".
          </p>
        )}
      </div>
    </div>
  );
}
