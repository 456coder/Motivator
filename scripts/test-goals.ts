// Quick checks of the goal rules. Run with: npx tsx scripts/test-goals.ts
import { addDays } from '../src/logic/dates';
import { defaultDeadline, describeGoal, formatValue, pace, progress, status, timeLeft, type Goal } from '../src/logic/goals';

const today = '2026-11-12'; // Thursday
const base: Goal = {
  id: 'g', title: 'Save', level: 'one', parentId: null, kind: 'number', unit: '£',
  startValue: 0, targetValue: 10000, currentValue: 0, startDate: addDays(today, -100), deadline: addDays(today, 100),
  doneAt: null, archived: false, createdAt: addDays(today, -100),
};
const check = (name: string, got: unknown, want: unknown) =>
  console.log(JSON.stringify(got) === JSON.stringify(want) ? 'ok  ' : 'FAIL', name, got, want);

check('half time, half done = on track', status({ ...base, currentValue: 5000 }, [], today), 'onTrack');
check('half time, 60% = ahead', status({ ...base, currentValue: 6000 }, [], today), 'ahead');
check('half time, 40% = behind', status({ ...base, currentValue: 4000 }, [], today), 'behind');
check('half time, 20% = off track', status({ ...base, currentValue: 2000 }, [], today), 'offTrack');
check('past deadline = off track', status({ ...base, currentValue: 9000, deadline: addDays(today, -1) }, [], today), 'offTrack');
check('reached = done', status({ ...base, currentValue: 10000 }, [], today), 'done');
check('weight loss 80 -> 70, at 75 halfway', status({ ...base, unit: 'kg', startValue: 80, targetValue: 70, currentValue: 75 }, [], today), 'onTrack');
check('pace per week', pace({ ...base, currentValue: 4000 }, today), { per: 'week', need: '£420', planned: '£350' });
const parent: Goal = { ...base, id: 'p', kind: 'children', level: 'three' };
const kidA: Goal = { ...base, id: 'a', parentId: 'p', currentValue: 10000 };
const kidB: Goal = { ...base, id: 'b', parentId: 'p', kind: 'done' };
check('roll-up progress', progress(parent, [parent, kidA, kidB]), 0.5);
check('roll-up describe', describeGoal(parent, [parent, kidA, kidB]), '1 of 2 steps done');
check('roll-up with no children', status(parent, [parent], today), 'none');
check('week deadline (Thu -> Sun)', defaultDeadline('week', today), '2026-11-15');
check('quarter deadline', defaultDeadline('quarter', today), '2027-02-10');
check('time left', timeLeft(base, today), '3 months left');
check('format £', formatValue(1800, '£'), '£1,800');
check('format km', formatValue(12.25, 'km'), '12.3 km');
