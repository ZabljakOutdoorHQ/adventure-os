"use client";

import { useMemo } from "react";
import { useContextSelection } from "@/components/shell/context-selection";
import { events, factValue } from "@/lib/demo/data";
import type { DemoEntity } from "@/lib/demo/types";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Cell = { key: string; date: Date | null };

function buildMonthCells(reference: Date): Cell[] {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;

  const cells: Cell[] = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ key: `lead-${i}`, date: null });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ key: `day-${day}`, date: new Date(year, month, day) });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ key: `trail-${cells.length}`, date: null });
  }
  return cells;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function MonthGrid() {
  const { select } = useContextSelection();
  const today = useMemo(() => new Date(), []);
  const cells = useMemo(() => buildMonthCells(today), [today]);
  const todayIso = useMemo(() => isoDate(today), [today]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, DemoEntity[]>();
    for (const event of events) {
      const date = factValue(event, "Date");
      if (!date) continue;
      const list = map.get(date) ?? [];
      list.push(event);
      map.set(date, list);
    }
    return map;
  }, []);

  const monthLabel = today.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="calendar-month">
      <p className="calendar-month-title">{monthLabel}</p>
      <div className="calendar-grid">
        {WEEKDAY_LABELS.map((label) => (
          <div className="calendar-weekday" key={label}>
            {label}
          </div>
        ))}
        {cells.map((cell) => {
          if (!cell.date) {
            return (
              <div
                className="calendar-cell calendar-cell-empty"
                key={cell.key}
              />
            );
          }
          const iso = isoDate(cell.date);
          const dayEvents = eventsByDate.get(iso) ?? [];
          const isToday = iso === todayIso;
          const label =
            dayEvents.length > 0
              ? `${iso}: ${dayEvents.map((event) => event.title).join(", ")}`
              : iso;
          return (
            <button
              aria-label={label}
              className={cn(
                "calendar-cell",
                isToday && "calendar-cell-today",
                dayEvents.length > 0 && "calendar-cell-has-events",
              )}
              disabled={dayEvents.length === 0}
              key={cell.key}
              onClick={() => dayEvents[0] && select(dayEvents[0])}
              type="button"
            >
              <span className="calendar-cell-day">{cell.date.getDate()}</span>
              {dayEvents.length > 0 && (
                <span aria-hidden="true" className="calendar-cell-dot" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
