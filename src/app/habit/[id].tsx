import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { HeaderBlock } from '@/components/HeaderBlock';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Stepper } from '@/components/Stepper';
import { useToday } from '@/hooks/useToday';
import { addDays, weekday, WEEK } from '@/logic/dates';
import { levelInfo } from '@/logic/goals';
import {
  amountOn,
  bestStreak,
  completionRate,
  describeDays,
  describeProgress,
  habitStreak,
  isDone,
  isDue,
  TIMES,
} from '@/logic/habits';
import { useStore } from '@/store/useStore';
import { colors, fonts, radius, type } from '@/theme';
import { confirm } from '@/utils/confirm';
import { successHaptic } from '@/utils/haptics';

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={type.caption}>{label}</Text>
    </View>
  );
}

/** One habit: today's progress, streaks, the last 5 weeks, and edit / archive / delete. */
export default function HabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const habit = useStore((s) => s.habits.find((h) => h.id === id));
  const logs = useStore((s) => s.logs);
  const setAmount = useStore((s) => s.setAmount);
  const setArchived = useStore((s) => s.setArchived);
  const deleteHabit = useStore((s) => s.deleteHabit);
  const goal = useStore((s) => s.goals.find((g) => g.id === habit?.goalId));
  const today = useToday();

  if (!habit) return <Redirect href="/habits" />;

  const amount = amountOn(logs, habit.id, today);
  const done = isDone(habit, logs, today);
  const dueToday = isDue(habit, today);
  const rate = completionRate(habit, logs, 30, today);
  const time = TIMES.find((t) => t.value === habit.time)?.label ?? '';

  // 5 weeks of days, Monday first, ending with this week.
  const mondayOffset = (weekday(today) + 6) % 7;
  const start = addDays(today, -mondayOffset - 28);
  const weeks = Array.from({ length: 5 }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)));

  const set = (value: number) => {
    setAmount(habit.id, value, today);
    if (value >= habit.target && amount < habit.target) successHaptic();
  };

  return (
    <Screen
      bottomInset
      header={
        <HeaderBlock
          back
          title={habit.name}
          subtitle={`${describeDays(habit.days)} · ${time}${habit.archived ? ' · Archived' : ''}`}
          color={habit.color}
          action={{
            icon: 'edit',
            label: 'Edit habit',
            onPress: () => router.push({ pathname: '/habit/new', params: { id: habit.id } }),
          }}
        />
      }>
      <Card>
        <Text style={type.cardTitle}>Today</Text>
        {!dueToday ? (
          <Text style={type.caption}>Not due today. Enjoy the day off.</Text>
        ) : habit.target > 1 ? (
          <>
            <ProgressBar value={amount / habit.target} color={habit.color} />
            <View style={styles.between}>
              <Text style={type.label}>{describeProgress(habit, amount)}</Text>
              <Stepper label={habit.unit || 'amount'} value={amount} onChange={set} min={0} max={habit.target} />
            </View>
          </>
        ) : (
          <Button
            label={done ? 'Done today' : 'Tick off today'}
            icon="check"
            color={habit.color}
            variant={done ? 'secondary' : 'primary'}
            onPress={() => set(done ? 0 : 1)}
          />
        )}
      </Card>

      {goal ? (
        <Pressable onPress={() => router.push({ pathname: '/goal/[id]', params: { id: goal.id } })}>
          <Card>
            <Text style={type.caption}>Supports · {levelInfo(goal.level).label}</Text>
            <Text style={type.label}>{goal.title}</Text>
          </Card>
        </Pressable>
      ) : null}

      <Card>
        <View style={styles.stats}>
          <Stat value={String(habitStreak(habit, logs, today))} label="Streak" />
          <Stat value={String(bestStreak(habit, logs, today))} label="Best" />
          <Stat value={rate === null ? '–' : `${Math.round(rate * 100)}%`} label="Last 30 days" />
        </View>
      </Card>

      <Card>
        <Text style={type.cardTitle}>Last 5 weeks</Text>
        <View style={styles.weekRow}>
          {WEEK.map((w) => (
            <Text key={w.day} style={styles.weekLabel}>
              {w.short}
            </Text>
          ))}
        </View>
        {weeks.map((week) => (
          <View key={week[0]} style={styles.weekRow}>
            {week.map((day) => {
              const future = day > today;
              const due = isDue(habit, day);
              const hit = due && isDone(habit, logs, day);
              const missed = due && !hit && day < today;
              return (
                <View
                  key={day}
                  accessibilityLabel={`${day}: ${hit ? 'done' : missed ? 'missed' : due ? 'to do' : 'not due'}`}
                  style={[
                    styles.cell,
                    hit && { backgroundColor: habit.color },
                    missed && styles.missed,
                    (!due || future) && styles.off,
                    day === today && styles.today,
                  ]}
                />
              );
            })}
          </View>
        ))}
        <View style={styles.legend}>
          <View style={[styles.key, { backgroundColor: habit.color }]} />
          <Text style={type.caption}>Done</Text>
          <View style={[styles.key, styles.missed]} />
          <Text style={type.caption}>Missed</Text>
        </View>
      </Card>

      <Button
        label={habit.archived ? 'Bring it back' : 'Archive'}
        icon="archive"
        variant="secondary"
        onPress={() => {
          setArchived(habit.id, !habit.archived);
          if (!habit.archived) router.back();
        }}
      />
      <Button
        label="Delete habit"
        icon="trash"
        variant="secondary"
        onPress={() =>
          confirm('Delete this habit?', 'Its whole history goes too. Archive it instead to keep the history.', 'Delete', () => {
            router.back();
            deleteHabit(habit.id);
          })
        }
      />
      <Text style={[type.caption, styles.center]}>Archived habits stop counting but keep their history.</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stats: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.heavy,
    fontSize: 28,
    color: colors.ink,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekLabel: {
    width: 34,
    textAlign: 'center',
    fontFamily: fonts.semi,
    fontSize: 12,
    color: colors.inkFaint,
  },
  cell: {
    width: 34,
    height: 34,
    borderRadius: radius.small - 2,
    backgroundColor: colors.line,
  },
  missed: {
    backgroundColor: colors.redSoft,
  },
  off: {
    backgroundColor: colors.bg,
  },
  today: {
    borderWidth: 2,
    borderColor: colors.ink,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  key: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginLeft: 6,
  },
  center: {
    textAlign: 'center',
  },
});
