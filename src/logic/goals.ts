// Goal ladder rules: levels, progress, status (Ahead / On track / Behind / Off track) and pace.
// Pure functions only, so they're easy to test.

import { addDays, dateKey, fromKey, weekday, type DateKey } from '@/logic/dates';
import type { TrackStatus } from '@/theme';

export type Level = 'five' | 'three' | 'one' | 'quarter' | 'week';

/**
 * number: from a start value to a target, in a unit (e.g. £, km).
 * done: done or not done.
 * children: progress comes from the goals under it.
 */
export type GoalKind = 'number' | 'done' | 'children';

export type Goal = {
  id: string;
  title: string;
  level: Level;
  /** The higher goal this one supports (null = not linked). */
  parentId: string | null;
  kind: GoalKind;
  unit: string;
  startValue: number;
  targetValue: number;
  /** Where progress is now (number goals). */
  currentValue: number;
  startDate: DateKey;
  deadline: DateKey;
  doneAt: DateKey | null;
  archived: boolean;
  createdAt: DateKey;
};

/** One progress entry. `value` is the new total after this entry. */
export type GoalLog = {
  id: string;
  goalId: string;
  date: DateKey;
  value: number;
  note: string;
};

export const LEVELS: {
  id: Level;
  label: string;
  plural: string;
  short: string;
  /** What kinds make sense here, best first. */
  kinds: GoalKind[];
  example: string;
}[] = [
  { id: 'five', label: '5-year vision', plural: '5-year vision', short: '5 years', kinds: ['children', 'number', 'done'], example: 'e.g. Own my own flat' },
  { id: 'three', label: '3-year goal', plural: '3-year goals', short: '3 years', kinds: ['number', 'children', 'done'], example: 'e.g. Save a £30k deposit' },
  { id: 'one', label: '1-year goal', plural: '1-year goals', short: '1 year', kinds: ['number', 'done', 'children'], example: 'e.g. Save £10,000 this year' },
  { id: 'quarter', label: '90-day milestone', plural: '90-day milestones', short: '90 days', kinds: ['number', 'done'], example: 'e.g. £2,500 by the end of March' },
  { id: 'week', label: "This week's focus", plural: "This week's focus", short: 'Week', kinds: ['done', 'number'], example: 'e.g. Cancel 2 subscriptions' },
];

export const KIND_LABELS: Record<GoalKind, string> = {
  number: 'A number',
  done: 'Done or not',
  children: 'By its steps',
};

export function levelInfo(level: Level) {
  return LEVELS.find((l) => l.id === level)!;
}

/** The level one step down (undefined for "week"). */
export function levelBelow(level: Level): Level | undefined {
  const i = LEVELS.findIndex((l) => l.id === level);
  return LEVELS[i + 1]?.id;
}

/** Levels a goal on `level` can support (any higher level). */
export function parentLevels(level: Level): Level[] {
  const i = LEVELS.findIndex((l) => l.id === level);
  return LEVELS.slice(0, i).map((l) => l.id);
}

/** The usual deadline for a new goal on this level, counted from today. */
export function defaultDeadline(level: Level, today: DateKey = dateKey()): DateKey {
  const d = fromKey(today);
  switch (level) {
    case 'five':
      d.setFullYear(d.getFullYear() + 5);
      return dateKey(d);
    case 'three':
      d.setFullYear(d.getFullYear() + 3);
      return dateKey(d);
    case 'one':
      d.setFullYear(d.getFullYear() + 1);
      return dateKey(d);
    case 'quarter':
      return addDays(today, 90);
    case 'week':
      // This Sunday (today if it's Sunday).
      return addDays(today, (7 - weekday(today)) % 7);
  }
}

/** Whole days from one key to another. */
export function daysBetween(from: DateKey, to: DateKey): number {
  return Math.round((fromKey(to).getTime() - fromKey(from).getTime()) / 86_400_000);
}

/** Share of the goal's time used up by today: 0 to 1. */
export function timeElapsed(goal: Goal, today: DateKey = dateKey()): number {
  const total = daysBetween(goal.startDate, goal.deadline);
  if (total <= 0) return today >= goal.deadline ? 1 : 0;
  return Math.max(0, Math.min(1, daysBetween(goal.startDate, today) / total));
}

/** Children of a goal that still count (not archived). */
export function childrenOf(goal: Goal, goals: Goal[]): Goal[] {
  return goals.filter((g) => g.parentId === goal.id && !g.archived);
}

/**
 * How far along the goal is: 0 to 1.
 * Null for a "by the goals under it" goal with nothing under it yet.
 */
export function progress(goal: Goal, goals: Goal[], seen: Set<string> = new Set()): number | null {
  if (goal.doneAt) return 1;
  if (goal.kind === 'done') return 0;
  if (goal.kind === 'number') {
    const span = goal.targetValue - goal.startValue;
    if (span === 0) return 1;
    return Math.max(0, Math.min(1, (goal.currentValue - goal.startValue) / span));
  }
  // By the goals under it: their average (guarding against loops).
  if (seen.has(goal.id)) return null;
  seen.add(goal.id);
  const parts = childrenOf(goal, goals)
    .map((c) => progress(c, goals, seen))
    .filter((p): p is number => p !== null);
  if (parts.length === 0) return null;
  return parts.reduce((a, b) => a + b, 0) / parts.length;
}

export type Status = TrackStatus | 'done' | 'none';

/**
 * Ahead / On track / Behind / Off track, from progress made vs. time used.
 * "done" once finished; "none" when there's nothing to measure yet.
 */
export function status(goal: Goal, goals: Goal[], today: DateKey = dateKey()): Status {
  if (goal.doneAt) return 'done';
  const p = progress(goal, goals);
  if (p === null) return 'none';
  if (p >= 1) return 'done';
  if (today > goal.deadline) return 'offTrack';
  if (goal.kind === 'done') {
    // Nothing to measure until the end: warn in the last 20% of the time.
    return timeElapsed(goal, today) >= 0.8 ? 'behind' : 'onTrack';
  }
  const gap = p - timeElapsed(goal, today);
  if (gap > 0.05) return 'ahead';
  if (gap >= -0.05) return 'onTrack';
  if (gap >= -0.2) return 'behind';
  return 'offTrack';
}

/** Where a number goal should be by today. */
export function expectedValue(goal: Goal, today: DateKey = dateKey()): number {
  return goal.startValue + (goal.targetValue - goal.startValue) * timeElapsed(goal, today);
}

const CURRENCY = ['£', '$', '€'];

/** "£1,800", "12 km", "3". */
export function formatValue(value: number, unit: string): string {
  const rounded = Math.abs(value) >= 100 ? Math.round(value) : Math.round(value * 10) / 10;
  const n = rounded.toLocaleString('en-GB');
  if (!unit) return n;
  if (CURRENCY.includes(unit)) return `${value < 0 ? '-' : ''}${unit}${Math.abs(rounded).toLocaleString('en-GB')}`;
  return `${n} ${unit}`;
}

/**
 * The pace needed from now to hit the target, and the pace that was planned.
 * Per day when 31 days or fewer are left, per week up to ~6 months, otherwise per month.
 */
export function pace(goal: Goal, today: DateKey = dateKey()): { need: string; planned: string; per: string } | null {
  if (goal.kind !== 'number' || goal.doneAt) return null;
  const left = daysBetween(today, goal.deadline);
  const remaining = goal.targetValue - goal.currentValue;
  if (left <= 0 || remaining * (goal.targetValue - goal.startValue) <= 0) return null;
  const per = left <= 31 ? 'day' : left <= 183 ? 'week' : 'month';
  const size = per === 'day' ? 1 : per === 'week' ? 7 : 30.44;
  const total = Math.max(1, daysBetween(goal.startDate, goal.deadline));
  return {
    per,
    need: formatValue(Math.abs(remaining) / Math.max(1, left / size), goal.unit),
    planned: formatValue(Math.abs(goal.targetValue - goal.startValue) / Math.max(1, total / size), goal.unit),
  };
}

/** "3 days left", "5 months left", "2 years left", "Due today", "4 days late". */
export function timeLeft(goal: Goal, today: DateKey = dateKey()): string {
  const d = daysBetween(today, goal.deadline);
  if (d < 0) return `${-d} ${d === -1 ? 'day' : 'days'} late`;
  if (d === 0) return 'Due today';
  if (d === 1) return '1 day left';
  if (d < 60) return `${d} days left`;
  if (d < 730) return `${Math.round(d / 30.44)} months left`;
  return `${Math.round(d / 365.25)} years left`;
}

/** "31 Mar 2027". */
export function formatDate(key: DateKey): string {
  return fromKey(key).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Short progress line for cards: "£1,800 of £5,000", "Done", "2 of 3 steps". */
export function describeGoal(goal: Goal, goals: Goal[]): string {
  if (goal.doneAt) return 'Done';
  if (goal.kind === 'number') return `${formatValue(goal.currentValue, goal.unit)} of ${formatValue(goal.targetValue, goal.unit)}`;
  if (goal.kind === 'done') return 'Not done yet';
  const kids = childrenOf(goal, goals);
  if (kids.length === 0) return 'No steps yet';
  const done = kids.filter((k) => status(k, goals) === 'done').length;
  return `${done} of ${kids.length} ${kids.length === 1 ? 'step' : 'steps'} done`;
}

/** Goals in ladder order (higher levels first, then soonest deadline). */
export function sortGoals(goals: Goal[]): Goal[] {
  const order = LEVELS.map((l) => l.id);
  return [...goals].sort((a, b) => order.indexOf(a.level) - order.indexOf(b.level) || a.deadline.localeCompare(b.deadline));
}

/** A recorded change to a goal's deadline or target, or the goal being stopped. */
export type GoalChange = {
  id: string;
  goalId: string;
  field: 'deadline' | 'target' | 'archived';
  from: string;
  to: string;
  /** True when the change made the goal easier (later deadline, smaller target, stopping it). */
  easier: boolean;
  reason: string;
  date: DateKey;
};

type ChangeDraft = Omit<GoalChange, 'id' | 'goalId' | 'reason' | 'date'>;

/**
 * The deadline / target changes between a goal and its edited version.
 * Later deadlines and targets closer to the start count as "easier".
 */
export function goalChanges(
  before: Goal,
  after: Pick<Goal, 'deadline' | 'targetValue' | 'startValue' | 'kind' | 'unit'>,
): ChangeDraft[] {
  const out: ChangeDraft[] = [];
  if (after.deadline !== before.deadline) {
    out.push({
      field: 'deadline',
      from: formatDate(before.deadline),
      to: formatDate(after.deadline),
      easier: after.deadline > before.deadline,
    });
  }
  if (before.kind === 'number' && after.kind === 'number' && after.targetValue !== before.targetValue) {
    out.push({
      field: 'target',
      from: formatValue(before.targetValue, before.unit),
      to: formatValue(after.targetValue, after.unit),
      easier: Math.abs(after.targetValue - after.startValue) < Math.abs(before.targetValue - before.startValue),
    });
  }
  return out;
}

/** "Deadline moved later: 31 Mar 2027 → 30 Apr 2027". */
export function describeChange(c: GoalChange): string {
  if (c.field === 'archived') return 'Stopped before it was finished';
  const what = c.field === 'deadline' ? 'Deadline' : 'Target';
  const how = c.field === 'deadline' ? (c.easier ? 'moved later' : 'moved sooner') : c.easier ? 'lowered' : 'raised';
  return `${what} ${how}: ${c.from} → ${c.to}`;
}
