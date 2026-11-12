import { Pressable, StyleSheet, View } from 'react-native';

import { colors, softShadow } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  value: boolean;
  onChange: (value: boolean) => void;
  color?: string;
  label?: string;
};

/** On/off switch. */
export function Toggle({ value, onChange, color = colors.brand, label }: Props) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      onPressIn={tapHaptic}
      onPress={() => onChange(!value)}
      style={[styles.track, { backgroundColor: value ? color : colors.line }]}>
      <View style={[styles.knob, softShadow, { marginLeft: value ? 22 : 3 }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 31,
    borderRadius: 16,
    justifyContent: 'center',
  },
  knob: {
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: colors.white,
  },
});
