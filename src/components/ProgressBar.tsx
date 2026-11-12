import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius } from '@/theme';

type Props = {
  /** 0 to 1. */
  value: number;
  color?: string;
  /** Optional marker (0 to 1) showing where you should be by now. */
  marker?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

/** Slim rounded progress bar with an optional "where you should be" marker. */
export function ProgressBar({ value, color = colors.brand, marker, height = 10, style }: Props) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={[styles.wrap, { height: height + 8 }, style]}>
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        {pct > 0 ? <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color }]} /> : null}
      </View>
      {marker !== undefined ? (
        <View style={[styles.marker, { left: `${Math.max(0, Math.min(1, marker)) * 100}%` }]} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    backgroundColor: colors.line,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
  },
  marker: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    marginLeft: -1.5,
    borderRadius: 2,
    backgroundColor: colors.ink,
  },
});
