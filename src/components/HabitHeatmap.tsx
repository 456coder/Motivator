import { StyleSheet, Text, View } from 'react-native';

import { addDays, WEEK, type DateKey } from '@/logic/dates';
import { amountOn, isDue, type Habit, type HabitLogs } from '@/logic/habits';
import { weekStart } from '@/logic/stats';
import { colors, fonts } from '@/theme';

type Props = {
  habit: Habit;
  logs: HabitLogs;
  today: DateKey;
  /** How many weeks to show (columns). */
  weeks?: number;
};

/**
 * One column per week, one row per weekday (Monday at the top).
 * Full colour = done, faded = partly done (counted habits), pink = missed, blank = not due.
 */
export function HabitHeatmap({ habit, logs, today, weeks = 12 }: Props) {
  const firstMonday = addDays(weekStart(today), -(weeks - 1) * 7);
  const columns = Array.from({ length: weeks }, (_, w) => Array.from({ length: 7 }, (_, d) => addDays(firstMonday, w * 7 + d)));

  return (
    <View style={styles.wrap}>
      <View style={styles.dayLabels}>
        {WEEK.map((w, i) => (
          <Text key={i} style={styles.dayLabel}>
            {i % 2 === 0 ? w.short : ''}
          </Text>
        ))}
      </View>
      {columns.map((col) => (
        <View key={col[0]} style={styles.column}>
          {col.map((day) => {
            const due = isDue(habit, day) && day <= today;
            const share = due ? Math.min(1, amountOn(logs, habit.id, day) / habit.target) : 0;
            const missed = due && share === 0 && day < today;
            return (
              <View
                key={day}
                style={[
                  styles.cell,
                  !due && styles.off,
                  missed && styles.missed,
                  share > 0 && { backgroundColor: habit.color, opacity: 0.35 + share * 0.65 },
                  day === today && styles.today,
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 3,
  },
  dayLabels: {
    gap: 3,
    marginRight: 2,
  },
  dayLabel: {
    height: 16,
    lineHeight: 16,
    fontFamily: fonts.semi,
    fontSize: 9,
    color: colors.inkFaint,
  },
  column: {
    flex: 1,
    gap: 3,
  },
  cell: {
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.line,
  },
  off: {
    backgroundColor: colors.bg,
  },
  missed: {
    backgroundColor: colors.redSoft,
  },
  today: {
    borderWidth: 1.5,
    borderColor: colors.ink,
  },
});
