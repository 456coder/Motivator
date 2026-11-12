import { router } from 'expo-router';

import { ComingSoon } from '@/components/ComingSoon';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Screen } from '@/components/Screen';
import { Shelf } from '@/components/Shelf';
import { Tile } from '@/components/Tile';
import { areas, statusColors } from '@/theme';

/** Goals, grouped by how on track they are. Example cards until phase 3. */
export default function GoalsScreen() {
  return (
    <Screen
      header={
        <HeaderBlock
          title="Goals"
          subtitle="Where you are vs. where you should be"
          color={areas.goals.fill}
          action={{ icon: 'plus', label: 'New goal', onPress: () => router.push('/goal/new') }}
        />
      }>
      <Shelf title="Needs a push">
        <Tile
          title="Save £5,000 by March"
          tag="Behind"
          footer="£1,800 of £5,000"
          progress={0.36}
          color={statusColors.behind.fill}
          onPress={() => router.push('/goal/sample')}
        />
        <Tile title="Run a half marathon" tag="Off track" footer="6 of 21 km" progress={0.28} color={statusColors.offTrack.fill} />
      </Shelf>
      <Shelf title="Going well">
        <Tile title="Finish my Spanish course" tag="On track" footer="Unit 6 of 12" progress={0.5} color={statusColors.onTrack.fill} />
        <Tile title="Read 24 books this year" tag="Ahead" footer="21 of 24" progress={0.88} color={statusColors.ahead.fill} />
      </Shelf>
      <ComingSoon
        icon="goals"
        area="goals"
        title="Your own goals"
        phase={3}
        lines={['Goals with a target and a deadline', 'Milestones along the way', 'Ahead / On track / Behind for each one']}
      />
    </Screen>
  );
}
