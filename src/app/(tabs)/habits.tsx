import { router } from 'expo-router';

import { ComingSoon } from '@/components/ComingSoon';
import { IconButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { areaColors, colors } from '@/theme';

/** Habits list. (Placeholder until phase 2.) */
export default function HabitsScreen() {
  return (
    <Screen>
      <ScreenHeader
        title="Habits"
        color={areaColors.habits}
        back={false}
        right={<IconButton icon="plus" label="New habit" color={colors.mint} onPress={() => router.push('/habit/new')} />}
      />
      <ComingSoon
        icon="habits"
        color={areaColors.habits}
        title="Daily habits"
        phase={2}
        lines={[
          'Pick the days and a target (e.g. 8 glasses)',
          'Tick them off and build streaks',
          'Morning and evening reminders',
        ]}
      />
    </Screen>
  );
}
