import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, layout } from '@/theme';

type Props = {
  children: ReactNode;
  /** Scroll the content (default true). */
  scroll?: boolean;
  /** Add space for the safe area at the bottom (screens without the tab bar). */
  bottomInset?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
};

/** Plain light background with safe-area padding and optional scrolling. */
export function Screen({ children, scroll = true, bottomInset = false, contentStyle }: Props) {
  const insets = useSafeAreaInsets();
  const padding = {
    paddingTop: insets.top + 12,
    paddingBottom: (bottomInset ? insets.bottom : 0) + 24,
  };

  if (!scroll) {
    return <View style={[styles.root, styles.content, padding, contentStyle]}>{children}</View>;
  }
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, padding, contentStyle]}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}>
      {children}
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
