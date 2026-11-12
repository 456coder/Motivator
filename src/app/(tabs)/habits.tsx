import { router } from 'expo-router';

import { ComingSoon } from '@/components/ComingSoon';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Screen } from '@/components/Screen';
import { Shelf } from '@/components/Shelf';
import { Tile } from '@/components/Tile';
import { areas } from '@/theme';

/** Habits. Example cards until phase 2. */
export default function HabitsScreen() {
  return (
    <Screen
      header={
        <HeaderBlock
          title="Habits"
          subtitle="Small things, every single day"
          color={areas.habits.fill}
          action={{ icon: 'plus', label: 'New habit', onPress: () => router.push('/habit/new') }}
        />
      }>
      <Shelf title="Morning">
        <Tile title="Drink a glass of water" tag="Example" footer="Every day" color={areas.habits.fill} />
        <Tile title="10 minute stretch" tag="Example" footer="Weekdays" color={areas.habits.fill} />
      </Shelf>
      <Shelf title="Evening">
        <Tile title="Read for 20 minutes" tag="Example" footer="Every day" color={areas.habits.fill} />
        <Tile title="Plan tomorrow" tag="Example" footer="Sun–Thu" color={areas.habits.fill} />
      </Shelf>
      <ComingSoon
        icon="habits"
        area="habits"
        title="Your own habits"
        phase={2}
        lines={['Pick the days and a target (e.g. 8 glasses)', 'Tick them off and build streaks', 'Morning and evening reminders']}
      />
    </Screen>
  );
}
