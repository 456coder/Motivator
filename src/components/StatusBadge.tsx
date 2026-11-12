import { StyleSheet, Text, View } from 'react-native';

import { fonts, radius, statusColors, type TrackStatus } from '@/theme';

/** Tinted badge: Ahead / On track / Behind / Off track. */
export function StatusBadge({ status }: { status: TrackStatus }) {
  const c = statusColors[status];
  return (
    <View style={[styles.badge, { backgroundColor: c.soft }]}>
      <View style={[styles.dot, { backgroundColor: c.fill }]} />
      <Text style={[styles.text, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    height: 26,
    borderRadius: radius.pill,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  text: {
    fontFamily: fonts.bold,
    fontSize: 12,
  },
});
