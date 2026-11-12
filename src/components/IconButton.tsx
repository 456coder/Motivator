import { Pressable, StyleSheet } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { border, colors, popShadow } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  icon: IconName;
  onPress?: () => void;
  label: string;
  color?: string;
  size?: number;
};

/** Round bubble button with just an icon (back, settings, add). */
export function IconButton({ icon, onPress, label, color = colors.cream, size = 48 }: Props) {
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
        popShadow(4),
        pressed && { transform: [{ translateY: 4 }], shadowOpacity: 0 },
      ]}>
      <Icon name={icon} size={size * 0.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: border.width,
    borderColor: border.color,
  },
});
