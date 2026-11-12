import { router } from 'expo-router';

import { Button } from '@/components/Button';
import { ComingSoon } from '@/components/ComingSoon';
import { IconButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { areaColors, colors } from '@/theme';

/** Goals list. (Placeholder until phase 3.) */
export default function GoalsScreen() {
  return (
    <Screen>
      <ScreenHeader
        title="Goals"
        color={areaColors.goals}
        back={false}
        right={<IconButton icon="plus" label="New goal" color={colors.pink} onPress={() => router.push('/goal/new')} />}
      />
      <ComingSoon
        icon="goals"
        color={areaColors.goals}
        title="Your goals"
        phase={3}
        lines={[
          'Goals with a target and a deadline',
          'Milestones along the way',
          'Ahead / On track / Behind for each one',
        ]}
      />
      <Button label="Open a sample goal" variant="secondary" onPress={() => router.push('/goal/sample')} />
    </Screen>
  );
}
