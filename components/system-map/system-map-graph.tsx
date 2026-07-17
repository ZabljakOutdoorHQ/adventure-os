"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { entityKindIcon } from "@/components/demo/entity-meta";
import { useContextSelection } from "@/components/shell/context-selection";
import { systemMapEdges, systemMapNodes } from "@/lib/demo/data";
import type { DemoEntityKind } from "@/lib/demo/types";
import { cn } from "@/lib/utils";

const COLUMN_ORDER: DemoEntityKind[] = [
  "organisation",
  "person",
  "project",
  "booking",
  "document",
];

const COLUMN_TITLES: Record<string, string> = {
  organisation: "Organisations",
  person: "People",
  project: "Projects",
  booking: "Bookings",
  document: "Documents",
};

type Point = { x: number; y: number };

export function SystemMapGraph() {
  const { selected, select } = useContextSelection();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const [points, setPoints] = useState<Record<string, Point>>({});
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    function measure() {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const next: Record<string, Point> = {};
      nodeRefs.current.forEach((el, id) => {
        const rect = el.getBoundingClientRect();
        next[id] = {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        };
      });
      setPoints(next);
      setSize({ width: containerRect.width, height: containerRect.height });
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const columns = COLUMN_ORDER.map((kind) => ({
    kind,
    title: COLUMN_TITLES[kind],
    nodes: systemMapNodes.filter((node) => node.kind === kind),
  }));

  return (
    <div className="system-map-graph" ref={containerRef}>
      <svg
        aria-hidden="true"
        className="system-map-lines"
        height={size.height}
        width={size.width}
      >
        {systemMapEdges.map((edge) => {
          const from = points[edge.from];
          const to = points[edge.to];
          if (!from || !to) return null;
          const active =
            !!selected &&
            (edge.from === selected.id || edge.to === selected.id);
          return (
            <line
              className={cn(
                "system-map-edge",
                active && "system-map-edge-active",
              )}
              key={`${edge.from}-${edge.to}`}
              x1={from.x}
              x2={to.x}
              y1={from.y}
              y2={to.y}
            />
          );
        })}
      </svg>

      <div className="system-map-columns">
        {columns.map((column) => (
          <div className="system-map-column" key={column.kind}>
            <p className="system-map-column-title">{column.title}</p>
            <div className="system-map-column-nodes">
              {column.nodes.map((node) => {
                const Icon = entityKindIcon[node.kind];
                const active = selected?.id === node.id;
                const connected =
                  !!selected &&
                  selected.id !== node.id &&
                  (selected.relatedIds ?? []).includes(node.id);
                return (
                  <button
                    className={cn(
                      "system-map-node",
                      active && "system-map-node-active",
                      connected && "system-map-node-connected",
                    )}
                    key={node.id}
                    onClick={() => select(node)}
                    ref={(el) => {
                      if (el) nodeRefs.current.set(node.id, el);
                      else nodeRefs.current.delete(node.id);
                    }}
                    type="button"
                  >
                    <Icon size={14} />
                    <span>{node.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
