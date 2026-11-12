// Small date helpers. Days are local calendar days, written as "YYYY-MM-DD".

export type DateKey = string;

/** "2026-11-12" for the given date, in local time. */
export function dateKey(d: Date = new Date()): DateKey {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** The Date (local midnight) for a "YYYY-MM-DD" key. */
export function fromKey(key: DateKey): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** The key `days` days after (or before, if negative) the given key. */
export function addDays(key: DateKey, days: number): DateKey {
  const d = fromKey(key);
  d.setDate(d.getDate() + days);
  return dateKey(d);
}

/** Day of the week for a key: 0 = Sunday … 6 = Saturday. */
export function weekday(key: DateKey): number {
  return fromKey(key).getDay();
}

/** Short day names, Monday first (the order shown on screen). */
export const WEEK = [
  { day: 1, short: 'M', name: 'Mon' },
  { day: 2, short: 'T', name: 'Tue' },
  { day: 3, short: 'W', name: 'Wed' },
  { day: 4, short: 'T', name: 'Thu' },
  { day: 5, short: 'F', name: 'Fri' },
  { day: 6, short: 'S', name: 'Sat' },
  { day: 0, short: 'S', name: 'Sun' },
];
