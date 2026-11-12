import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { areaColors } from '@/theme';

/** Create a habit. (Placeholder until phase 2.) */
export default function NewHabitScreen() {
  return (
    <Screen bottomInset>
      <ScreenHeader title="New habit" color={areaColors.habits} />
      <ComingSoon
        icon="habits"
        color={areaColors.habits}
        title="Add a habit"
        phase={2}
        lines={['Name and colour', 'Which days', 'Target and reminder time']}
      />
    </Screen>
  );
}
