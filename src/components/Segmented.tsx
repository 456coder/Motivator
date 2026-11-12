import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, softShadow } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props<T extends string> = {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
};

/** Row of joined buttons where one is picked (e.g. Day / Week / Month). */
export function Segmented<T extends string>({ options, value, onChange }: Props<T>) {
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
            style={[styles.option, selected && [styles.selected, softShadow]]}>
            <Text style={[styles.label, selected && styles.selectedLabel]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 3,
    backgroundColor: colors.line,
    borderRadius: radius.small,
  },
  option: {
    flex: 1,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  selected: {
    backgroundColor: colors.card,
  },
  label: {
    fontFamily: fonts.semi,
    fontSize: 14,
    color: colors.inkMuted,
  },
  selectedLabel: {
    color: colors.ink,
  },
});
