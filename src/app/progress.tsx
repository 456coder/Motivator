import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BarChart } from '@/components/BarChart';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { GoalChart } from '@/components/GoalChart';
import { HabitHeatmap } from '@/components/HabitHeatmap';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Screen } from '@/components/Screen';
import { Segmented } from '@/components/Segmented';
import { StatusBadge } from '@/components/StatusBadge';
import { useToday } from '@/hooks/useToday';
import { fromKey, WEEK, weekday } from '@/logic/dates';
import { formatDate, formatValue, sortGoals, status } from '@/logic/goals';
import { dayStreak } from '@/logic/habits';
import { dailyScores, fullDays, weeklyScores } from '@/logic/stats';
import { useStore } from '@/store/useStore';
import { areas, colors, fonts, goalLooks, type } from '@/theme';

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={[type.caption, styles.center]}>{label}</Text>
    </View>
  );
}

const pct = (v: number | null) => (v === null ? '–' : `${Math.round(v * 100)}%`);

/** Charts: daily and weekly scores, a heatmap per habit, a line per goal, and recent progress. */
export default function ProgressScreen() {
  const habits = useStore((s) => s.habits);
  const logs = useStore((s) => s.logs);
  const goals = useStore((s) => s.goals);
  const goalLogs = useStore((s) => s.goalLogs);
  const threshold = useStore((s) => s.settings.streakThreshold);
  const today = useToday();
  const [range, setRange] = useState<'days' | 'weeks'>('days');

  const activeHabits = habits.filter((h) => !h.archived);
  const numberGoals = sortGoals(goals.filter((g) => !g.archived && g.kind === 'number'));
  const thisWeek = weeklyScores(habits, logs, 1, today)[0].score;
  const streak = dayStreak(habits, logs, threshold, today);
  const full30 = fullDays(habits, logs, 30, threshold, today);

  const bars =
    range === 'days'
      ? dailyScores(habits, logs, 14, today).map((d) => ({
          value: d.score,
          // A letter per day; today is outlined.
          label: WEEK.find((w) => w.day === weekday(d.day))!.short,
          current: d.day === today,
        }))
      : weeklyScores(habits, logs, 8, today).map((w, i, all) => ({
          value: w.score,
          label: `${fromKey(w.monday).getDate()}/${fromKey(w.monday).getMonth() + 1}`,
          current: i === all.length - 1,
        }));

  // Latest progress entries across all goals.
  const recent = [...goalLogs]
    .reverse()
    .slice(0, 8)
    .map((l) => ({ log: l, goal: goals.find((g) => g.id === l.goalId) }))
    .filter((r) => r.goal);

  const nothing = activeHabits.length === 0 && numberGoals.length === 0;

  return (
    <Screen bottomInset header={<HeaderBlock back title="Your progress" subtitle="How you're really doing" color={areas.review.fill} />}>
      {nothing ? (
        <EmptyState
          icon="chart"
          color={areas.review.fill}
          soft={areas.review.soft}
          title="Nothing to chart yet"
          body="Add a habit or a goal with a number, and your progress shows up here."
        />
      ) : null}

      {activeHabits.length > 0 ? (
        <>
          <Card>
            <View style={styles.stats}>
              <Stat value={pct(thisWeek)} label="This week" />
              <Stat value={String(streak)} label="Day streak" />
              <Stat value={`${full30}/30`} label="Full days" />
            </View>
          </Card>

          <Card>
            <View style={styles.between}>
              <Text style={type.cardTitle}>Your score</Text>
              <View style={styles.segment}>
                <Segmented
                  value={range}
                  onChange={setRange}
                  options={[
                    { value: 'days', label: '14 days' },
                    { value: 'weeks', label: '8 weeks' },
                  ]}
                />
              </View>
            </View>
            <BarChart bars={bars} color={colors.brand} goalLine={threshold} fadeBelowGoal={range === 'days'} />
            <Text style={type.caption}>
              {range === 'days' ? 'Share of each day’s habits done.' : 'Average daily score each week (Monday to Sunday).'} The dashed line
              is a full day.
            </Text>
          </Card>

          <Text style={styles.section}>Habits · last 12 weeks</Text>
          {activeHabits.map((h) => (
            <Pressable key={h.id} onPress={() => router.push({ pathname: '/habit/[id]', params: { id: h.id } })}>
              <Card>
                <View style={styles.between}>
                  <View style={styles.nameRow}>
                    <View style={[styles.dot, { backgroundColor: h.color }]} />
                    <Text style={type.cardTitle}>{h.name}</Text>
                  </View>
                </View>
                <HabitHeatmap habit={h} logs={logs} today={today} />
              </Card>
            </Pressable>
          ))}
        </>
      ) : null}

      {numberGoals.length > 0 ? (
        <>
          <Text style={styles.section}>Goals · you vs. where you should be</Text>
          {numberGoals.map((g) => {
            const st = status(g, goals, today);
            return (
              <Pressable key={g.id} onPress={() => router.push({ pathname: '/goal/[id]', params: { id: g.id } })}>
                <Card>
                  <View style={styles.between}>
                    <Text style={[type.cardTitle, styles.flex]} numberOfLines={1}>
                      {g.title}
                    </Text>
                    <StatusBadge status={st} />
                  </View>
                  <GoalChart goal={g} goalLogs={goalLogs} today={today} color={goalLooks[st].fill} height={110} />
                </Card>
              </Pressable>
            );
          })}
        </>
      ) : null}

      {recent.length > 0 ? (
        <Card>
          <Text style={type.cardTitle}>Recent progress</Text>
          {recent.map(({ log, goal }) => (
            <View key={log.id} style={styles.row}>
              <View style={styles.flex}>
                <Text style={type.label}>{goal!.title}</Text>
                <Text style={type.caption}>
                  {formatValue(log.value, goal!.unit)} · {formatDate(log.date)}
                  {log.note ? ` · ${log.note}` : ''}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: fonts.heavy,
    fontSize: 26,
    color: colors.ink,
  },
  center: {
    textAlign: 'center',
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  segment: {
    width: 170,
  },
  section: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.ink,
    marginTop: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  flex: {
    flex: 1,
  },
  row: {
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
});
