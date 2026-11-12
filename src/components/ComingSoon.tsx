import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { Icon, type IconName } from '@/components/Icon';
import { areas, colors, radius, type, type Area } from '@/theme';

type Props = {
  icon: IconName;
  area: Area;
  title: string;
  /** What this screen will do, one line each. */
  lines: string[];
  phase: number;
};

/** Placeholder card for screens that are built in a later phase. */
export function ComingSoon({ icon, area, title, lines, phase }: Props) {
  const c = areas[area];
  return (
    <Card>
      <View style={styles.top}>
        <View style={[styles.iconTile, { backgroundColor: c.soft }]}>
          <Icon name={icon} size={22} color={c.fill} />
        </View>
        <View style={styles.titles}>
          <Text style={type.cardTitle}>{title}</Text>
          <Text style={type.caption}>Coming in phase {phase}</Text>
        </View>
      </View>
      <View style={styles.lines}>
        {lines.map((line) => (
          <View key={line} style={styles.line}>
            <View style={[styles.dot, { backgroundColor: c.fill }]} />
            <Text style={[type.body, styles.lineText]}>{line}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: radius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: {
    flex: 1,
  },
  lines: {
    gap: 8,
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
    marginTop: 4,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  lineText: {
    flex: 1,
  },
});
