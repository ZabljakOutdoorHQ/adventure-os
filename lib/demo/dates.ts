// Relative-date helpers so prototype content always reads as "current" —
// dates are computed from the real clock, never hard-coded, even though the
// content itself is demo data.

export function daysFromToday(offset: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

export function todayIso(): string {
  return daysFromToday(0);
}

export function atTime(offset: number, hours: number, minutes = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  date.setHours(hours, minutes, 0, 0);
  return date.toISOString();
}
