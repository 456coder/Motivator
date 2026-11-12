import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { colors } from '@/theme';

/** Weekly review. (Placeholder until phase 8.) */
export default function ReviewScreen() {
  return (
    <Screen bottomInset>
      <ScreenHeader title="Weekly review" color={colors.purple} />
      <ComingSoon
        icon="chart"
        color={colors.purple}
        title="Look back on your week"
        phase={8}
        lines={['What you hit and what you missed', 'What changes next week', 'Your weekly score']}
      />
    </Screen>
  );
}
