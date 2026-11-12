import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { border, colors, radius } from '@/theme';

type Props = {
  /** 0 to 1. */
  value: number;
  color?: string;
  /** Optional marker (0 to 1) showing where you should be by now. */
  marker?: number;
  height?: number;
  trackColor?: string;
  style?: StyleProp<ViewStyle>;
};

/** Rounded progress bar with an optional "where you should be" marker. */
export function ProgressBar({
  value,
  color = colors.pink,
  marker,
  height = 22,
  trackColor = colors.track,
  style,
}: Props) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={[styles.track, { height, backgroundColor: trackColor }, style]}>
      {pct > 0 ? (
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} />
      ) : null}
      {marker !== undefined ? (
        <View style={[styles.marker, { left: `${Math.max(0, Math.min(1, marker)) * 100}%` }]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: radius.pill,
    borderWidth: border.thin,
    borderColor: border.color,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRightWidth: border.thin,
    borderRightColor: border.color,
    borderRadius: radius.pill,
  },
  marker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 4,
    marginLeft: -2,
    backgroundColor: colors.ink,
  },
});
