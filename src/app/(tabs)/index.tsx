import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ComingSoon } from '@/components/ComingSoon';
import { IconButton } from '@/components/IconButton';
import { BubbleText } from '@/components/BubbleText';
import { Pill } from '@/components/Pill';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { areaColors, colors, fonts, type } from '@/theme';

/** Today: the daily plan, score and streak. (Placeholder until phase 2.) */
export default function TodayScreen() {
  const date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.titles}>
          <Text style={styles.date}>{date}</Text>
          <BubbleText size={48} color={areaColors.today}>
            Today
          </BubbleText>
        </View>
        <IconButton icon="gear" label="Settings" onPress={() => router.push('/settings')} />
      </View>

      <View style={styles.pills}>
        <Pill icon="flame" iconFill={colors.orange} value="0 days" />
        <Pill icon="star" iconFill={colors.yellow} value="0% today" />
      </View>

      <Card color={colors.yellowSoft}>
        <Text style={type.cardTitle}>Today&apos;s score</Text>
        <ProgressBar value={0} color={colors.yellow} />
        <Text style={type.caption}>Tick off habits and goal tasks to fill this up.</Text>
      </Card>

      <ComingSoon
        icon="today"
        color={areaColors.today}
        title="Your daily plan"
        phase={2}
        lines={[
          'Habits to tick off today',
          'Goal tasks fitted into your free time',
          'Daily score and streak',
        ]}
      />

      <Button label="See all the pieces" variant="secondary" onPress={() => router.push('/components')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titles: {
    flex: 1,
  },
  date: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.cream,
    marginLeft: 4,
  },
  pills: {
    flexDirection: 'row',
    gap: 10,
  },
});
