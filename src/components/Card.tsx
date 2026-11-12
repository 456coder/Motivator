import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, softShadow } from '@/theme';

type Props = {
  children: ReactNode;
  /** Background colour (default white). */
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/** White rounded card with a soft shadow. */
export function Card({ children, color = colors.card, style }: Props) {
  return <View style={[styles.card, { backgroundColor: color }, color === colors.card && softShadow, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card,
    padding: 18,
    gap: 10,
  },
});
