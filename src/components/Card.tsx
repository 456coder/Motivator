import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { border, colors, popShadow, radius } from '@/theme';

type Props = {
  children: ReactNode;
  /** Background colour (default cream). */
  color?: string;
  /** Height of the hard shadow (0 = none). */
  shadow?: number;
  style?: StyleProp<ViewStyle>;
};

/** Rounded cream card with a thick outline and a hard drop shadow. */
export function Card({ children, color = colors.cream, shadow = 5, style }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: color }, shadow > 0 && popShadow(shadow), style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    borderWidth: border.width,
    borderColor: border.color,
    padding: 18,
    gap: 10,
  },
});
