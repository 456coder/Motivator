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
  /** Optional content in the bottom-right corner (e.g. a tick). */
  corner?: ReactNode;
  onPress?: () => void;
  /** Press and hold (e.g. to open details). */
  onLongPress?: () => void;
  /** Fade the card a little (e.g. a habit that's done). */
  muted?: boolean;
  accessibilityLabel?: string;
};

/** Tall coloured card with white text, used in Shelf rows. */
export function Tile({ title, footer, tag, color, progress, corner, onPress, onLongPress, muted, accessibilityLabel }: Props) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel}
      disabled={!onPress && !onLongPress}
      onPressIn={onPress ? tapHaptic : undefined}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={350}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: color },
        muted && styles.muted,
        pressed && styles.pressed,
      ]}>
      <Text style={styles.title} numberOfLines={4}>
        {title}
      </Text>
      <View style={styles.bottomRow}>
        <View style={styles.bottom}>
          {progress !== undefined ? (
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.max(0, Math.min(1, progress)) * 100}%` }]} />
            </View>
          ) : null}
          {tag ? <Text style={styles.tag}>{tag}</Text> : null}
          {footer ? <Text style={styles.footer}>{footer}</Text> : null}
        </View>
        {corner ? <View style={styles.corner}>{corner}</View> : null}
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
  muted: {
    opacity: 0.72,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  corner: {
    flexShrink: 0,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 16,
    lineHeight: 21,
    color: onColor.title,
  },
  bottom: {
    flex: 1,
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
