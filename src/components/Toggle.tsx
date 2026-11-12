import { Pressable, StyleSheet, View } from 'react-native';

import { border, colors } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  color?: string;
  label?: string;
};

/** Chunky on/off switch. */
export function Toggle({ value, onChange, color = colors.mint, label }: Props) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPressIn={tapHaptic}
      onPress={() => onChange(!value)}
      style={[styles.track, { backgroundColor: value ? color : colors.disabledBg }]}>
      <View style={[styles.knob, value ? styles.on : styles.off]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 62,
    height: 36,
    borderRadius: 18,
    borderWidth: border.thin,
    borderColor: border.color,
    justifyContent: 'center',
  },
  knob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    borderWidth: border.thin,
    borderColor: border.color,
  },
  off: { marginLeft: 3 },
  on: { marginLeft: 28 },
});
