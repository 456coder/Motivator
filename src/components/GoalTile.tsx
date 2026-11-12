import { router } from 'expo-router';

import { TickCircle } from '@/components/TickCircle';
import { Tile } from '@/components/Tile';
import type { DateKey } from '@/logic/dates';
import { describeGoal, progress, status, timeLeft, type Goal } from '@/logic/goals';
import { useStore } from '@/store/useStore';
import { goalLooks } from '@/theme';
import { successHaptic } from '@/utils/haptics';

type Props = {
  goal: Goal;
  today: DateKey;
  /** "tick": tap marks it done (this week's focus on Today). "open" (default): tap opens it. */
  mode?: 'tick' | 'open';
};

/** A goal as a coloured card, coloured by how on track it is. */
export function GoalTile({ goal, today, mode = 'open' }: Props) {
  const goals = useStore((s) => s.goals);
  const setGoalDone = useStore((s) => s.setGoalDone);
  const st = status(goal, goals, today);
  const look = goalLooks[st];
  const p = progress(goal, goals);
  const open = () => router.push({ pathname: '/goal/[id]', params: { id: goal.id } });
  const done = st === 'done';

  const tick = () => {
    setGoalDone(goal.id, !done);
    if (!done) successHaptic();
  };

  return (
    <Tile
      title={goal.title}
      color={look.fill}
      tag={look.label}
      footer={done ? describeGoal(goal, goals) : `${describeGoal(goal, goals)} · ${timeLeft(goal, today)}`}
      progress={goal.kind === 'done' || p === null ? undefined : p}
      corner={mode === 'tick' && goal.kind === 'done' ? <TickCircle done={done} color={look.fill} /> : undefined}
      muted={done}
      onPress={mode === 'tick' && goal.kind === 'done' ? tick : open}
      onLongPress={open}
      accessibilityLabel={`${goal.title}, ${look.label}, ${describeGoal(goal, goals)}`}
    />
  );
}
