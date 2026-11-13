import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { GoalTile } from '@/components/GoalTile';
import { HabitTile } from '@/components/HabitTile';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Shelf } from '@/components/Shelf';
import { useToday } from '@/hooks/useToday';
import { sortGoals, status } from '@/logic/goals';
import { dayScore, dayStreak, dueHabits, isDone } from '@/logic/habits';
import { useStore } from '@/store/useStore';
import { areas, colors, fonts, onColor, radius, type } from '@/theme';
import { successHaptic } from '@/utils/haptics';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Small see-through stat on the header ("0% today"). */
function HeaderStat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

/** The firm nudge: what's left, and what's at stake. */
function nudge(left: number, streak: number, hour: number) {
  const things = left === 1 ? '1 habit' : `${left} habits`;
  if (hour >= 18) {
    return streak > 0
      ? `${things} still to do tonight. Finish them or lose your ${streak} day streak.`
      : `${things} still to do tonight. Finish them and start a streak.`;
  }
  return `${things} to go today. Get them done early.`;
}

/** Today: score, streak, and today's habits to tick off. */
export default function TodayScreen() {
  const habits = useStore((s) => s.habits);
  const goals = useStore((s) => s.goals);
  const logs = useStore((s) => s.logs);
  const threshold = useStore((s) => s.settings.streakThreshold);
  const today = useToday();
  const date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  const due = dueHabits(habits, today);
  const doneCount = due.filter((h) => isDone(h, logs, today)).length;
  const score = dayScore(habits, logs, today);
  const streak = dayStreak(habits, logs, threshold, today);
  const fullDay = score !== null && score >= threshold - 1e-9;
  const hasHabits = habits.some((h) => !h.archived);

  // A happy buzz the moment the day becomes full.
  const wasFull = useRef(fullDay);
  useEffect(() => {
    if (fullDay && !wasFull.current) successHaptic();
    wasFull.current = fullDay;
  }, [fullDay]);

  // This week's focus, and bigger goals that have slipped.
  const activeGoals = goals.filter((g) => !g.archived);
  const weekFocus = activeGoals.filter((g) => g.level === 'week' && g.deadline >= today);
  const slipping = sortGoals(
    activeGoals.filter((g) => g.level !== 'week' && ['behind', 'offTrack'].includes(status(g, goals, today))),
  );

  const todo = due.filter((h) => !isDone(h, logs, today));
  const finished = due.filter((h) => isDone(h, logs, today));

  return (
    <Screen
      header={
        <HeaderBlock
          title={greeting()}
          subtitle={date}
          leftAction={{ icon: 'chart', label: 'Your progress', onPress: () => router.push('/progress') }}
          action={{ icon: 'gear', label: 'Settings', onPress: () => router.push('/settings') }}>
          <View style={styles.stats}>
            <HeaderStat value={score === null ? '–' : `${Math.round(score * 100)}%`} label="Today's score" />
            <HeaderStat value={String(streak)} label="Day streak" />
            <HeaderStat value={`${doneCount}/${due.length}`} label="Habits done" />
          </View>
        </HeaderBlock>
      }>
      {!hasHabits ? (
        <EmptyState
          icon="habits"
          color={areas.habits.fill}
          soft={areas.habits.soft}
          title="Start with one habit"
          body="Pick something small you'll do every day. Tick it off here and watch your streak grow."
          action={{ label: 'Add a habit', onPress: () => router.push('/habit/new') }}
        />
      ) : due.length === 0 ? (
        <Card>
          <Text style={type.cardTitle}>Nothing due today</Text>
          <Text style={type.caption}>A free day. Your streak is safe.</Text>
        </Card>
      ) : (
        <>
          {fullDay ? (
            <View style={[styles.banner, { backgroundColor: colors.greenSoft }]}>
              <Icon name="star" size={20} color={colors.greenText} />
              <Text style={[styles.bannerText, { color: colors.greenText }]}>
                Full day! Your streak is now {streak} {streak === 1 ? 'day' : 'days'}.
              </Text>
            </View>
          ) : (
            <View style={[styles.banner, { backgroundColor: colors.roseSoft }]}>
              <Icon name="flame" size={20} color={colors.roseText} />
              <Text style={[styles.bannerText, { color: colors.roseText }]}>
                {nudge(todo.length, streak, new Date().getHours())}
              </Text>
            </View>
          )}

          {todo.length > 0 ? (
            <Shelf title="To do" onSeeAll={() => router.push('/habits')}>
              {todo.map((h) => (
                <HabitTile key={h.id} habit={h} day={today} mode="tick" />
              ))}
            </Shelf>
          ) : null}
          {finished.length > 0 ? (
            <Shelf title="Done">
              {finished.map((h) => (
                <HabitTile key={h.id} habit={h} day={today} mode="tick" />
              ))}
            </Shelf>
          ) : null}
          <Text style={[type.caption, styles.center]}>Tap a habit to tick it off. Hold it for details.</Text>
        </>
      )}

      {weekFocus.length > 0 ? (
        <Shelf title="This week's focus" onSeeAll={() => router.push('/goals')}>
          {weekFocus.map((g) => (
            <GoalTile key={g.id} goal={g} today={today} mode="tick" />
          ))}
        </Shelf>
      ) : activeGoals.length > 0 ? (
        <Card>
          <Text style={type.cardTitle}>Set this week&apos;s focus</Text>
          <Text style={type.caption}>One thing this week that moves a bigger goal forward.</Text>
          <Text
            style={styles.link}
            onPress={() => router.push({ pathname: '/goal/new', params: { level: 'week' } })}>
            + Add this week&apos;s focus
          </Text>
        </Card>
      ) : (
        <Card>
          <Text style={type.cardTitle}>Build your plan</Text>
          <Text style={type.caption}>Set 5-year, 1-year and 90-day goals, and see each day whether you&apos;re on track.</Text>
          <Text
            style={styles.link}
            onPress={() => router.push({ pathname: '/goal/new', params: { level: 'five', flow: '1' } })}>
            Start building
          </Text>
        </Card>
      )}

      {slipping.length > 0 ? (
        <Shelf title="Goals that need a push" onSeeAll={() => router.push('/goals')}>
          {slipping.map((g) => (
            <GoalTile key={g.id} goal={g} today={today} />
          ))}
        </Shelf>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: 'row',
    gap: 10,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: onColor.glass,
  },
  statValue: {
    fontFamily: fonts.heavy,
    fontSize: 22,
    color: onColor.title,
  },
  statLabel: {
    fontFamily: fonts.semi,
    fontSize: 11,
    color: onColor.body,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: radius.tile,
  },
  bannerText: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 14,
  },
  center: {
    textAlign: 'center',
  },
  link: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.link,
    marginTop: 2,
  },
});
