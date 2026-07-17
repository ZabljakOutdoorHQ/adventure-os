"use client";

import { useContextSelection } from "@/components/shell/context-selection";
import type { DemoEntity } from "@/lib/demo/types";
import { cn } from "@/lib/utils";
import { entityKindIcon } from "./entity-meta";

export function EntityList({ items }: { items: DemoEntity[] }) {
  const { selected, select } = useContextSelection();

  return (
    <ul className="entity-list">
      {items.map((item) => {
        const Icon = entityKindIcon[item.kind];
        const active = selected?.id === item.id;
        return (
          <li key={item.id}>
            <button
              aria-pressed={active}
              className={cn("entity-row", active && "entity-row-active")}
              onClick={() => select(item)}
              type="button"
            >
              <span className="entity-row-icon">
                <Icon size={15} />
              </span>
              <span className="entity-row-body">
                <span className="entity-row-title">{item.title}</span>
                {item.subtitle && (
                  <span className="entity-row-subtitle">{item.subtitle}</span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
