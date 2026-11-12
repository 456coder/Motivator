import { Pressable, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { colors, pickColors } from '@/theme';
import { tapHaptic } from '@/utils/haptics';

type Props = {
  value: string;
  onChange: (color: string) => void;
};

/** Row of colour dots; the chosen one has a tick. */
export function ColorPicker({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {pickColors.map((c, i) => (
        <Pressable
          key={c}
          accessibilityRole="radio"
          accessibilityLabel={`Colour ${i + 1}`}
          accessibilityState={{ selected: c === value }}
          onPressIn={tapHaptic}
          onPress={() => onChange(c)}
          style={[styles.dot, { backgroundColor: c }]}>
          {c === value ? <Icon name="check" size={20} color={colors.white} /> : null}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
