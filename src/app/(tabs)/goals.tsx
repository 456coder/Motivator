import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { ComingSoon } from '@/components/ComingSoon';
import { IconButton } from '@/components/IconButton';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { areas, colors, type } from '@/theme';

/** Goals list. (Placeholder until phase 3.) */
export default function GoalsScreen() {
  return (
    <Screen>
      <ScreenHeader
        title="Goals"
        back={false}
        right={
          <IconButton
            icon="plus"
            label="New goal"
            color={areas.goals.fill}
            iconColor={colors.white}
            onPress={() => router.push('/goal/new')}
          />
        }
      />

      {/* A sample goal card, to show the style. */}
      <Pressable onPress={() => router.push('/goal/sample')}>
        <Card>
          <View style={styles.between}>
            <Text style={type.cardTitle}>Save £5,000</Text>
            <StatusBadge status="behind" />
          </View>
          <ProgressBar value={0.36} marker={0.45} color={areas.goals.fill} />
          <View style={styles.between}>
            <Text style={type.caption}>£1,800 of £5,000</Text>
            <Text style={type.caption}>Sample · 112 days left</Text>
          </View>
        </Card>
      </Pressable>

      <ComingSoon
        icon="goals"
        area="goals"
        title="Your goals"
        phase={3}
        lines={['Goals with a target and a deadline', 'Milestones along the way', 'Ahead / On track / Behind for each one']}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  between: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
