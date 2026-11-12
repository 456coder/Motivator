import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ComingSoon } from '@/components/ComingSoon';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Pill } from '@/components/Pill';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { areas, colors, fonts, radius, type } from '@/theme';

/** Today: the daily plan, score and streak. (Placeholder until phase 2.) */
export default function TodayScreen() {
  const date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Screen>
      <ScreenHeader
        back={false}
        eyebrow={date}
        eyebrowColor={areas.today.text}
        title="Today"
        right={<IconButton icon="gear" label="Settings" onPress={() => router.push('/settings')} />}
      />

      {/* Score card: brand colour, the one bold block on the screen. */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreTop}>
          <View>
            <Text style={styles.scoreLabel}>Today&apos;s score</Text>
            <Text style={styles.scoreNumber}>0%</Text>
          </View>
          <View style={styles.streak}>
            <Icon name="flame" size={18} color={colors.white} />
            <Text style={styles.streakText}>0 day streak</Text>
          </View>
        </View>
        <View style={styles.scoreTrack}>
          <View style={[styles.scoreFill, { width: '0%' }]} />
        </View>
        <Text style={styles.scoreHint}>Finish every habit and task to keep your streak.</Text>
      </View>

      <View style={styles.pills}>
        <Pill icon="habits" value="0 of 0 habits" color={areas.habits.soft} textColor={areas.habits.text} />
        <Pill icon="goals" value="0 goals" color={areas.goals.soft} textColor={areas.goals.text} />
      </View>

      <Card>
        <Text style={type.cardTitle}>Up next</Text>
        <ProgressBar value={0} />
        <Text style={type.caption}>Your plan for today will show here.</Text>
      </Card>

      <ComingSoon
        icon="today"
        area="today"
        title="Your daily plan"
        phase={2}
        lines={['Habits to tick off today', 'Goal tasks fitted into your free time', 'Daily score and streak']}
      />

      <Button label="See all the pieces" variant="secondary" onPress={() => router.push('/components')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scoreCard: {
    backgroundColor: colors.brand,
    borderRadius: radius.card,
    padding: 20,
    gap: 12,
  },
  scoreTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  scoreLabel: {
    fontFamily: fonts.semi,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  scoreNumber: {
    ...type.bigNumber,
    fontSize: 44,
    color: colors.white,
  },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  streakText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.white,
  },
  scoreTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  scoreHint: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  pills: {
    flexDirection: 'row',
    gap: 8,
  },
});
