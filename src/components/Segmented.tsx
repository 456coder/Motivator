import { Pressable, StyleSheet, Text, View } from 'react-native';

import { border, colors, fonts, radius } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  color?: string;
};

/** Row of joined buttons where one is picked (e.g. Day / Week / Month). */
export function Segmented<T extends string>({ options, value, onChange, color = colors.yellow }: Props<T>) {
  return (
    <View style={styles.row}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPressIn={tapHaptic}
            onPress={() => onChange(o.value)}
            style={[styles.option, selected && { backgroundColor: color, borderColor: border.color }]}>
            <Text style={styles.label}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 4,
    gap: 4,
    backgroundColor: colors.cream,
    borderRadius: radius.pill,
    borderWidth: border.width,
    borderColor: border.color,
  },
  option: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: border.thin,
    borderColor: 'transparent',
  },
  label: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.ink,
    marginTop: 2,
  },
});
