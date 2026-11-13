// Quick checks of the chart numbers. Run with: npx tsx scripts/test-stats.ts
import { addDays } from '../src/logic/dates';
import type { Goal } from '../src/logic/goals';
import type { Habit } from '../src/logic/habits';
import { dailyScores, fullDays, goalSeries, weekStart, weeklyScores } from '../src/logic/stats';

const today = '2026-11-13'; // Friday
const check = (name: string, got: unknown, want: unknown) =>
  console.log(JSON.stringify(got) === JSON.stringify(want) ? 'ok  ' : 'FAIL', name, got, want);

const h: Habit = { id: 'h', name: 'Read', color: '', days: [0, 1, 2, 3, 4, 5, 6], target: 1, unit: '', time: 'anytime', createdAt: addDays(today, -20), archived: false };
const logs: Record<string, Record<string, number>> = {};
for (let i = 0; i <= 20; i++) if (i % 2 === 0) logs[addDays(today, -i)] = { h: 1 };

check('week starts Monday', weekStart(today), '2026-11-09');
check('week start on Sunday', weekStart('2026-11-15'), '2026-11-09');
check('daily scores', dailyScores([h], logs, 3, today).map((d) => d.score), [1, 0, 1]);
check('before the habit existed = null', dailyScores([h], logs, 25, today)[0].score, null);
// This week: Mon 9 (odd -> 0? 4 days ago = even -> done), Tue 10 (3 ago, missed), Wed 11 (done), Thu 12 (missed), Fri 13 (done) = 3/5
check('this week average', weeklyScores([h], logs, 1, today)[0].score, 0.6);
check('full days in last 7', fullDays([h], logs, 7, 1, today), 4);

const g: Goal = {
  id: 'g', title: 'Save', level: 'one', parentId: null, kind: 'number', unit: '£', startValue: 0, targetValue: 1000,
  currentValue: 300, startDate: addDays(today, -30), deadline: addDays(today, 30), doneAt: null, archived: false, createdAt: addDays(today, -30),
};
const gl = [
  { id: '1', goalId: 'g', date: addDays(today, -20), value: 100, note: '' },
  { id: '2', goalId: 'g', date: addDays(today, -20), value: 150, note: '' },
  { id: '3', goalId: 'g', date: addDays(today, -5), value: 300, note: '' },
];
check('goal series', goalSeries(g, gl, today).map((p) => p.value), [0, 150, 300, 300]);
check('goal series ends today', goalSeries(g, gl, today).at(-1)!.day, today);
