import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ColorPicker } from '@/components/ColorPicker';
import { DayPicker } from '@/components/DayPicker';
import { FieldLabel } from '@/components/FieldLabel';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Screen } from '@/components/Screen';
import { Segmented } from '@/components/Segmented';
import { Stepper } from '@/components/Stepper';
import { TextField } from '@/components/TextField';
import { TIMES, type TimeOfDay } from '@/logic/habits';
import { useStore } from '@/store/useStore';
import { areas, type } from '@/theme';
import { successHaptic } from '@/utils/haptics';

/** Create a habit, or edit one (when opened with ?id=…). */
export default function HabitFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = useStore((s) => s.habits.find((h) => h.id === id));
  const addHabit = useStore((s) => s.addHabit);
  const updateHabit = useStore((s) => s.updateHabit);

  const [name, setName] = useState(existing?.name ?? '');
  const [color, setColor] = useState(existing?.color ?? areas.habits.fill);
  const [days, setDays] = useState<number[]>(existing?.days ?? [0, 1, 2, 3, 4, 5, 6]);
  const [kind, setKind] = useState<'tick' | 'count'>(existing && existing.target > 1 ? 'count' : 'tick');
  const [target, setTarget] = useState(existing && existing.target > 1 ? existing.target : 8);
  const [unit, setUnit] = useState(existing?.unit ?? '');
  const [time, setTime] = useState<TimeOfDay>(existing?.time ?? 'anytime');

  const trimmed = name.trim();
  const problem = !trimmed ? 'Give your habit a name' : days.length === 0 ? 'Pick at least one day' : null;

  const save = () => {
    if (problem) return;
    const habit = {
      name: trimmed,
      color,
      days,
      target: kind === 'count' ? target : 1,
      unit: kind === 'count' ? unit.trim() : '',
      time,
    };
    if (existing) updateHabit(existing.id, habit);
    else addHabit(habit);
    successHaptic();
    router.back();
  };

  return (
    <Screen
      bottomInset
      header={<HeaderBlock back title={existing ? 'Edit habit' : 'New habit'} subtitle="Small steps, every day" color={color} />}>
      <Card>
        <TextField
          label="Habit"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Drink water"
          maxLength={40}
          autoFocus={!existing}
          returnKeyType="done"
        />
        <FieldLabel>Colour</FieldLabel>
        <ColorPicker value={color} onChange={setColor} />
      </Card>

      <Card>
        <FieldLabel>Which days?</FieldLabel>
        <DayPicker days={days} onChange={setDays} color={color} />
      </Card>

      <Card>
        <FieldLabel>How do you track it?</FieldLabel>
        <Segmented
          value={kind}
          onChange={setKind}
          options={[
            { value: 'tick', label: 'Tick once' },
            { value: 'count', label: 'Count up to' },
          ]}
        />
        {kind === 'count' ? (
          <View style={styles.count}>
            <Stepper label="Target" value={target} onChange={setTarget} min={2} max={100} />
            <View style={styles.unit}>
              <TextField label="Unit" value={unit} onChangeText={setUnit} placeholder="glasses" maxLength={16} />
            </View>
          </View>
        ) : (
          <Text style={type.caption}>Tap it once on the day and it&apos;s done.</Text>
        )}
      </Card>

      <Card>
        <FieldLabel>When?</FieldLabel>
        <Segmented value={time} onChange={setTime} options={TIMES} />
      </Card>

      {problem ? <Text style={[type.caption, styles.problem]}>{problem}</Text> : null}
      <Button
        label={existing ? 'Save changes' : 'Add habit'}
        variant={problem ? 'disabled' : 'primary'}
        color={color}
        onPress={save}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  count: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 16,
  },
  unit: {
    flex: 1,
  },
  problem: {
    textAlign: 'center',
  },
});
