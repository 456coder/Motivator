import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { border, colors, fonts, layout, popShadow, radius, type } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'disabled';
  /** Background colour of a primary button (default yellow). */
  color?: string;
  icon?: IconName;
  /** Optional content on the right, e.g. a count. */
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const SHADOW = { primary: 6, secondary: 4, disabled: 0 };

/**
 * Chunky bubble button. Pressing squishes it down over its shadow, with a haptic tap.
 * primary = colourful and tall · secondary = cream · disabled = grey, can't be pressed.
 */
export function Button({ label, onPress, variant = 'primary', color, icon, right, style }: Props) {
  const shadow = SHADOW[variant];
  const disabled = variant === 'disabled';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPressIn={tapHaptic}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        variant === 'primary' && color ? { backgroundColor: color } : null,
        shadow > 0 && popShadow(shadow),
        pressed && {
          // Move down by the shadow's height so the button looks pressed in.
          transform: [{ translateY: shadow }],
          shadowOpacity: 0,
        },
        style,
      ]}>
      <View style={styles.middle}>
        {icon ? <Icon name={icon} size={variant === 'primary' ? 26 : 22} /> : null}
        <Text style={[styles.label, variant !== 'primary' && styles.smallLabel, disabled && styles.disabledLabel]}>
          {label}
        </Text>
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: border.width,
    borderColor: border.color,
    paddingHorizontal: 20,
  },
  primary: {
    height: layout.primaryButtonHeight,
    borderRadius: radius.button,
    backgroundColor: colors.yellow,
  },
  secondary: {
    height: layout.secondaryButtonHeight,
    borderRadius: 22,
    backgroundColor: colors.cream,
  },
  disabled: {
    height: layout.secondaryButtonHeight,
    borderRadius: 22,
    backgroundColor: colors.disabledBg,
  },
  middle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    ...type.button,
  },
  smallLabel: {
    fontFamily: fonts.display,
    fontSize: 19,
  },
  disabledLabel: {
    color: colors.disabledText,
  },
  right: {
    position: 'absolute',
    right: 18,
  },
});
