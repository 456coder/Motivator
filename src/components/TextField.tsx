import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fonts, radius } from '@/theme';

type Props = Omit<TextInputProps, 'style'> & {
  label: string;
};

/** Labelled text box. */
export function TextField({ label, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.inkFaint} style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    fontFamily: fonts.semi,
    fontSize: 13,
    color: colors.inkMuted,
  },
  input: {
    height: 50,
    paddingHorizontal: 14,
    borderRadius: radius.small,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.bg,
    fontFamily: fonts.semi,
    fontSize: 16,
    color: colors.ink,
  },
});
