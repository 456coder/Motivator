import { router } from 'expo-router';

import { TickCircle } from '@/components/TickCircle';
import { Tile } from '@/components/Tile';
import type { DateKey } from '@/logic/dates';
import { amountOn, describeDays, describeProgress, habitStreak, type Habit } from '@/logic/habits';
import { useStore } from '@/store/useStore';
import { successHaptic } from '@/utils/haptics';

type Props = {
  habit: Habit;
  day: DateKey;
  /**
   * "tick": tap ticks it off (or adds one to a count), hold opens it.
   * "open": tap opens it (used on the Habits tab).
   */
  mode: 'tick' | 'open';
};

/** A habit as a coloured card. */
export function HabitTile({ habit, day, mode }: Props) {
  const logs = useStore((s) => s.logs);
  const setAmount = useStore((s) => s.setAmount);
  const amount = amountOn(logs, habit.id, day);
  const done = amount >= habit.target;
  const streak = habitStreak(habit, logs, day);
  const open = () => router.push({ pathname: '/habit/[id]', params: { id: habit.id } });

  const tick = () => {
    if (habit.target <= 1) {
      // Simple habits: tap again to undo.
      setAmount(habit.id, done ? 0 : 1, day);
      if (!done) successHaptic();
    } else if (!done) {
      // Counted habits: one more each tap (undo from the habit's page).
      setAmount(habit.id, amount + 1, day);
      if (amount + 1 >= habit.target) successHaptic();
    }
  };

  const counted = habit.target > 1;
  return (
    <Tile
      title={habit.name}
      color={habit.color}
      tag={streak > 0 ? `${streak} day streak` : mode === 'open' ? describeDays(habit.days) : undefined}
      footer={mode === 'open' ? describeDays(habit.days) : describeProgress(habit, amount)}
      progress={counted ? amount / habit.target : undefined}
      corner={mode === 'tick' ? <TickCircle done={done} color={habit.color} /> : undefined}
      muted={mode === 'tick' && done}
      onPress={mode === 'tick' ? tick : open}
      onLongPress={open}
      accessibilityLabel={`${habit.name}, ${describeProgress(habit, amount)}${mode === 'tick' ? '. Tap to tick off, hold for details.' : ''}`}
    />
  );
}
