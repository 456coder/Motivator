// Everything the app saves on the phone, and the actions that change it.
// Saved with AsyncStorage under the key "motivator-data".

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { dateKey, type DateKey } from '@/logic/dates';
import type { Habit, HabitLogs } from '@/logic/habits';

export type Settings = {
  /** Share of habits needed for a day to count towards the streak (1 = all of them). */
  streakThreshold: number;
};

type Data = {
  habits: Habit[];
  logs: HabitLogs;
  settings: Settings;
};

export type NewHabit = Omit<Habit, 'id' | 'createdAt' | 'archived'>;

type Actions = {
  addHabit: (habit: NewHabit) => string;
  updateHabit: (id: string, changes: Partial<NewHabit>) => void;
  setArchived: (id: string, archived: boolean) => void;
  /** Removes the habit and its history for good. */
  deleteHabit: (id: string) => void;
  /** Set how much of a habit was done on a day (clamped to 0…target). */
  setAmount: (id: string, amount: number, day?: DateKey) => void;
};

const initial: Data = {
  habits: [],
  logs: {},
  settings: { streakThreshold: 1 },
};

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
    }),
    {
      name: 'motivator-data',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
