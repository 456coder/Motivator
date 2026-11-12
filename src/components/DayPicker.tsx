import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WEEK } from '@/logic/dates';
import { colors, fonts } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  days: number[];
  onChange: (days: number[]) => void;
  color: string;
};

/** Seven round day buttons (Monday first), plus quick choices. */
export function DayPicker({ days, onChange, color }: Props) {
  const set = new Set(days);
  const toggle = (day: number) => {
    const next = set.has(day) ? days.filter((d) => d !== day) : [...days, day];
    onChange(next.sort());
  };
  const quick = [
    { label: 'Every day', days: [0, 1, 2, 3, 4, 5, 6] },
    { label: 'Weekdays', days: [1, 2, 3, 4, 5] },
    { label: 'Weekends', days: [0, 6] },
  ];

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {WEEK.map((w) => {
          const on = set.has(w.day);
          return (
            <Pressable
              key={w.day}
              accessibilityRole="checkbox"
              accessibilityLabel={w.name}
              accessibilityState={{ checked: on }}
              onPressIn={tapHaptic}
              onPress={() => toggle(w.day)}
              style={[styles.day, on ? { backgroundColor: color, borderColor: color } : null]}>
              <Text style={[styles.dayText, on && styles.dayTextOn]}>{w.short}</Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.quickRow}>
        {quick.map((q) => (
          <Pressable key={q.label} accessibilityRole="button" onPressIn={tapHaptic} onPress={() => onChange(q.days)} hitSlop={6}>
            <Text style={[styles.quick, { color }]}>{q.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  dayText: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: colors.inkMuted,
  },
  dayTextOn: {
    color: colors.white,
  },
  quickRow: {
    flexDirection: 'row',
    gap: 18,
  },
  quick: {
    fontFamily: fonts.bold,
    fontSize: 13,
  },
});
