import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

import { colors, fonts } from '@/theme';

type Props = {
  children: string;
  size?: number;
  /** Inside colour of the letters. */
  color?: string;
  /** Outline and shadow colour. */
  outline?: string;
  align?: TextStyle['textAlign'];
  style?: StyleProp<ViewStyle>;
};

// The 8 directions the outline copies are nudged in.
const DIRECTIONS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
];

/**
 * Bubble writing: chunky rounded letters with a thick outline and a drop shadow.
 * React Native can't outline text, so dark copies of the text are drawn
 * slightly shifted in every direction behind the coloured copy.
 */
export function BubbleText({
  children,
  size = 40,
  color = colors.yellow,
  outline = colors.ink,
  align = 'left',
  style,
}: Props) {
  const stroke = Math.max(2, Math.round(size / 11));
  const shadow = Math.max(3, Math.round(size / 9));
  const text: TextStyle = {
    fontFamily: fonts.bubble,
    fontSize: size,
    lineHeight: Math.round(size * 1.25),
    textAlign: align,
  };

  const copy = (dx: number, dy: number, key: string) => (
    <Text
      key={key}
      aria-hidden
      importantForAccessibility="no"
      style={[text, styles.copy, { color: outline, left: dx, right: -dx, top: dy }]}>
      {children}
    </Text>
  );

  return (
    <View style={[{ paddingHorizontal: stroke, paddingBottom: shadow }, style]}>
      <View>
        {/* Drop shadow: outline copies moved down. */}
        {DIRECTIONS.map(([x, y]) => copy(x * stroke, y * stroke + shadow, `s${x}${y}`))}
        {/* Outline. */}
        {DIRECTIONS.map(([x, y]) => copy(x * stroke, y * stroke, `o${x}${y}`))}
        {/* The coloured letters (this copy sets the size and is read by VoiceOver). */}
        <Text style={[text, { color }]}>{children}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  copy: {
    position: 'absolute',
  },
});
