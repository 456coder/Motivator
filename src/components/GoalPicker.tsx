import { StyleSheet, View } from 'react-native';

import { Chip } from '@/components/Chip';
import { levelInfo, sortGoals, type Goal } from '@/logic/goals';
import { colors } from '@/theme';

type Props = {
  /** Goals to choose from. */
  goals: Goal[];
  value: string | null;
  onChange: (id: string | null) => void;
  color: string;
};

/** Chips for choosing which goal something supports, plus "None". */
export function GoalPicker({ goals, value, onChange, color }: Props) {
  return (
    <View style={styles.wrap}>
      <Chip label="None" color={colors.inkFaint} selected={value === null} onPress={() => onChange(null)} />
      {sortGoals(goals).map((g) => (
        <Chip
          key={g.id}
          label={`${g.title} · ${levelInfo(g.level).short}`}
          color={color}
          selected={value === g.id}
          onPress={() => onChange(g.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
