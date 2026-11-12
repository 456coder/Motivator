import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Screen } from '@/components/Screen';
import { useToday } from '@/hooks/useToday';
import type { DateKey } from '@/logic/dates';
import { childrenOf, describeGoal, levelInfo, progress, sortGoals, status, type Goal } from '@/logic/goals';
import type { Habit } from '@/logic/habits';
import { useStore } from '@/store/useStore';
import { areas, colors, fonts, goalLooks, radius, type } from '@/theme';

type NodeProps = {
  goal: Goal;
  goals: Goal[];
  habits: Habit[];
  today: DateKey;
  depth: number;
};

/** One goal in the tree, with its steps and habits underneath. */
function Node({ goal, goals, habits, today, depth }: NodeProps) {
  const st = status(goal, goals, today);
  const look = goalLooks[st];
  const p = progress(goal, goals);
  const kids = sortGoals(childrenOf(goal, goals));
  const kidHabits = habits.filter((h) => h.goalId === goal.id);

  return (
    <View style={depth > 0 ? styles.indent : null}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${goal.title}, ${look.label}`}
        onPress={() => router.push({ pathname: '/goal/[id]', params: { id: goal.id } })}
        style={({ pressed }) => [styles.node, pressed && styles.pressed]}>
        <View style={[styles.stripe, { backgroundColor: look.fill }]} />
        <View style={styles.nodeBody}>
          <View style={styles.between}>
            <Text style={styles.level}>{levelInfo(goal.level).label}</Text>
            <Text style={[styles.status, { color: look.text }]}>{look.label}</Text>
          </View>
          <Text style={type.cardTitle}>{goal.title}</Text>
          {p !== null && goal.kind !== 'done' ? (
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${p * 100}%`, backgroundColor: look.fill }]} />
            </View>
          ) : null}
          <Text style={type.caption}>{describeGoal(goal, goals)}</Text>
        </View>
      </Pressable>
      {kids.length > 0 || kidHabits.length > 0 ? (
        <View style={styles.children}>
          {kids.map((k) => (
            <Node key={k.id} goal={k} goals={goals} habits={habits} today={today} depth={depth + 1} />
          ))}
          {kidHabits.map((h) => (
            <Pressable
              key={h.id}
              onPress={() => router.push({ pathname: '/habit/[id]', params: { id: h.id } })}
              style={[styles.indent, styles.habit]}>
              <View style={[styles.dot, { backgroundColor: h.color }]} />
              <Text style={type.label}>{h.name}</Text>
              <Text style={type.caption}>· daily habit</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

/** The whole plan as a tree: 5-year vision at the top, down to habits. */
export default function PlanScreen() {
  const allGoals = useStore((s) => s.goals);
  const allHabits = useStore((s) => s.habits);
  const today = useToday();
  const goals = allGoals.filter((g) => !g.archived);
  const habits = allHabits.filter((h) => !h.archived);
  const ids = new Set(goals.map((g) => g.id));
  // Top of the tree: goals that don't support another (active) goal.
  const roots = sortGoals(goals.filter((g) => !g.parentId || !ids.has(g.parentId)));
  const looseHabits = habits.filter((h) => !h.goalId || !ids.has(h.goalId));

  return (
    <Screen bottomInset header={<HeaderBlock back title="Your plan" subtitle="How today leads to 5 years from now" color={areas.review.fill} />}>
      {roots.length === 0 ? (
        <EmptyState
          icon="goals"
          color={areas.goals.fill}
          soft={areas.goals.soft}
          title="No goals yet"
          body="Build your plan from a 5-year vision down to this week."
          action={{ label: 'Build your plan', onPress: () => router.push({ pathname: '/goal/new', params: { level: 'five', flow: '1' } }) }}
        />
      ) : (
        roots.map((g) => <Node key={g.id} goal={g} goals={goals} habits={habits} today={today} depth={0} />)
      )}
      {looseHabits.length > 0 ? (
        <Card>
          <Text style={type.cardTitle}>Habits not linked to a goal</Text>
          {looseHabits.map((h) => (
            <Pressable key={h.id} onPress={() => router.push({ pathname: '/habit/[id]', params: { id: h.id } })} style={styles.habit}>
              <View style={[styles.dot, { backgroundColor: h.color }]} />
              <Text style={type.label}>{h.name}</Text>
            </Pressable>
          ))}
          <Text style={type.caption}>Link a habit to a goal from the habit&apos;s Edit page.</Text>
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  indent: {
    marginLeft: 18,
  },
  children: {
    marginTop: 10,
    gap: 10,
    borderLeftWidth: 2,
    borderLeftColor: colors.line,
    marginLeft: 8,
  },
  node: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: radius.tile,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.85,
  },
  stripe: {
    width: 6,
  },
  nodeBody: {
    flex: 1,
    padding: 14,
    gap: 4,
  },
  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  level: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  status: {
    fontFamily: fonts.bold,
    fontSize: 12,
  },
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.line,
    overflow: 'hidden',
    marginVertical: 4,
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  habit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
