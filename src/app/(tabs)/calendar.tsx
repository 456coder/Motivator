import { ComingSoon } from '@/components/ComingSoon';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Screen } from '@/components/Screen';
import { Shelf } from '@/components/Shelf';
import { Tile } from '@/components/Tile';
import { areas, colors } from '@/theme';

/** Calendar and time planning. Example cards until phase 7. */
export default function CalendarScreen() {
  return (
    <Screen header={<HeaderBlock title="Calendar" subtitle="Time for what matters" color={areas.calendar.fill} />}>
      <Shelf title="Free time today">
        <Tile title="Spanish practice" tag="6:30 pm" footer="45 min" color={areas.calendar.fill} />
        <Tile title="Budget check" tag="8:00 pm" footer="15 min" color={areas.calendar.fill} />
      </Shelf>
      <Shelf title="Busy">
        <Tile title="Work" tag="9 am – 5 pm" footer="From your calendar" color={colors.inkFaint} />
        <Tile title="Gym class" tag="5:30 pm" footer="From your calendar" color={colors.inkFaint} />
      </Shelf>
      <ComingSoon
        icon="calendar"
        area="calendar"
        title="Your time"
        phase={7}
        lines={['Reads your iPhone calendar', 'Finds your free time each day', 'Shares it out between your goals', 'Month view of hit and missed days']}
      />
    </Screen>
  );
}
