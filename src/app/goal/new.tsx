import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { areaColors } from '@/theme';

/** Create a goal. (Placeholder until phase 3.) */
export default function NewGoalScreen() {
  return (
    <Screen bottomInset>
      <ScreenHeader title="New goal" color={areaColors.goals} />
      <ComingSoon
        icon="goals"
        color={areaColors.goals}
        title="Set a goal"
        phase={3}
        lines={['Name, target and unit', 'Start date and deadline', 'Milestones (optional)']}
      />
    </Screen>
  );
}
