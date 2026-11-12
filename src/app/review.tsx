import { ComingSoon } from '@/components/ComingSoon';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Screen } from '@/components/Screen';
import { areas } from '@/theme';

/** Weekly review. (Placeholder until phase 8.) */
export default function ReviewScreen() {
  return (
    <Screen bottomInset header={<HeaderBlock back title="Weekly review" color={areas.review.fill} />}>
      <ComingSoon
        icon="chart"
        area="review"
        title="Look back on your week"
        phase={8}
        lines={['What you hit and what you missed', 'What changes next week', 'Your weekly score']}
      />
    </Screen>
  );
}
