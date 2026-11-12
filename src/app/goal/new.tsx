import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';


/** Create a goal. (Placeholder until phase 3.) */
export default function NewGoalScreen() {
  return (
    <Screen bottomInset>
      <ScreenHeader title="New goal" />
      <ComingSoon
        icon="goals"
        area="goals"
        title="Set a goal"
        phase={3}
        lines={['Name, target and unit', 'Start date and deadline', 'Milestones (optional)']}
      />
    </Screen>
  );
}
