import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { HabitTile } from '@/components/HabitTile';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { Shelf } from '@/components/Shelf';
import { useToday } from '@/hooks/useToday';
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

  const todo = due.filter((h) => !isDone(h, logs, today));
  const finished = due.filter((h) => isDone(h, logs, today));

  return (
    <Screen
      header={
        <HeaderBlock
          title={greeting()}
          subtitle={date}
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

      <Card>
        <Text style={type.cardTitle}>Goals and your time plan</Text>
        <Text style={type.caption}>Coming next: goals in phase 3, and time planned around your calendar in phase 7.</Text>
      </Card>
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
});
