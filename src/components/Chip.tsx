import { Pressable, StyleSheet, Text, View } from 'react-native';

import { border, colors, fonts, radius } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  label: string;
  selected?: boolean;
  /** Colour when selected, and of the dot. */
  color?: string;
  onPress?: () => void;
};

/** Small choice button with a coloured dot. Selected = filled with its colour. */
export function Chip({ label, selected = false, color = colors.pink, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPressIn={tapHaptic}
      onPress={onPress}
      style={[styles.chip, { backgroundColor: selected ? color : colors.cream }]}>
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
    paddingHorizontal: 14,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: border.thin,
    borderColor: border.color,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: border.color,
  },
  label: {
    fontFamily: fonts.displaySemi,
    fontSize: 16,
    color: colors.ink,
    marginTop: 2,
  },
});
