// Everything the app saves on the phone, and the actions that change it.
// Saved with AsyncStorage under the key "motivator-data".

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { dateKey, type DateKey } from '@/logic/dates';
import type { Goal, GoalLog } from '@/logic/goals';
import type { Habit, HabitLogs } from '@/logic/habits';

export type Settings = {
  /** Share of habits needed for a day to count towards the streak (1 = all of them). */
  streakThreshold: number;
};

type Data = {
  habits: Habit[];
  logs: HabitLogs;
  goals: Goal[];
  goalLogs: GoalLog[];
  settings: Settings;
};

export type NewHabit = Omit<Habit, 'id' | 'createdAt' | 'archived'>;
export type NewGoal = Omit<Goal, 'id' | 'createdAt' | 'archived' | 'doneAt' | 'currentValue'>;

type Actions = {
  addHabit: (habit: NewHabit) => string;
  updateHabit: (id: string, changes: Partial<NewHabit>) => void;
  setArchived: (id: string, archived: boolean) => void;
  /** Removes the habit and its history for good. */
  deleteHabit: (id: string) => void;
  /** Set how much of a habit was done on a day (clamped to 0…target). */
  setAmount: (id: string, amount: number, day?: DateKey) => void;

  addGoal: (goal: NewGoal) => string;
  updateGoal: (id: string, changes: Partial<NewGoal>) => void;
  /** Record progress on a number goal: `value` is the new total. Marks it done when the target is reached. */
  logProgress: (id: string, value: number, note: string) => void;
  deleteGoalLog: (logId: string) => void;
  setGoalDone: (id: string, done: boolean) => void;
  setGoalArchived: (id: string, archived: boolean) => void;
  /** Removes the goal and its progress log. Goals and habits under it move up to its parent. */
  deleteGoal: (id: string) => void;
};

const initial: Data = {
  habits: [],
  logs: {},
  goals: [],
  goalLogs: [],
  settings: { streakThreshold: 1 },
};

/** True when `value` has reached `target`, going from `start` (works for goals that go down too). */
function reached(start: number, target: number, value: number) {
  return target >= start ? value >= target : value <= target;
}

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export const useStore = create<Data & Actions>()(
  persist(
    (set) => ({
      ...initial,

      addHabit: (habit) => {
        const id = newId();
        set((s) => ({ habits: [...s.habits, { ...habit, id, createdAt: dateKey(), archived: false }] }));
        return id;
      },

      updateHabit: (id, changes) =>
        set((s) => ({ habits: s.habits.map((h) => (h.id === id ? { ...h, ...changes } : h)) })),

      setArchived: (id, archived) =>
        set((s) => ({ habits: s.habits.map((h) => (h.id === id ? { ...h, archived } : h)) })),

      deleteHabit: (id) =>
        set((s) => {
          const logs: HabitLogs = {};
          for (const [day, entries] of Object.entries(s.logs)) {
            const { [id]: _removed, ...rest } = entries;
            if (Object.keys(rest).length > 0) logs[day] = rest;
          }
          return { habits: s.habits.filter((h) => h.id !== id), logs };
        }),

      setAmount: (id, amount, day = dateKey()) =>
        set((s) => {
          const habit = s.habits.find((h) => h.id === id);
          if (!habit) return {};
          const value = Math.max(0, Math.min(habit.target, Math.round(amount)));
          return { logs: { ...s.logs, [day]: { ...s.logs[day], [id]: value } } };
        }),

      addGoal: (goal) => {
        const id = newId();
        set((s) => ({
          goals: [
            ...s.goals,
            { ...goal, id, currentValue: goal.startValue, doneAt: null, archived: false, createdAt: dateKey() },
          ],
        }));
        return id;
      },

      updateGoal: (id, changes) =>
        set((s) => ({
          goals: s.goals.map((g) => {
            if (g.id !== id) return g;
            const next = { ...g, ...changes };
            // A new start value with no progress logged yet moves the current value too.
            if (changes.startValue !== undefined && !s.goalLogs.some((l) => l.goalId === id)) {
              next.currentValue = changes.startValue;
            }
            if (next.kind === 'number') {
              const hit = reached(next.startValue, next.targetValue, next.currentValue);
              next.doneAt = hit ? (g.doneAt ?? dateKey()) : null;
            }
            return next;
          }),
        })),

      logProgress: (id, value, note) =>
        set((s) => {
          const goal = s.goals.find((g) => g.id === id);
          if (!goal) return {};
          const hit = reached(goal.startValue, goal.targetValue, value);
          return {
            goalLogs: [...s.goalLogs, { id: newId(), goalId: id, date: dateKey(), value, note: note.trim() }],
            goals: s.goals.map((g) =>
              g.id === id ? { ...g, currentValue: value, doneAt: hit ? (g.doneAt ?? dateKey()) : null } : g,
            ),
          };
        }),

      deleteGoalLog: (logId) =>
        set((s) => {
          const log = s.goalLogs.find((l) => l.id === logId);
          if (!log) return {};
          const goalLogs = s.goalLogs.filter((l) => l.id !== logId);
          const goal = s.goals.find((g) => g.id === log.goalId);
          if (!goal) return { goalLogs };
          // The current value falls back to the latest remaining entry (or the start).
          const latest = goalLogs.filter((l) => l.goalId === goal.id).at(-1);
          const value = latest?.value ?? goal.startValue;
          const hit = reached(goal.startValue, goal.targetValue, value);
          return {
            goalLogs,
            goals: s.goals.map((g) => (g.id === goal.id ? { ...g, currentValue: value, doneAt: hit ? g.doneAt : null } : g)),
          };
        }),

      setGoalDone: (id, done) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, doneAt: done ? dateKey() : null } : g)) })),

      setGoalArchived: (id, archived) =>
        set((s) => ({ goals: s.goals.map((g) => (g.id === id ? { ...g, archived } : g)) })),

      deleteGoal: (id) =>
        set((s) => {
          const goal = s.goals.find((g) => g.id === id);
          if (!goal) return {};
          return {
            goals: s.goals
              .filter((g) => g.id !== id)
              .map((g) => (g.parentId === id ? { ...g, parentId: goal.parentId } : g)),
            goalLogs: s.goalLogs.filter((l) => l.goalId !== id),
            habits: s.habits.map((h) => (h.goalId === id ? { ...h, goalId: goal.parentId } : h)),
          };
        }),
    }),
    {
      name: 'motivator-data',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      // Older saves: version 1 had habits only.
      migrate: (saved, version) => {
        const data = saved as Partial<Data>;
        if (version < 2) return { ...data, goals: [], goalLogs: [] };
        return data;
      },
    },
  ),
);
