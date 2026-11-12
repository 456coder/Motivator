import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, layout, onColor, radius } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  title: string;
  /** Small text at the bottom (e.g. "6 of 8 glasses"). */
  footer?: string;
  /** A short highlighted line above the footer (e.g. "Behind"). */
  tag?: string;
  /** Background colour of the card. */
  color: string;
  /** Optional 0–1 progress shown as a thin white bar. */
  progress?: number;
  /** Optional content in the top-right corner (e.g. a tick). */
  corner?: ReactNode;
  onPress?: () => void;
};

/** Tall coloured card with white text, used in Shelf rows. */
export function Tile({ title, footer, tag, color, progress, corner, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPressIn={onPress ? tapHaptic : undefined}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, { backgroundColor: color }, pressed && styles.pressed]}>
      <View style={styles.top}>
        <Text style={styles.title} numberOfLines={4}>
          {title}
        </Text>
        {corner}
      </View>
      <View style={styles.bottom}>
        {progress !== undefined ? (
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${Math.max(0, Math.min(1, progress)) * 100}%` }]} />
          </View>
        ) : null}
        {tag ? <Text style={styles.tag}>{tag}</Text> : null}
        {footer ? <Text style={styles.footer}>{footer}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: layout.tileWidth,
    height: layout.tileHeight,
    borderRadius: radius.tile,
    padding: 14,
    justifyContent: 'space-between',
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  top: {
    flexDirection: 'row',
    gap: 6,
  },
  title: {
    flex: 1,
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 21,
    color: onColor.title,
  },
  bottom: {
    gap: 4,
  },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: onColor.glass,
    overflow: 'hidden',
    marginBottom: 4,
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  tag: {
    fontFamily: fonts.heavy,
    fontSize: 12,
    color: onColor.title,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  footer: {
    fontFamily: fonts.semi,
    fontSize: 12,
    color: onColor.body,
  },
});
