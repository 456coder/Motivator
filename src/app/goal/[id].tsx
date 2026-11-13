import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { GoalChart } from '@/components/GoalChart';
import { GoalTile } from '@/components/GoalTile';
import { HeaderBlock } from '@/components/HeaderBlock';
import { Icon } from '@/components/Icon';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Segmented } from '@/components/Segmented';
import { Shelf } from '@/components/Shelf';
import { StatusBadge } from '@/components/StatusBadge';
import { TextField } from '@/components/TextField';
import { useToday } from '@/hooks/useToday';
import {
  childrenOf,
  describeChange,
  describeGoal,
  expectedValue,
  formatDate,
  formatValue,
  levelBelow,
  levelInfo,
  pace,
  progress,
  sortGoals,
  status,
  timeElapsed,
  timeLeft,
} from '@/logic/goals';
import { useStore } from '@/store/useStore';
import { colors, fonts, goalLooks, type } from '@/theme';
import { confirm } from '@/utils/confirm';
import { successHaptic } from '@/utils/haptics';

/** One goal: where it is vs. where it should be, logging progress, its steps, habits and history. */
export default function GoalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const goal = useStore((s) => s.goals.find((g) => g.id === id));
  const goals = useStore((s) => s.goals);
  const goalLogs = useStore((s) => s.goalLogs);
  const allChanges = useStore((s) => s.goalChanges);
  const habits = useStore((s) => s.habits);
  const logProgress = useStore((s) => s.logProgress);
  const deleteGoalLog = useStore((s) => s.deleteGoalLog);
  const setGoalDone = useStore((s) => s.setGoalDone);
  const setGoalArchived = useStore((s) => s.setGoalArchived);
  const deleteGoal = useStore((s) => s.deleteGoal);
  const today = useToday();

  const [mode, setMode] = useState<'add' | 'total'>('add');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [stopping, setStopping] = useState(false);
  const [stopReason, setStopReason] = useState('');

  if (!goal) return <Redirect href="/goals" />;

  const st = status(goal, goals, today);
  const look = goalLooks[st];
  const p = progress(goal, goals);
  const elapsed = timeElapsed(goal, today);
  const paceInfo = pace(goal, today);
  const parent = goals.find((g) => g.id === goal.parentId);
  const steps = sortGoals(childrenOf(goal, goals));
  const below = levelBelow(goal.level);
  const linkedHabits = habits.filter((h) => h.goalId === goal.id && !h.archived);
  // Progress entries and changes together, newest first.
  const changes = allChanges.filter((c) => c.goalId === goal.id);
  const madeEasier = changes.filter((c) => c.easier && c.field !== 'archived').length;
  const history = [
    ...goalLogs.filter((l) => l.goalId === goal.id).map((l) => ({ kind: 'log' as const, date: l.date, log: l })),
    ...changes.map((c) => ({ kind: 'change' as const, date: c.date, change: c })),
  ]
    .map((item, i) => ({ ...item, order: i }))
    .sort((a, b) => b.date.localeCompare(a.date) || b.order - a.order);

  const typed = Number(amount.replace(/[£$€,\s]/g, ''));
  const canLog = amount.trim() !== '' && !Number.isNaN(typed);
  const submit = () => {
    if (!canLog) return;
    const value = mode === 'add' ? goal.currentValue + (goal.targetValue >= goal.startValue ? typed : -typed) : typed;
    logProgress(goal.id, value, note);
    successHaptic();
    setAmount('');
    setNote('');
  };

  return (
    <Screen
      bottomInset
      header={
        <HeaderBlock
          back
          title={goal.title}
          subtitle={`${levelInfo(goal.level).label} · ${formatDate(goal.deadline)}${goal.archived ? ' · Archived' : ''}`}
          color={look.fill}
          action={{
            icon: 'edit',
            label: 'Edit goal',
            onPress: () => router.push({ pathname: '/goal/new', params: { id: goal.id } }),
          }}
        />
      }>
      {/* Where you are vs. where you should be. */}
      <Card>
        <View style={styles.between}>
          <StatusBadge status={st} />
          <Text style={type.caption}>{timeLeft(goal, today)}</Text>
        </View>
        {goal.kind === 'number' ? (
          <>
            <Text style={type.bigNumber}>{formatValue(goal.currentValue, goal.unit)}</Text>
            <Text style={type.caption}>
              of {formatValue(goal.targetValue, goal.unit)}
              {st === 'done' ? '' : ` · should be ${formatValue(expectedValue(goal, today), goal.unit)} by today`}
            </Text>
          </>
        ) : goal.kind === 'children' ? (
          <>
            <Text style={type.bigNumber}>{p === null ? '–' : `${Math.round(p * 100)}%`}</Text>
            <Text style={type.caption}>
              {describeGoal(goal, goals)} · {Math.round(elapsed * 100)}% of the time used
            </Text>
          </>
        ) : (
          <Text style={type.bigNumber}>{st === 'done' ? 'Done' : 'Not done yet'}</Text>
        )}
        {goal.kind !== 'done' ? (
          <ProgressBar value={p ?? 0} marker={st === 'done' ? undefined : elapsed} color={look.fill} />
        ) : null}
        {paceInfo && st !== 'done' ? (
          <View style={[styles.pace, { backgroundColor: look.soft }]}>
            <Text style={[type.label, { color: look.text }]}>
              You need {paceInfo.need} a {paceInfo.per} now (planned {paceInfo.planned})
            </Text>
          </View>
        ) : null}
        {goal.kind !== 'number' ? (
          <Text style={type.caption}>The black line on the bar shows where you should be by today.</Text>
        ) : null}
        {madeEasier > 0 ? (
          <View style={styles.warning}>
            <Icon name="flag" size={16} color={colors.orangeText} />
            <Text style={[type.label, { color: colors.orangeText }]}>
              Made easier {madeEasier === 1 ? 'once' : `${madeEasier} times`}. See History.
            </Text>
          </View>
        ) : null}
      </Card>

      {/* Progress over time (number goals). */}
      {goal.kind === 'number' ? (
        <Card>
          <Text style={type.cardTitle}>Over time</Text>
          <GoalChart goal={goal} goalLogs={goalLogs} today={today} color={look.fill} />
        </Card>
      ) : null}

      {/* Logging progress / ticking off. */}
      {goal.kind === 'number' && !goal.archived ? (
        <Card>
          <Text style={type.cardTitle}>Log progress</Text>
          <Segmented
            value={mode}
            onChange={setMode}
            options={[
              { value: 'add', label: goal.targetValue >= goal.startValue ? 'Add to it' : 'Take off' },
              { value: 'total', label: 'New total' },
            ]}
          />
          <TextField
            label={mode === 'add' ? `How much${goal.unit ? ` (${goal.unit})` : ''}?` : `Where are you now${goal.unit ? ` (${goal.unit})` : ''}?`}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            placeholder={mode === 'add' ? '50' : String(goal.currentValue)}
          />
          <TextField label="Note (optional)" value={note} onChangeText={setNote} placeholder="e.g. Sold old bike" maxLength={120} />
          <Button label="Log it" icon="plus" color={look.fill} variant={canLog ? 'primary' : 'disabled'} onPress={submit} />
        </Card>
      ) : goal.kind === 'done' && !goal.archived ? (
        <Button
          label={goal.doneAt ? 'Done! Tap to undo' : 'Mark as done'}
          icon="check"
          color={look.fill}
          variant={goal.doneAt ? 'secondary' : 'primary'}
          onPress={() => {
            setGoalDone(goal.id, !goal.doneAt);
            if (!goal.doneAt) successHaptic();
          }}
        />
      ) : null}

      {/* The goal it supports. */}
      {parent ? (
        <Pressable onPress={() => router.push({ pathname: '/goal/[id]', params: { id: parent.id } })}>
          <Card style={styles.linkRow}>
            <Icon name="flag" size={20} color={colors.inkMuted} />
            <View style={styles.flex}>
              <Text style={type.caption}>Supports · {levelInfo(parent.level).label}</Text>
              <Text style={type.label}>{parent.title}</Text>
            </View>
            <View style={styles.chevron}>
              <Icon name="back" size={16} color={colors.inkFaint} />
            </View>
          </Card>
        </Pressable>
      ) : null}

      {/* Steps under this goal. */}
      {below ? (
        steps.length > 0 ? (
          <Shelf title="Steps under this" onSeeAll={() => router.push('/plan')}>
            {steps.map((g) => (
              <GoalTile key={g.id} goal={g} today={today} />
            ))}
          </Shelf>
        ) : null
      ) : null}
      {below && !goal.archived ? (
        <Button
          label={`Add a ${levelInfo(below).label.toLowerCase()}`}
          icon="plus"
          variant="secondary"
          onPress={() => router.push({ pathname: '/goal/new', params: { level: below, parentId: goal.id } })}
        />
      ) : null}

      {/* Habits that support it. */}
      <Card>
        <Text style={type.cardTitle}>Habits for this goal</Text>
        {linkedHabits.length === 0 ? (
          <Text style={type.caption}>Daily habits that move this goal forward. Link one from a habit&apos;s Edit page, or add a new one.</Text>
        ) : (
          linkedHabits.map((h) => (
            <Pressable
              key={h.id}
              style={styles.habitRow}
              onPress={() => router.push({ pathname: '/habit/[id]', params: { id: h.id } })}>
              <View style={[styles.habitDot, { backgroundColor: h.color }]} />
              <Text style={[type.label, styles.flex]}>{h.name}</Text>
            </Pressable>
          ))
        )}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({ pathname: '/habit/new', params: { goalId: goal.id } })}
          hitSlop={8}>
          <Text style={styles.link}>+ New habit for this goal</Text>
        </Pressable>
      </Card>

      {/* History. */}
      {history.length > 0 ? (
        <Card>
          <Text style={type.cardTitle}>History</Text>
          {history.map((item) =>
            item.kind === 'log' ? (
              <View key={item.log.id} style={styles.logRow}>
                <View style={styles.flex}>
                  <Text style={type.label}>
                    {formatValue(item.log.value, goal.unit)} <Text style={type.caption}>· {formatDate(item.log.date)}</Text>
                  </Text>
                  {item.log.note ? <Text style={type.caption}>{item.log.note}</Text> : null}
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Remove this entry"
                  hitSlop={8}
                  onPress={() =>
                    confirm('Remove this entry?', 'Progress goes back to the entry before it.', 'Remove', () => deleteGoalLog(item.log.id))
                  }>
                  <Icon name="trash" size={18} color={colors.inkFaint} />
                </Pressable>
              </View>
            ) : (
              <View key={item.change.id} style={styles.logRow}>
                <Icon name="edit" size={18} color={item.change.easier ? colors.orangeText : colors.inkMuted} />
                <View style={styles.flex}>
                  <Text style={[type.label, item.change.easier && { color: colors.orangeText }]}>
                    {describeChange(item.change)} <Text style={type.caption}>· {formatDate(item.change.date)}</Text>
                  </Text>
                  {item.change.reason ? <Text style={type.caption}>&ldquo;{item.change.reason}&rdquo;</Text> : null}
                </View>
              </View>
            ),
          )}
        </Card>
      ) : null}

      {stopping ? (
        <Card color={colors.orangeSoft}>
          <Text style={[type.cardTitle, { color: colors.orangeText }]}>Stop working on this goal?</Text>
          <Text style={[type.caption, { color: colors.orangeText }]}>
            It isn&apos;t finished yet. Stopping is fine when a goal no longer fits your life, but say why. It stays on the record.
          </Text>
          <TextField
            label="Why are you stopping?"
            value={stopReason}
            onChangeText={setStopReason}
            placeholder="e.g. Moving abroad, so this doesn't fit any more"
            maxLength={200}
            multiline
          />
          <Button
            label="Archive goal"
            icon="archive"
            color={colors.orange}
            variant={stopReason.trim().length >= 5 ? 'primary' : 'disabled'}
            onPress={() => {
              setGoalArchived(goal.id, true, stopReason);
              router.back();
            }}
          />
          <Button label="Keep going" variant="secondary" onPress={() => setStopping(false)} />
        </Card>
      ) : (
        <Button
          label={goal.archived ? 'Bring it back' : 'Archive'}
          icon="archive"
          variant="secondary"
          onPress={() => {
            if (goal.archived) setGoalArchived(goal.id, false);
            else if (goal.doneAt) {
              setGoalArchived(goal.id, true);
              router.back();
            } else setStopping(true);
          }}
        />
      )}
      <Button
        label="Delete goal"
        icon="trash"
        variant="secondary"
        onPress={() =>
          confirm(
            'Delete this goal?',
            'Its progress history goes too. Anything under it moves up a level. Archive it instead to keep the history.',
            'Delete',
            () => {
              router.back();
              deleteGoal(goal.id);
            },
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pace: {
    borderRadius: 12,
    padding: 12,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flex: {
    flex: 1,
  },
  chevron: {
    transform: [{ rotate: '180deg' }],
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
  },
  habitDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  link: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.link,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
});
