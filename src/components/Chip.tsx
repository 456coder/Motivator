import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  label: string;
  selected?: boolean;
  /** Colour of the dot and the selected outline. */
  color?: string;
  onPress?: () => void;
};

/** Small choice button with a coloured dot. */
export function Chip({ label, selected = false, color = colors.brand, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPressIn={tapHaptic}
      onPress={onPress}
      style={[styles.chip, selected && { borderColor: color, backgroundColor: colors.card }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    height: 36,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.bg,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  label: {
    fontFamily: fonts.semi,
    fontSize: 14,
    color: colors.ink,
  },
});
