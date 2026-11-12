import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, fonts, radius } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  /** Text after the number, e.g. "glasses". */
  suffix?: string;
  label: string;
};

/** − number + control. */
export function Stepper({ value, onChange, min = 0, max = 999, suffix, label }: Props) {
  const button = (icon: 'minus' | 'plus', next: number, disabled: boolean, name: string) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name} ${label}`}
      disabled={disabled}
      onPressIn={tapHaptic}
      onPress={() => onChange(next)}
      hitSlop={6}
      style={({ pressed }) => [styles.button, disabled && styles.disabled, pressed && styles.pressed]}>
      <Icon name={icon} size={20} color={disabled ? colors.inkFaint : colors.ink} />
    </Pressable>
  );
  return (
    <View style={styles.row}>
      {button('minus', value - 1, value <= min, 'Less')}
      <Text style={styles.value} accessibilityLabel={`${label}: ${value}${suffix ? ` ${suffix}` : ''}`}>
        {value}
        {suffix ? <Text style={styles.suffix}> {suffix}</Text> : null}
      </Text>
      {button('plus', value + 1, value >= max, 'More')}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    width: 42,
    height: 42,
    borderRadius: radius.small,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
  value: {
    minWidth: 40,
    textAlign: 'center',
    fontFamily: fonts.heavy,
    fontSize: 22,
    color: colors.ink,
  },
  suffix: {
    fontFamily: fonts.semi,
    fontSize: 15,
    color: colors.inkMuted,
  },
});
