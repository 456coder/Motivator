import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { BubbleText } from '@/components/BubbleText';
import { IconButton } from '@/components/IconButton';
import { colors } from '@/theme';

type Props = {
  title: string;
  /** Colour of the bubble letters. */
  color?: string;
  /** Show a back button (default true). */
  back?: boolean;
  /** Optional content on the right, e.g. an IconButton. */
  right?: ReactNode;
};

/** Top of a screen: optional back button, bubble title, optional right button. */
export function ScreenHeader({ title, color = colors.yellow, back = true, right }: Props) {
  return (
    <View style={styles.row}>
      {back ? <IconButton icon="back" label="Back" onPress={() => router.back()} /> : null}
      <BubbleText size={back ? 34 : 44} color={color} style={styles.title}>
        {title}
      </BubbleText>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    flex: 1,
  },
});
