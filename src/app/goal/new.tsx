import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { DateField } from '@/components/DateField';
import { FieldLabel } from '@/components/FieldLabel';
import { GoalPicker } from '@/components/GoalPicker';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Screen } from '@/components/Screen';
import { Segmented } from '@/components/Segmented';
import { TextField } from '@/components/TextField';
import { addDays, dateKey } from '@/logic/dates';
import {
  defaultDeadline,
  KIND_LABELS,
  levelBelow,
  levelInfo,
  LEVELS,
  parentLevels,
  type GoalKind,
  type Level,
} from '@/logic/goals';
import { useStore } from '@/store/useStore';
import { areas, colors, fonts, type } from '@/theme';
import { successHaptic } from '@/utils/haptics';

const LEVEL_TABS: { value: Level; label: string }[] = [
  { value: 'five', label: '5 yr' },
  { value: 'three', label: '3 yr' },
  { value: 'one', label: '1 yr' },
  { value: 'quarter', label: '90 d' },
  { value: 'week', label: 'Week' },
];

const UNIT_HINTS = ['£', 'km', 'kg', 'books', 'hours'];

/** "1,250.5" → 1250.5. NaN when it isn't a number. */
function parseNumber(text: string) {
  const cleaned = text.replace(/[£$€,\s]/g, '');
  return cleaned === '' ? NaN : Number(cleaned);
}

/**
 * Create or edit a goal.
 * Params: id (edit), level and parentId (pre-fill), flow=1 ("Build your plan": step through the levels).
 */
export default function GoalFormScreen() {
  const params = useLocalSearchParams<{ id?: string; level?: Level; parentId?: string; flow?: string }>();
  const existing = useStore((s) => s.goals.find((g) => g.id === params.id));
  const goals = useStore((s) => s.goals);
  const addGoal = useStore((s) => s.addGoal);
  const updateGoal = useStore((s) => s.updateGoal);
  const flow = params.flow === '1';
  const today = dateKey();

  const startLevel: Level = existing?.level ?? params.level ?? 'one';
  const [level, setLevelState] = useState<Level>(startLevel);
  const [title, setTitle] = useState(existing?.title ?? '');
  const [parentId, setParentId] = useState<string | null>(existing?.parentId ?? params.parentId ?? null);
  const [kind, setKind] = useState<GoalKind>(existing?.kind ?? levelInfo(startLevel).kinds[0]);
  const [unit, setUnit] = useState(existing?.unit ?? '');
  const [start, setStart] = useState(existing ? String(existing.startValue) : '0');
  const [target, setTarget] = useState(existing && existing.kind === 'number' ? String(existing.targetValue) : '');
  const [deadline, setDeadline] = useState(existing?.deadline ?? defaultDeadline(startLevel, today));
  const [deadlineTouched, setDeadlineTouched] = useState(!!existing);

  const info = levelInfo(level);
  const setLevel = (l: Level) => {
    setLevelState(l);
    // Keep choices sensible for the new level.
    if (!levelInfo(l).kinds.includes(kind)) setKind(levelInfo(l).kinds[0]);
    if (!deadlineTouched) setDeadline(defaultDeadline(l, today));
    const parent = goals.find((g) => g.id === parentId);
    if (parent && !parentLevels(l).includes(parent.level)) setParentId(null);
  };

  // Goals this one could support: active ones on a higher level (never itself or its own steps).
  const parents = goals.filter(
    (g) => !g.archived && g.id !== existing?.id && g.parentId !== existing?.id && parentLevels(level).includes(g.level),
  );

  const startNum = parseNumber(start);
  const targetNum = parseNumber(target);
  const problem = !title.trim()
    ? 'Give your goal a name'
    : kind === 'number' && Number.isNaN(targetNum)
      ? 'Enter a target number'
      : kind === 'number' && Number.isNaN(startNum)
        ? 'Enter where you are starting from'
        : kind === 'number' && targetNum === startNum
          ? 'The target should be different from the start'
          : deadline <= today && !existing
            ? 'Pick a deadline after today'
            : null;

  /** In "Build your plan": the next step, linked to `newParent`. */
  const nextStep = (newParent: string | null) => {
    const below = levelBelow(level);
    if (below) {
      router.replace({ pathname: '/goal/new', params: { level: below, flow: '1', ...(newParent ? { parentId: newParent } : {}) } });
    } else {
      // The habit supports the goal above this week's focus (the focus itself only lasts a week).
      const habitGoal = parentId ?? newParent;
      router.replace({ pathname: '/habit/new', params: { flow: '1', ...(habitGoal ? { goalId: habitGoal } : {}) } });
    }
  };

  const save = () => {
    if (problem) return;
    const goal = {
      title: title.trim(),
      level,
      parentId,
      kind,
      unit: kind === 'number' ? unit.trim() : '',
      startValue: kind === 'number' ? startNum : 0,
      targetValue: kind === 'number' ? targetNum : 1,
      startDate: existing?.startDate ?? today,
      deadline,
    };
    successHaptic();
    if (existing) {
      updateGoal(existing.id, goal);
      router.back();
      return;
    }
    const id = addGoal(goal);
    if (flow) nextStep(id);
    else router.back();
  };

  const stepNumber = LEVELS.findIndex((l) => l.id === level) + 1;

  return (
    <Screen
      bottomInset
      header={
        <HeaderBlock
          back
          title={existing ? 'Edit goal' : flow ? info.label : 'New goal'}
          subtitle={flow ? `Build your plan · step ${stepNumber} of 6` : info.example}
          color={areas.goals.fill}
        />
      }>
      {flow ? (
        <Text style={[type.body, styles.intro]}>
          {level === 'five'
            ? 'Start big. Where do you want to be in 5 years? You can skip any step.'
            : level === 'week'
              ? 'What one thing will you get done this week to move it forward?'
              : `Now break it down. What does that need in the next ${{ three: '3 years', one: 'year', quarter: '90 days' }[level as 'three' | 'one' | 'quarter']}?`}
        </Text>
      ) : null}

      <Card>
        {!flow && !existing ? (
          <>
            <FieldLabel>How far ahead?</FieldLabel>
            <Segmented value={level} onChange={setLevel} options={LEVEL_TABS} />
          </>
        ) : null}
        <TextField
          label="Goal"
          value={title}
          onChangeText={setTitle}
          placeholder={info.example}
          maxLength={60}
          autoFocus={!existing}
        />
      </Card>

      {parents.length > 0 ? (
        <Card>
          <FieldLabel>Supports</FieldLabel>
          <GoalPicker goals={parents} value={parentId} onChange={setParentId} color={areas.goals.fill} />
        </Card>
      ) : null}

      <Card>
        <FieldLabel>How will you measure it?</FieldLabel>
        <Segmented value={kind} onChange={setKind} options={info.kinds.map((k) => ({ value: k, label: KIND_LABELS[k] }))} />
        {kind === 'number' ? (
          <>
            <View style={styles.numbers}>
              <View style={styles.flex}>
                <TextField label="Starting from" value={start} onChangeText={setStart} keyboardType="decimal-pad" />
              </View>
              <View style={styles.flex}>
                <TextField label="Target" value={target} onChangeText={setTarget} keyboardType="decimal-pad" placeholder="10000" />
              </View>
            </View>
            <TextField label="Unit (optional)" value={unit} onChangeText={setUnit} placeholder="£, km, books…" maxLength={12} />
            <View style={styles.hints}>
              {UNIT_HINTS.map((u) => (
                <Text key={u} style={styles.hint} onPress={() => setUnit(u)}>
                  {u}
                </Text>
              ))}
            </View>
          </>
        ) : kind === 'children' ? (
          <Text style={type.caption}>Its progress is the average of the goals you put under it.</Text>
        ) : (
          <Text style={type.caption}>Tick it off when it&apos;s done.</Text>
        )}
      </Card>

      <Card>
        <DateField
          label="Deadline"
          value={deadline}
          min={addDays(today, 1)}
          onChange={(d) => {
            setDeadline(d);
            setDeadlineTouched(true);
          }}
        />
      </Card>

      {problem ? <Text style={[type.caption, styles.center]}>{problem}</Text> : null}
      <Button
        label={existing ? 'Save changes' : flow ? 'Save and next' : 'Add goal'}
        variant={problem ? 'disabled' : 'primary'}
        color={areas.goals.fill}
        onPress={save}
      />
      {flow ? <Button label="Skip this step" variant="secondary" onPress={() => nextStep(parentId)} /> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: {
    color: colors.inkMuted,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  numbers: {
    flexDirection: 'row',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  hints: {
    flexDirection: 'row',
    gap: 16,
  },
  hint: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.link,
  },
  center: {
    textAlign: 'center',
  },
});
