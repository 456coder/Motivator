import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { ComingSoon } from '@/components/ComingSoon';
import { HeaderBlock } from '@/components/HeaderBlock';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { StatusBadge } from '@/components/StatusBadge';
import { areas, type } from '@/theme';

/** One goal: progress, status, milestones and history. Example until phase 3. */
export default function GoalScreen() {
  return (
    <Screen bottomInset header={<HeaderBlock back title="Save £5,000" subtitle="Example goal · 112 days left" color={areas.goals.fill} />}>
      <Card>
        <StatusBadge status="behind" />
        <Text style={type.bigNumber}>£1,800</Text>
        <Text style={type.caption}>of £5,000 · you should be at £2,250 by today</Text>
        <ProgressBar value={0.36} marker={0.45} color={areas.goals.fill} />
        <View style={styles.need}>
          <Text style={[type.label, { color: areas.goals.text }]}>You need £29 a day now (was £25)</Text>
        </View>
      </Card>
      <ComingSoon
        icon="flag"
        area="goals"
        title="Goal details"
        phase={3}
        lines={['Milestones with dates', 'Log progress with notes', 'Chart of actual vs. expected']}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  need: {
    backgroundColor: areas.goals.soft,
    borderRadius: 12,
    padding: 12,
  },
});
