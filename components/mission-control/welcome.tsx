"use client";

import { useEffect, useState } from "react";

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Welcome() {
  // Rendered without a live clock on the server (and on the client's first
  // paint) so hydration always matches; the real greeting and date fill in
  // a moment later from the visitor's own clock.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const greeting = now ? greetingFor(now.getHours()) : "Welcome";
  const formattedDate = now
    ? new Intl.DateTimeFormat(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(now)
    : "";

  return (
    <header>
      <p className="text-2xl font-semibold">{greeting}</p>
      <p
        className="mt-1 text-[var(--muted-foreground)]"
        aria-hidden={!formattedDate}
      >
        {formattedDate || " "}
      </p>
      <h1 className="eyebrow mt-3">Mission Control</h1>
    </header>
  );
}
