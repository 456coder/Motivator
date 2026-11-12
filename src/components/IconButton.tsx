import { Pressable, StyleSheet } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { colors, softShadow } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  icon: IconName;
  onPress?: () => void;
  label: string;
  /** Background colour (default white). */
  color?: string;
  iconColor?: string;
  size?: number;
};

/** Round button with just an icon (back, settings, add). */
export function IconButton({ icon, onPress, label, color = colors.card, iconColor = colors.ink, size = 42 }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPressIn={tapHaptic}
      onPress={onPress}
      hitSlop={6}
      style={({ pressed }) => [
        styles.button,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        softShadow,
        pressed && { transform: [{ scale: 0.94 }] },
      ]}>
      <Icon name={icon} size={size * 0.48} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
