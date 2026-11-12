import { StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme';

/** Small grey label above a form control. */
export function FieldLabel({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontFamily: fonts.semi,
    fontSize: 13,
    color: colors.inkMuted,
  },
});
