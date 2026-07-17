"use client";

import { entityKindIcon } from "@/components/demo/entity-meta";
import { useContextSelection } from "@/components/shell/context-selection";
import { events, factValue } from "@/lib/demo/data";
import { cn } from "@/lib/utils";

export function AgendaList() {
  const { selected, select } = useContextSelection();

  const sorted = [...events].sort((a, b) => {
    const aKey = `${factValue(a, "Date")} ${a.subtitle}`;
    const bKey = `${factValue(b, "Date")} ${b.subtitle}`;
    return aKey.localeCompare(bKey);
  });

  return (
    <ul className="entity-list">
      {sorted.map((event) => {
        const Icon = entityKindIcon[event.kind];
        const active = selected?.id === event.id;
        return (
          <li key={event.id}>
            <button
              aria-pressed={active}
              className={cn("entity-row", active && "entity-row-active")}
              onClick={() => select(event)}
              type="button"
            >
              <span className="entity-row-icon">
                <Icon size={15} />
              </span>
              <span className="entity-row-body">
                <span className="entity-row-title">{event.title}</span>
                <span className="entity-row-subtitle">
                  {factValue(event, "Date")} · {event.subtitle}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
