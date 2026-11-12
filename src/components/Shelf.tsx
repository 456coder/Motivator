import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, layout } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  title: string;
  /** Shows a "See all" link on the right when given. */
  onSeeAll?: () => void;
  /** Cards (usually Tiles) laid out in a row you can swipe sideways. */
  children: ReactNode;
};

/** A section: title and "See all" on one line, then a sideways-scrolling row of cards. */
export function Shelf({ title, onSeeAll, children }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Text style={styles.title}>{title}</Text>
        {onSeeAll ? (
          <Pressable accessibilityRole="link" hitSlop={10} onPressIn={tapHaptic} onPress={onSeeAll}>
            <Text style={styles.seeAll}>See all</Text>
          </Pressable>
        ) : null}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        // Let the row run to the screen edges while the first card lines up with the text.
        style={styles.row}
        contentContainerStyle={styles.rowContent}>
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: colors.ink,
    letterSpacing: -0.2,
  },
  seeAll: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: colors.link,
  },
  row: {
    marginHorizontal: -layout.screenPadding,
  },
  rowContent: {
    paddingHorizontal: layout.screenPadding,
    gap: 12,
    paddingBottom: 6,
  },
});
