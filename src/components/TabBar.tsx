import type { TabListProps, TabTriggerSlotProps } from 'expo-router/ui';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { colors, fonts, layout } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

/**
 * White bottom bar holding the tab buttons.
 * Used with Expo Router's headless tabs: `<TabList asChild><TabBar>…</TabBar></TabList>`.
 */
export function TabBar({ style, ...props }: TabListProps) {
  const insets = useSafeAreaInsets();
  return <View {...props} style={[styles.bar, { paddingBottom: 6 + insets.bottom }, style]} />;
}

type TabBarButtonProps = TabTriggerSlotProps & {
  icon: IconName;
  label: string;
  /** Accent colour of the tab when active. */
  color: string;
  /** Soft tint behind the active icon. */
  soft: string;
};

/** One tab. The active tab's icon sits in a soft tinted pill in its own colour. */
// `ref` is left out: the slot's ref type doesn't match Pressable's in React Native 0.88.
export function TabBarButton({ icon, label, color, soft, isFocused, onPressIn, ref: _ref, ...props }: TabBarButtonProps) {
  return (
    <Pressable
      {...props}
      accessibilityRole="tab"
      accessibilityState={{ selected: isFocused }}
      onPressIn={(event) => {
        tapHaptic();
        onPressIn?.(event);
      }}
      style={styles.button}>
      <View style={[styles.iconWrap, isFocused && { backgroundColor: soft }]}>
        <Icon name={icon} size={22} color={isFocused ? color : colors.inkFaint} />
      </View>
      <Text style={[styles.label, { color: isFocused ? colors.ink : colors.inkFaint }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: layout.tabBarHeight,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    backgroundColor: colors.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  button: {
    width: 76,
    alignItems: 'center',
    gap: 2,
  },
  iconWrap: {
    width: 52,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.semi,
    fontSize: 11,
  },
});
