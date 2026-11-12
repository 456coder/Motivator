import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { border, colors, fonts, popShadow, radius } from '@/theme';

type Props = {
  icon?: IconName;
  /** Fill colour of the icon. */
  iconFill?: string;
  value: string;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

/** Small rounded label with an icon, e.g. a streak "flame 12". */
export function Pill({ icon, iconFill, value, color = colors.cream, style }: Props) {
  return (
    <View style={[styles.pill, { backgroundColor: color }, popShadow(3), style]}>
      {icon ? <Icon name={icon} size={20} fill={iconFill} /> : null}
      <Text style={styles.value}>{value}</Text>
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
    height: 38,
    borderRadius: radius.pill,
    borderWidth: border.thin,
    borderColor: border.color,
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.ink,
    marginTop: 2,
  },
});
