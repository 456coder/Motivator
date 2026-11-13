import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import type { DateKey } from '@/logic/dates';
import { formatDate, formatValue, type Goal, type GoalLog } from '@/logic/goals';
import { dayPosition, goalSeries } from '@/logic/stats';
import { colors, fonts } from '@/theme';

type Props = {
  goal: Goal;
  goalLogs: GoalLog[];
  today: DateKey;
  /** Colour of your actual progress line. */
  color: string;
  height?: number;
};

const PAD = 6;

/**
 * Line chart for a number goal, from its start date to its deadline.
 * Dashed line: where you should be. Solid line: where you've actually been.
 */
export function GoalChart({ goal, goalLogs, today, color, height = 160 }: Props) {
  const [width, setWidth] = useState(0);
  const series = goalSeries(goal, goalLogs, today);

  // The value range covers the start, the target and everything logged.
  const values = [goal.startValue, goal.targetValue, ...series.map((p) => p.value)];
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const span = hi - lo || 1;

  const x = (day: DateKey) => PAD + dayPosition(goal, day) * (width - PAD * 2);
  const y = (value: number) => PAD + (1 - (value - lo) / span) * (height - PAD * 2);
  const last = series.at(-1)!;
  const showToday = today > goal.startDate && today < goal.deadline;

  return (
    <View>
      <View style={{ height }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 ? (
          <Svg width={width} height={height}>
            {/* Start and target levels. */}
            <Line x1={PAD} x2={width - PAD} y1={y(goal.targetValue)} y2={y(goal.targetValue)} stroke={colors.line} strokeWidth={1.5} />
            <Line x1={PAD} x2={width - PAD} y1={y(goal.startValue)} y2={y(goal.startValue)} stroke={colors.line} strokeWidth={1.5} />
            {/* Today. */}
            {showToday ? (
              <Line x1={x(today)} x2={x(today)} y1={PAD} y2={height - PAD} stroke={colors.inkFaint} strokeWidth={1} strokeDasharray="3 4" />
            ) : null}
            {/* Where you should be. */}
            <Line
              x1={x(goal.startDate)}
              y1={y(goal.startValue)}
              x2={x(goal.deadline)}
              y2={y(goal.targetValue)}
              stroke={colors.inkMuted}
              strokeWidth={2}
              strokeDasharray="6 6"
            />
            {/* Where you've been. */}
            <Polyline
              points={series.map((p) => `${x(p.day)},${y(p.value)}`).join(' ')}
              fill="none"
              stroke={color}
              strokeWidth={3.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <Circle cx={x(last.day)} cy={y(last.value)} r={6} fill={color} stroke={colors.white} strokeWidth={2.5} />
          </Svg>
        ) : null}
      </View>
      <View style={styles.axis}>
        <Text style={styles.axisText}>{formatDate(goal.startDate)}</Text>
        <Text style={styles.axisText}>{formatDate(goal.deadline)}</Text>
      </View>
      <View style={styles.legend}>
        <View style={[styles.key, { backgroundColor: color }]} />
        <Text style={styles.legendText}>You ({formatValue(goal.currentValue, goal.unit)})</Text>
        <View style={styles.dashKey}>
          <View style={styles.dash} />
          <View style={styles.dash} />
        </View>
        <Text style={styles.legendText}>Where you should be</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  axis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  axisText: {
    fontFamily: fonts.semi,
    fontSize: 11,
    color: colors.inkFaint,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  key: {
    width: 14,
    height: 4,
    borderRadius: 2,
  },
  dashKey: {
    flexDirection: 'row',
    gap: 2,
    marginLeft: 8,
  },
  dash: {
    width: 5,
    height: 2,
    backgroundColor: colors.inkMuted,
  },
  legendText: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.inkMuted,
  },
});
