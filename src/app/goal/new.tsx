import { ComingSoon } from '@/components/ComingSoon';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Screen } from '@/components/Screen';
import { areas } from '@/theme';

/** Create a goal. (Placeholder until phase 3.) */
export default function NewGoalScreen() {
  return (
    <Screen bottomInset header={<HeaderBlock back title="New goal" color={areas.goals.fill} />}>
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
