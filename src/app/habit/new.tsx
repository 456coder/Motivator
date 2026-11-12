import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';


/** Create a habit. (Placeholder until phase 2.) */
export default function NewHabitScreen() {
  return (
    <Screen bottomInset>
      <ScreenHeader title="New habit" />
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
