import { router } from 'expo-router';

import { Button } from '@/components/Button';
import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/theme';

/** Settings. (Placeholder; filled in over later phases.) */
export default function SettingsScreen() {
  return (
    <Screen bottomInset>
      <ScreenHeader title="Settings" color={colors.cream} />
      <ComingSoon
        icon="bell"
        color={colors.orange}
        title="Reminders and more"
        phase={6}
        lines={[
          'Morning and evening reminder times',
          'Waking hours (for planning your time)',
          'Which calendars to use',
          'What counts as a full day',
        ]}
      />
      <Button label="Weekly review (preview)" variant="secondary" icon="chart" onPress={() => router.push('/review')} />
    </Screen>
  );
}
