import { ComingSoon } from '@/components/ComingSoon';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';

/** Calendar and time planning. (Placeholder until phase 7.) */
export default function CalendarScreen() {
  return (
    <Screen>
      <ScreenHeader title="Calendar" back={false} />
      <ComingSoon
        icon="calendar"
        area="calendar"
        title="Your time"
        phase={7}
        lines={[
          'Reads your iPhone calendar',
          'Finds your free time each day',
          'Shares it out between your goals',
          'Month view of hit and missed days',
        ]}
      />
    </Screen>
  );
}
