// Numbers for the charts: daily and weekly scores, and a goal's progress over time.
// Pure functions only, so they're easy to test.

import { addDays, dateKey, weekday, type DateKey } from '@/logic/dates';
import { daysBetween, type Goal, type GoalLog } from '@/logic/goals';
import { dayScore, type Habit, type HabitLogs } from '@/logic/habits';

/** Monday of the week a day is in. */
export function weekStart(day: DateKey): DateKey {
  return addDays(day, -((weekday(day) + 6) % 7));
}

/** Score for each of the last `days` days, oldest first. Null on days with nothing due. */
export function dailyScores(habits: Habit[], logs: HabitLogs, days: number, today: DateKey = dateKey()) {
  return Array.from({ length: days }, (_, i) => {
    const day = addDays(today, i - days + 1);
    return { day, score: dayScore(habits, logs, day) };
  });
}

/**
 * Average daily score for each of the last `weeks` weeks (Monday to Sunday), oldest first.
 * This week only counts days up to today. Null for weeks with nothing due.
 */
export function weeklyScores(habits: Habit[], logs: HabitLogs, weeks: number, today: DateKey = dateKey()) {
  const thisMonday = weekStart(today);
  return Array.from({ length: weeks }, (_, i) => {
    const monday = addDays(thisMonday, (i - weeks + 1) * 7);
    const scores: number[] = [];
    for (let d = 0; d < 7; d++) {
      const day = addDays(monday, d);
      if (day > today) break;
      const s = dayScore(habits, logs, day);
      if (s !== null) scores.push(s);
    }
    return { monday, score: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null };
  });
}

/** Number of days in the last `days` (today included) that reached the threshold. */
export function fullDays(habits: Habit[], logs: HabitLogs, days: number, threshold = 1, today: DateKey = dateKey()) {
  return dailyScores(habits, logs, days, today).filter((d) => d.score !== null && d.score >= threshold - 1e-9).length;
}

export type Point = { day: DateKey; value: number };

/**
 * A number goal's progress over time: the start, every logged total, and today.
 * Entries on the same day keep only the last one.
 */
export function goalSeries(goal: Goal, goalLogs: GoalLog[], today: DateKey = dateKey()): Point[] {
  const points: Point[] = [{ day: goal.startDate, value: goal.startValue }];
  for (const log of goalLogs.filter((l) => l.goalId === goal.id)) {
    const day = log.date < goal.startDate ? goal.startDate : log.date;
    if (points.at(-1)!.day === day) points[points.length - 1] = { day, value: log.value };
    else points.push({ day, value: log.value });
  }
  // Carry the latest value on to today (or the deadline, if that's sooner).
  const end = today < goal.deadline ? today : goal.deadline;
  if (end > points.at(-1)!.day) points.push({ day: end, value: goal.currentValue });
  return points;
}

/** x position (0–1) of a day between a goal's start and deadline. */
export function dayPosition(goal: Goal, day: DateKey): number {
  const total = Math.max(1, daysBetween(goal.startDate, goal.deadline));
  return Math.max(0, Math.min(1, daysBetween(goal.startDate, day) / total));
}
