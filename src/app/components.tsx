import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BubbleText } from '@/components/BubbleText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Icon, type IconName } from '@/components/Icon';
import { Pill } from '@/components/Pill';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Segmented } from '@/components/Segmented';
import { StatusBadge } from '@/components/StatusBadge';
import { Toggle } from '@/components/Toggle';
import { colors, pickColors, type } from '@/theme';

const ICONS: IconName[] = [
  'today', 'goals', 'habits', 'calendar', 'gear', 'plus', 'back',
  'check', 'flame', 'star', 'clock', 'chart', 'flag', 'bell',
];

/** A gallery of every shared component, for checking the look on a phone. */
export default function ComponentsScreen() {
  const [range, setRange] = useState<'day' | 'week' | 'month'>('week');
  const [on, setOn] = useState(true);
  const [chip, setChip] = useState('Fitness');

  return (
    <Screen bottomInset>
      <ScreenHeader title="All the pieces" color={colors.cream} />

      <Card>
        <Text style={type.cardTitle}>Bubble writing</Text>
        <BubbleText size={44} color={colors.yellow}>Motivator</BubbleText>
        <View style={styles.row}>
          <BubbleText size={30} color={colors.pink}>Goals</BubbleText>
          <BubbleText size={30} color={colors.mint}>Habits</BubbleText>
          <BubbleText size={30} color={colors.sky}>Time</BubbleText>
        </View>
      </Card>

      <Button label="Primary button" />
      <Button label="Log progress" icon="plus" color={colors.pink} />
      <Button label="Secondary button" variant="secondary" />
      <Button label="Disabled button" variant="disabled" />

      <Card>
        <Text style={type.cardTitle}>Status badges</Text>
        <View style={styles.wrap}>
          <StatusBadge status="ahead" />
          <StatusBadge status="onTrack" />
          <StatusBadge status="behind" />
          <StatusBadge status="offTrack" />
        </View>
      </Card>

      <Card>
        <Text style={type.cardTitle}>Progress bars</Text>
        <ProgressBar value={0.8} marker={0.6} color={colors.mint} />
        <ProgressBar value={0.45} marker={0.5} color={colors.sky} />
        <ProgressBar value={0.3} marker={0.55} color={colors.orange} />
        <Text style={type.caption}>The black line marks where you should be by today.</Text>
      </Card>

      <View style={styles.wrap}>
        <Pill icon="flame" iconFill={colors.orange} value="12 days" />
        <Pill icon="star" iconFill={colors.yellow} value="80%" color={colors.yellowSoft} />
        <Pill icon="clock" value="45 min" color={colors.skySoft} />
      </View>

      <Card>
        <Text style={type.cardTitle}>Choices</Text>
        <Segmented
          value={range}
          onChange={setRange}
          options={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
          ]}
        />
        <View style={styles.wrap}>
          {['Fitness', 'Money', 'Spanish', 'Reading'].map((label, i) => (
            <Chip
              key={label}
              label={label}
              color={pickColors[i]}
              selected={chip === label}
              onPress={() => setChip(label)}
            />
          ))}
        </View>
        <View style={styles.between}>
          <Text style={type.body}>Evening reminder</Text>
          <Toggle value={on} onChange={setOn} label="Evening reminder" />
        </View>
      </Card>

      <Card>
        <Text style={type.cardTitle}>Icons</Text>
        <View style={styles.wrap}>
          {ICONS.map((name, i) => (
            <Icon key={name} name={name} size={32} fill={pickColors[i % pickColors.length]} />
          ))}
        </View>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
