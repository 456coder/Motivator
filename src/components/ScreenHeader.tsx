import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconButton } from '@/components/IconButton';
import { colors, fonts, type } from '@/theme';

type Props = {
  title: string;
  /** Small coloured line above the title (e.g. the date). */
  eyebrow?: string;
  eyebrowColor?: string;
  /** Show a back button (default true). */
  back?: boolean;
  /** Optional content on the right, e.g. an IconButton. */
  right?: ReactNode;
};

/** Top of a screen: optional back button, title, optional right button. */
export function ScreenHeader({ title, eyebrow, eyebrowColor = colors.inkMuted, back = true, right }: Props) {
  return (
    <View style={styles.wrap}>
      {back ? <IconButton icon="back" label="Back" onPress={() => router.back()} /> : null}
      <View style={styles.row}>
        <View style={styles.titles}>
          {eyebrow ? <Text style={[styles.eyebrow, { color: eyebrowColor }]}>{eyebrow}</Text> : null}
          <Text style={type.screenTitle} numberOfLines={2}>
            {title}
          </Text>
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 14,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  titles: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: fonts.bold,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
});
