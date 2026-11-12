import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { colors, layout, radius, type } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'disabled';
  /** Background colour of a primary button (default brand purple). */
  color?: string;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
};

/** Rounded button. Shrinks slightly when pressed, with a haptic tap. */
export function Button({ label, onPress, variant = 'primary', color = colors.brand, icon, style }: Props) {
  const disabled = variant === 'disabled';
  const bg = variant === 'primary' ? color : variant === 'secondary' ? colors.card : colors.disabledBg;
  const fg = variant === 'primary' ? colors.white : variant === 'secondary' ? colors.ink : colors.disabledText;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={tapHaptic}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, height: variant === 'primary' ? layout.primaryButtonHeight : layout.secondaryButtonHeight },
        variant === 'secondary' && styles.secondary,
        pressed && styles.pressed,
        style,
      ]}>
      <View style={styles.middle}>
        {icon ? <Icon name={icon} size={20} color={fg} /> : null}
        <Text style={[type.button, { color: fg }]}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.button,
    paddingHorizontal: 20,
  },
  secondary: {
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  middle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
