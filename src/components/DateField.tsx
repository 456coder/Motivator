import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { FieldLabel } from '@/components/FieldLabel';
import { dateKey, fromKey, type DateKey } from '@/logic/dates';
import { formatDate } from '@/logic/goals';
import { colors, fonts, radius } from '@/theme';

type Props = {
  label: string;
  value: DateKey;
  onChange: (value: DateKey) => void;
  /** Earliest date allowed. */
  min?: DateKey;
};

/**
 * Date picker. iPhone: the compact system picker (tap to open a calendar).
 * Android: a button that opens the system dialog. Web (testing only): a text box.
 */
export function DateField({ label, value, onChange, min }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(value);

  let control;
  if (Platform.OS === 'web') {
    control = (
      <TextInput
        value={text}
        onChangeText={(t) => {
          setText(t);
          if (/^\d{4}-\d{2}-\d{2}$/.test(t)) onChange(t);
        }}
        placeholder="YYYY-MM-DD"
        style={styles.web}
      />
    );
  } else if (Platform.OS === 'ios') {
    control = (
      <DateTimePicker
        value={fromKey(value)}
        mode="date"
        display="compact"
        minimumDate={min ? fromKey(min) : undefined}
        accentColor={colors.brand}
        onChange={(_, d) => d && onChange(dateKey(d))}
      />
    );
  } else {
    control = (
      <>
        <Pressable onPress={() => setOpen(true)} style={styles.web}>
          <Text style={styles.webText}>{formatDate(value)}</Text>
        </Pressable>
        {open ? (
          <DateTimePicker
            value={fromKey(value)}
            mode="date"
            minimumDate={min ? fromKey(min) : undefined}
            onChange={(_, d) => {
              setOpen(false);
              if (d) onChange(dateKey(d));
            }}
          />
        ) : null}
      </>
    );
  }

  return (
    <View style={styles.row}>
      <FieldLabel>{label}</FieldLabel>
      {control}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  web: {
    height: 44,
    minWidth: 140,
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: radius.small,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.bg,
    fontFamily: fonts.semi,
    fontSize: 15,
    color: colors.ink,
  },
  webText: {
    fontFamily: fonts.semi,
    fontSize: 15,
    color: colors.ink,
  },
});
