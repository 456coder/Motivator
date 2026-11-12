import { ComingSoon } from '@/components/ComingSoon';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Screen } from '@/components/Screen';
import { areas } from '@/theme';

/** Create a habit. (Placeholder until phase 2.) */
export default function NewHabitScreen() {
  return (
    <Screen bottomInset header={<HeaderBlock back title="New habit" color={areas.habits.fill} />}>
      <ComingSoon
        icon="habits"
        area="habits"
        title="Add a habit"
        phase={2}
        lines={['Name and colour', 'Which days', 'Target and reminder time']}
      />
    </Screen>
  );
}
