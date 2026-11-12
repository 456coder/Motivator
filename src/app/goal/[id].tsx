import { Text } from 'react-native';

import { Card } from '@/components/Card';
import { ComingSoon } from '@/components/ComingSoon';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { areaColors, colors, type } from '@/theme';

/** One goal: progress, status, milestones and history. (Placeholder until phase 3.) */
export default function GoalScreen() {
  return (
    <Screen bottomInset>
      <ScreenHeader title="Save £5,000" color={areaColors.goals} />
      <Card color={colors.pinkSoft}>
        <StatusBadge status="behind" />
        <Text style={type.cardTitle}>£1,800 of £5,000</Text>
        <ProgressBar value={0.36} marker={0.45} color={colors.pink} />
        <Text style={type.caption}>Sample only. The black line shows where you should be by today.</Text>
      </Card>
      <ComingSoon
        icon="flag"
        color={areaColors.goals}
        title="Goal details"
        phase={3}
        lines={['Milestones with dates', 'Log progress with notes', 'Chart of actual vs. expected']}
      />
    </Screen>
  );
}
