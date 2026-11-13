import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, type IconName } from '@/components/Icon';
import { colors, fonts, layout, onColor } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  title: string;
  subtitle?: string;
  /** Background colour of the block (default the brand periwinkle). */
  color?: string;
  /** Show a back button on the left. */
  back?: boolean;
  /** Optional round button on the right. */
  action?: { icon: IconName; label: string; onPress: () => void };
  /** Optional round button on the left (when there's no back button). */
  leftAction?: { icon: IconName; label: string; onPress: () => void };
  /** Extra content under the title (e.g. today's score). */
  children?: ReactNode;
};

/** Small see-through round button for use on a coloured header. */
function GlassButton({ icon, label, onPress }: { icon: IconName; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={8}
      onPressIn={tapHaptic}
      onPress={onPress}
      style={({ pressed }) => [styles.glass, pressed && { opacity: 0.7 }]}>
      <Icon name={icon} size={20} color={colors.white} />
    </Pressable>
  );
}

/**
 * Coloured block across the top of a screen, with a centred white title.
 * It reaches up behind the status bar and has rounded bottom corners.
 */
export function HeaderBlock({ title, subtitle, color = colors.brand, back = false, action, leftAction, children }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.block, { backgroundColor: color, paddingTop: insets.top + 10 }]}>
      <View style={styles.bar}>
        <View style={styles.side}>
          {back ? (
            <GlassButton icon="back" label="Back" onPress={() => router.back()} />
          ) : leftAction ? (
            <GlassButton {...leftAction} />
          ) : null}
        </View>
        <View style={styles.side}>{action ? <GlassButton {...action} /> : null}</View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children ? <View style={styles.extra}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 26,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 38,
  },
  side: {
    width: 38,
  },
  glass: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: onColor.glass,
  },
  title: {
    fontFamily: fonts.heavy,
    fontSize: 30,
    lineHeight: 36,
    letterSpacing: -0.5,
    color: onColor.title,
    textAlign: 'center',
    marginTop: 2,
  },
  subtitle: {
    fontFamily: fonts.semi,
    fontSize: 15,
    color: onColor.body,
    textAlign: 'center',
    marginTop: 4,
  },
  extra: {
    marginTop: 18,
  },
});
