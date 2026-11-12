import { router } from 'expo-router';

import { EmptyState } from '@/components/EmptyState';
import { HabitTile } from '@/components/HabitTile';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Screen } from '@/components/Screen';
import { Shelf } from '@/components/Shelf';
import { useToday } from '@/hooks/useToday';
import { TIMES } from '@/logic/habits';
import { useStore } from '@/store/useStore';
import { areas } from '@/theme';

/** All habits, grouped by time of day. Tap one to open it. */
export default function HabitsScreen() {
  const habits = useStore((s) => s.habits);
  const today = useToday();
  const active = habits.filter((h) => !h.archived);
  const archived = habits.filter((h) => h.archived);
  const add = () => router.push('/habit/new');

  return (
    <Screen
      header={
        <HeaderBlock
          title="Habits"
          subtitle={active.length === 1 ? '1 habit' : `${active.length} habits`}
          color={areas.habits.fill}
          action={{ icon: 'plus', label: 'New habit', onPress: add }}
        />
      }>
      {active.length === 0 ? (
        <EmptyState
          icon="habits"
          color={areas.habits.fill}
          soft={areas.habits.soft}
          title="No habits yet"
          body="Add the small things you want to do every day. Each one you finish keeps your streak alive."
          action={{ label: 'Add a habit', onPress: add }}
        />
      ) : (
        TIMES.map((t) => {
          const group = active.filter((h) => h.time === t.value);
          if (group.length === 0) return null;
          return (
            <Shelf key={t.value} title={t.label}>
              {group.map((h) => (
                <HabitTile key={h.id} habit={h} day={today} mode="open" />
              ))}
            </Shelf>
          );
        })
      )}
      {archived.length > 0 ? (
        <Shelf title="Archived">
          {archived.map((h) => (
            <HabitTile key={h.id} habit={h} day={today} mode="open" />
          ))}
        </Shelf>
      ) : null}
    </Screen>
  );
}
