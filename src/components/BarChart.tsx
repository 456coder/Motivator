import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '@/theme';

type Bar = {
  /** 0 to 1, or null for "nothing due" (shown as an empty slot). */
  value: number | null;
  label: string;
  /** Draw this bar outlined (e.g. today / this week). */
  current?: boolean;
};

type Props = {
  bars: Bar[];
  color: string;
  /** Optional goal line (0 to 1), e.g. the streak threshold. */
  goalLine?: number;
  /** Draw bars below the goal line paler (default true). */
  fadeBelowGoal?: boolean;
  height?: number;
};

/** Simple vertical bars for scores from 0% to 100%. */
export function BarChart({ bars, color, goalLine, fadeBelowGoal = true, height = 120 }: Props) {
  return (
    <View>
      <View style={[styles.plot, { height }]}>
        {goalLine !== undefined ? <View style={[styles.goal, { bottom: goalLine * height }]} /> : null}
        {bars.map((b, i) => (
          <View
            key={i}
            style={styles.slot}
            accessible
            accessibilityLabel={`${b.label}: ${b.value === null ? 'nothing due' : `${Math.round(b.value * 100)}%`}`}>
            {b.value === null ? (
              <View style={styles.empty} />
            ) : (
              <View
                style={[
                  styles.bar,
                  {
                    height: Math.max(4, b.value * height),
                    backgroundColor: color,
                    // Bars below the goal line are paler.
                    opacity: !fadeBelowGoal || b.value >= (goalLine ?? 1) - 1e-9 ? 1 : 0.5,
                  },
                  b.current && styles.current,
                ]}
              />
            )}
          </View>
        ))}
      </View>
      <View style={styles.labels}>
        {bars.map((b, i) => (
          <Text key={i} style={[styles.label, b.current && styles.labelCurrent]} numberOfLines={1}>
            {b.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  plot: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.line,
  },
  goal: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1.5,
    borderTopColor: colors.inkFaint,
    borderStyle: 'dashed',
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  bar: {
    width: '100%',
    maxWidth: 28,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  current: {
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: colors.ink,
  },
  empty: {
    width: '100%',
    maxWidth: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.line,
  },
  labels: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontFamily: fonts.semi,
    fontSize: 10,
    color: colors.inkFaint,
  },
  labelCurrent: {
    color: colors.ink,
  },
});
