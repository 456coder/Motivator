import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout } from '@/theme';

type Props = {
  children: ReactNode;
  /** Background colour (default bright purple). */
  color?: string;
  /** Colour of the soft decorative bubbles behind the content. */
  bubbleColor?: string;
  /** Scroll the content (default true). */
  scroll?: boolean;
  /** Add space for the safe area at the bottom (screens without the tab bar). */
  bottomInset?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

/** Full-screen background with floating bubbles, safe-area padding and optional scrolling. */
export function Screen({
  children,
  color = colors.bg,
  bubbleColor = colors.bgSoft,
  scroll = true,
  bottomInset = false,
  contentStyle,
}: Props) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: insets.top + 10,
    paddingBottom: (bottomInset ? insets.bottom : 0) + 24,
  };

  return (
    <View style={[styles.root, styles.clip, { backgroundColor: color }]}>
      {/* Decorative bubbles. */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.clip]}>
        <View style={[styles.bubble, { backgroundColor: bubbleColor, width: 220, height: 220, top: -70, right: -60 }]} />
        <View style={[styles.bubble, { backgroundColor: bubbleColor, width: 90, height: 90, top: 150, left: -30 }]} />
        <View style={[styles.bubble, { backgroundColor: bubbleColor, width: 140, height: 140, bottom: 60, right: -50 }]} />
        <View style={[styles.bubble, { backgroundColor: bubbleColor, width: 40, height: 40, top: 110, right: 70 }]} />
      </View>
      {scroll ? (
        <ScrollView
          style={styles.root}
          contentContainerStyle={[styles.content, padding, contentStyle]}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.root, styles.content, padding, contentStyle]}>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  clip: {
    // Keep the decorative bubbles from making the page wider than the screen.
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    gap: layout.gap,
  },
  bubble: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.55,
  },
});
