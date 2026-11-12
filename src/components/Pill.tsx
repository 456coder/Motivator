import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { colors, fonts, radius } from '@/theme';

type Props = {
  icon?: IconName;
  value: string;
  /** Soft background colour. */
  color?: string;
  /** Icon and text colour. */
  textColor?: string;
  style?: StyleProp<ViewStyle>;
};

/** Small tinted label with an icon, e.g. a streak "12 days". */
export function Pill({ icon, value, color = colors.card, textColor = colors.ink, style }: Props) {
  return (
    <View style={[styles.pill, { backgroundColor: color }, style]}>
      {icon ? <Icon name={icon} size={16} color={textColor} /> : null}
      <Text style={[styles.value, { color: textColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: radius.pill,
  },
  value: {
    fontFamily: fonts.bold,
    fontSize: 13,
  },
});
