import { StyleSheet, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { onColor } from '@/theme';

type Props = {
  done: boolean;
  /** Colour of the tick (usually the card colour). */
  color: string;
  size?: number;
};

/** Round tick for the corner of a coloured card: an empty ring, or filled white with a tick. */
export function TickCircle({ done, color, size = 30 }: Props) {
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2 },
        done ? styles.done : styles.todo,
      ]}>
      {done ? <Icon name="check" size={size * 0.6} color={color} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  todo: {
    borderWidth: 2.5,
    borderColor: onColor.faint,
  },
  done: {
    backgroundColor: onColor.title,
  },
});
