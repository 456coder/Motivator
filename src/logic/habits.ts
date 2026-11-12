// Habit rules: which habits are due, when they count as done, scores and streaks.
// Pure functions only (no saving, no drawing), so they're easy to test.

import { addDays, dateKey, weekday, WEEK, type DateKey } from '@/logic/dates';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'anytime';

export type Habit = {
  id: string;
  name: string;
  color: string;
  /** Days of the week it's due: 0 = Sunday … 6 = Saturday. */
  days: number[];
  /** 1 = a simple tick. More than 1 = a count to reach (e.g. 8 glasses). */
  target: number;
  /** Unit for counted habits, e.g. "glasses". */
  unit: string;
  time: TimeOfDay;
  createdAt: DateKey;
  archived: boolean;
  /** The goal this habit supports (optional). */
  goalId?: string | null;
};

/** For each day, how much of each habit was done: logs[day][habitId] = amount. */
export type HabitLogs = Record<DateKey, Record<string, number>>;

export const TIMES: { value: TimeOfDay; label: string }[] = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'anytime', label: 'Anytime' },
];

/** True if the habit is due on this day (and existed by then). */
export function isDue(habit: Habit, day: DateKey): boolean {
  return !habit.archived && day >= habit.createdAt && habit.days.includes(weekday(day));
}

export function amountOn(logs: HabitLogs, habitId: string, day: DateKey): number {
  return logs[day]?.[habitId] ?? 0;
}

export function isDone(habit: Habit, logs: HabitLogs, day: DateKey): boolean {
  return amountOn(logs, habit.id, day) >= habit.target;
}

/** The habits due on a day, in time-of-day order. */
export function dueHabits(habits: Habit[], day: DateKey): Habit[] {
  const order = TIMES.map((t) => t.value);
  return habits.filter((h) => isDue(h, day)).sort((a, b) => order.indexOf(a.time) - order.indexOf(b.time));
}

/** Share of a day's habits that were done: 0 to 1. Null if nothing was due. */
export function dayScore(habits: Habit[], logs: HabitLogs, day: DateKey): number | null {
  const due = dueHabits(habits, day);
  if (due.length === 0) return null;
  // Counted habits give part marks (4 of 8 glasses = half a habit).
  const total = due.reduce((sum, h) => sum + Math.min(1, amountOn(logs, h.id, day) / h.target), 0);
  return total / due.length;
}

/** Earliest day any habit started (streaks never look further back). */
function firstDay(habits: Habit[]): DateKey | null {
  if (habits.length === 0) return null;
  return habits.reduce((min, h) => (h.createdAt < min ? h.createdAt : min), habits[0].createdAt);
}

/**
 * Overall streak: full days in a row, counting back from today.
 * A day counts when its score reaches the threshold (1 = every habit done).
 * Days with nothing due are skipped. Today only adds to the streak once it's
 * reached; an unfinished today doesn't break it yet (there's still time).
 */
export function dayStreak(habits: Habit[], logs: HabitLogs, threshold = 1, today: DateKey = dateKey()): number {
  const start = firstDay(habits);
  if (!start) return 0;
  let streak = 0;
  for (let day = today; day >= start; day = addDays(day, -1)) {
    const score = dayScore(habits, logs, day);
    if (score === null) continue;
    if (score >= threshold - 1e-9) streak += 1;
    else if (day !== today) break;
  }
  return streak;
}

/** Current streak for one habit (its due days done in a row). Same rules as dayStreak. */
export function habitStreak(habit: Habit, logs: HabitLogs, today: DateKey = dateKey()): number {
  let streak = 0;
  for (let day = today; day >= habit.createdAt; day = addDays(day, -1)) {
    if (!isDue(habit, day)) continue;
    if (isDone(habit, logs, day)) streak += 1;
    else if (day !== today) break;
  }
  return streak;
}

/** Longest streak the habit has ever had. */
export function bestStreak(habit: Habit, logs: HabitLogs, today: DateKey = dateKey()): number {
  let best = 0;
  let run = 0;
  for (let day = habit.createdAt; day <= today; day = addDays(day, 1)) {
    if (!isDue(habit, day)) continue;
    if (isDone(habit, logs, day)) {
      run += 1;
      best = Math.max(best, run);
    } else if (day !== today) {
      run = 0;
    }
  }
  return best;
}

/** Share of due days done over the last `days` days (today included). Null if none were due. */
export function completionRate(habit: Habit, logs: HabitLogs, days = 30, today: DateKey = dateKey()): number | null {
  let due = 0;
  let done = 0;
  for (let i = 0; i < days; i++) {
    const day = addDays(today, -i);
    if (!isDue(habit, day)) continue;
    // An unfinished today isn't a miss yet.
    if (day === today && !isDone(habit, logs, day)) continue;
    due += 1;
    if (isDone(habit, logs, day)) done += 1;
  }
  return due === 0 ? null : done / due;
}

/** "Every day", "Weekdays", "Weekends" or e.g. "Mon, Wed, Fri". */
export function describeDays(days: number[]): string {
  const set = new Set(days);
  if (set.size === 7) return 'Every day';
  if (set.size === 5 && [1, 2, 3, 4, 5].every((d) => set.has(d))) return 'Weekdays';
  if (set.size === 2 && set.has(0) && set.has(6)) return 'Weekends';
  return WEEK.filter((w) => set.has(w.day))
    .map((w) => w.name)
    .join(', ');
}

/** "3 of 8 glasses" for counted habits, "Done" / "To do" for simple ones. */
export function describeProgress(habit: Habit, amount: number): string {
  if (habit.target <= 1) return amount >= 1 ? 'Done' : 'To do';
  return `${Math.min(amount, habit.target)} of ${habit.target}${habit.unit ? ` ${habit.unit}` : ''}`;
}
