// Quick checks of the habit rules. Run with: npx tsx scripts/test-habits.ts
import { dayScore, dayStreak, habitStreak, bestStreak, completionRate, describeDays, type Habit } from '../src/logic/habits';
import { addDays } from '../src/logic/dates';
const today = '2026-11-12'; // Thursday
const all = [0,1,2,3,4,5,6];
const water: Habit = { id: 'w', name: 'Water', color: '', days: all, target: 8, unit: 'glasses', time: 'morning', createdAt: addDays(today, -10), archived: false };
const gym: Habit = { id: 'g', name: 'Gym', color: '', days: [1,3,5], target: 1, unit: '', time: 'evening', createdAt: addDays(today, -10), archived: false };
const logs: Record<string, Record<string, number>> = {};
for (let i = 1; i <= 10; i++) { const d = addDays(today, -i); logs[d] = { w: 8, g: 1 }; }
logs[addDays(today, -6)] = { w: 3, g: 1 }; // Fri 6 Nov: water only 3
const check = (name: string, got: unknown, want: unknown) => console.log(JSON.stringify(got) === JSON.stringify(want) ? 'ok  ' : 'FAIL', name, got, want);
check('dayStreak (today unfinished, broken 6 days ago)', dayStreak([water, gym], logs, 1, today), 5);
check('dayStreak with 30% threshold', dayStreak([water, gym], logs, 0.3, today), 10);
logs[today] = { w: 8 }; // Thursday: gym not due
check('dayStreak today done', dayStreak([water, gym], logs, 1, today), 6);
check('water streak', habitStreak(water, logs, today), 6);
check('gym streak (only M/W/F count)', habitStreak(gym, logs, today), 5);
check('water best', bestStreak(water, logs, today), 6);
check('score today', dayScore([water, gym], { [today]: { w: 4 } }, today), 0.5);
check('completion water 30d', Math.round((completionRate(water, logs, 30, today) ?? 0) * 100), 91);
check('weekdays', describeDays([1,2,3,4,5]), 'Weekdays');
check('mwf', describeDays([5,1,3]), 'Mon, Wed, Fri');
check('new habit, nothing logged', dayStreak([{ ...water, createdAt: today }], {}, 1, today), 0);
