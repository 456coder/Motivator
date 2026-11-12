import { StyleSheet, Text, View } from 'react-native';

import { border, colors, fonts, radius, statusColors, type TrackStatus } from '@/theme';

/** Coloured badge: Ahead / On track / Behind / Off track. */
export function StatusBadge({ status }: { status: TrackStatus }) {
  const c = statusColors[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.fill }]}>
      <Text style={styles.text}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 3,
    paddingBottom: 1,
    borderRadius: radius.pill,
    borderWidth: border.thin,
    borderColor: border.color,
  },
  text: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.ink,
  },
});
