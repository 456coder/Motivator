import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Icon, type IconName } from '@/components/Icon';
import { border, colors, type } from '@/theme';

type Props = {
  icon: IconName;
  color: string;
  title: string;
  /** What this screen will do, one line each. */
  lines: string[];
  phase: number;
};

/** Placeholder card for screens that are built in a later phase. */
export function ComingSoon({ icon, color, title, lines, phase }: Props) {
  return (
    <Card>
      <View style={styles.top}>
        <View style={[styles.iconBubble, { backgroundColor: color }]}>
          <Icon name={icon} size={30} fill={colors.white} />
        </View>
        <View style={styles.titles}>
          <Text style={type.cardTitle}>{title}</Text>
          <Text style={type.caption}>Coming in phase {phase}</Text>
        </View>
      </View>
      {lines.map((line) => (
        <View key={line} style={styles.line}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={[type.body, styles.lineText]}>{line}</Text>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 2,
  },
  iconBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: border.width,
    borderColor: border.color,
  },
  titles: {
    flex: 1,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 5,
    borderWidth: 2,
    borderColor: border.color,
  },
  lineText: {
    flex: 1,
  },
});
