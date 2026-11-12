import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Icon, type IconName } from '@/components/Icon';
import { radius, type } from '@/theme';

type Props = {
  icon: IconName;
  color: string;
  soft: string;
  title: string;
  body: string;
  action?: { label: string; onPress: () => void };
};

/** Friendly card for when there's nothing to show yet. */
export function EmptyState({ icon, color, soft, title, body, action }: Props) {
  return (
    <Card style={styles.card}>
      <View style={[styles.icon, { backgroundColor: soft }]}>
        <Icon name={icon} size={26} color={color} />
      </View>
      <Text style={[type.cardTitle, styles.center]}>{title}</Text>
      <Text style={[type.caption, styles.center]}>{body}</Text>
      {action ? <Button label={action.label} icon="plus" color={color} onPress={action.onPress} style={styles.button} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  icon: {
    width: 56,
    height: 56,
    borderRadius: radius.tile,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  center: {
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
});
