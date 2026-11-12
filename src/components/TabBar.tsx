import type { TabListProps, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { border, colors, fonts, layout } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

/**
 * Cream bottom bar holding the tab buttons.
 * Used with Expo Router's headless tabs: `<TabList asChild><TabBar>…</TabBar></TabList>`.
 */
export function TabBar({ style, ...props }: TabListProps) {
  const insets = useSafeAreaInsets();
  return <View {...props} style={[styles.bar, { paddingBottom: 10 + insets.bottom }, style]} />;
}

type TabBarButtonProps = TabTriggerSlotProps & {
  icon: IconName;
  label: string;
  /** Colour of the tab when it's active. */
  color: string;
};

/** One tab. The active tab is a bubble filled with its own colour. */
// `ref` is left out: the slot's ref type doesn't match Pressable's in React Native 0.88.
export function TabBarButton({ icon, label, color, isFocused, onPressIn, ref: _ref, ...props }: TabBarButtonProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      onPressIn={(event) => {
        tapHaptic();
        onPressIn?.(event);
      }}
      style={[styles.button, isFocused && { backgroundColor: color, borderColor: border.color }]}>
      <Icon name={icon} size={24} fill={isFocused ? colors.white : 'none'} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: layout.tabBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 14,
    backgroundColor: colors.cream,
    borderTopWidth: border.width,
    borderTopColor: border.color,
  },
  button: {
    width: 80,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    borderRadius: 20,
    borderWidth: border.thin,
    borderColor: 'transparent',
  },
  label: {
    fontFamily: fonts.displaySemi,
    fontSize: 13,
    color: colors.ink,
  },
});
