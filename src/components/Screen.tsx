import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout } from '@/theme';

type Props = {
  children: ReactNode;
  /** A HeaderBlock (or anything) drawn full-width above the padded content. */
  header?: ReactNode;
  /** Scroll the content (default true). */
  scroll?: boolean;
  /** Add space for the safe area at the bottom (screens without the tab bar). */
  bottomInset?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

/** Light background with an optional coloured header, with safe-area padding and optional scrolling. */
export function Screen({ children, header, scroll = true, bottomInset = false, contentStyle }: Props) {
  const insets = useSafeAreaInsets();
  const padding = {
    // With a coloured header the header covers the status bar itself.
    paddingTop: header ? 20 : insets.top + 12,
    paddingBottom: (bottomInset ? insets.bottom : 0) + 24,
  };

  if (!scroll) {
    return (
      <View style={styles.root}>
        {header}
        <View style={[styles.root, styles.content, padding, contentStyle]}>{children}</View>
      </View>
    );
  }
  return (
    <ScrollView
      style={styles.root}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}>
      {header}
      <View style={[styles.content, padding, contentStyle]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    paddingHorizontal: layout.screenPadding,
    gap: layout.gap,
  },
});
