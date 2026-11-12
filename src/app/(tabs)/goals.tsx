import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { GoalTile } from '@/components/GoalTile';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Screen } from '@/components/Screen';
import { Shelf } from '@/components/Shelf';
import { useToday } from '@/hooks/useToday';
import { LEVELS, sortGoals } from '@/logic/goals';
import { useStore } from '@/store/useStore';
import { areas } from '@/theme';

/** All goals, one shelf per level of the ladder. */
export default function GoalsScreen() {
  const goals = useStore((s) => s.goals);
  const today = useToday();
  const active = sortGoals(goals.filter((g) => !g.archived));
  const archived = goals.filter((g) => g.archived);
  const build = () => router.push({ pathname: '/goal/new', params: { level: 'five', flow: '1' } });
  const add = () => router.push('/goal/new');

  return (
    <Screen
      header={
        <HeaderBlock
          title="Goals"
          subtitle="From 5 years down to this week"
          color={areas.goals.fill}
          action={{ icon: 'plus', label: 'New goal', onPress: add }}
        />
      }>
      {active.length === 0 ? (
        <>
          <EmptyState
            icon="goals"
            color={areas.goals.fill}
            soft={areas.goals.soft}
            title="Build your plan"
            body="Start with where you want to be in 5 years, then break it down to this year, the next 90 days and this week. Skip any step you like."
            action={{ label: 'Build your plan', onPress: build }}
          />
          <Button label="Just add one goal" variant="secondary" onPress={add} />
        </>
      ) : (
        <>
          <View style={styles.row}>
            <Button label="See the whole plan" icon="chart" variant="secondary" onPress={() => router.push('/plan')} style={styles.flex} />
          </View>
          {LEVELS.map((l) => {
            const group = active.filter((g) => g.level === l.id);
            if (group.length === 0) return null;
            return (
              <Shelf key={l.id} title={l.plural}>
                {group.map((g) => (
                  <GoalTile key={g.id} goal={g} today={today} />
                ))}
              </Shelf>
            );
          })}
          <Button label="Build your plan again" variant="secondary" onPress={build} />
        </>
      )}
      {archived.length > 0 ? (
        <Shelf title="Archived">
          {archived.map((g) => (
            <GoalTile key={g.id} goal={g} today={today} />
          ))}
        </Shelf>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
});
