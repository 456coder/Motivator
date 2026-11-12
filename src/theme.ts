// Design tokens for the "bubble pop" look.
// Every screen uses these values. Do not hard-code new colours elsewhere.

export const colors = {
  // Core
  ink: '#2A1B5C', // text, outlines, hard shadows
  inkMuted: '#5E5290', // secondary text on cream
  cream: '#FFF9F0', // cards, tab bar, secondary buttons
  white: '#FFFFFF',
  bg: '#8E6CFF', // main screen background (bright purple)
  bgSoft: '#B9A4FF', // lighter purple: back bubbles, tracks on purple
  track: '#EFE8FF', // empty progress-bar track on cream

  // Candy accents (one per area)
  yellow: '#FFD23F', // Today, primary buttons
  pink: '#FF5FA2', // Goals
  mint: '#3DDC97', // Habits
  sky: '#4CC9F0', // Calendar
  orange: '#FF9F1C',
  purple: '#B388FF',
  red: '#FF4D6D',

  // Soft tints (card backgrounds, chips)
  yellowSoft: '#FFF1BF',
  pinkSoft: '#FFD9EA',
  mintSoft: '#D2F7E6',
  skySoft: '#D4F1FC',
  orangeSoft: '#FFE6C4',
  redSoft: '#FFD6DE',

  // Disabled
  disabledBg: '#E6E3EE',
  disabledText: '#6B6680',
};

/** The colour each tab / area uses. */
export const areaColors = {
  today: colors.yellow,
  goals: colors.pink,
  habits: colors.mint,
  calendar: colors.sky,
} as const;

/** On-track status colours. Always the same everywhere. */
export const statusColors = {
  ahead: { fill: colors.mint, soft: colors.mintSoft, label: 'Ahead' },
  onTrack: { fill: colors.sky, soft: colors.skySoft, label: 'On track' },
  behind: { fill: colors.orange, soft: colors.orangeSoft, label: 'Behind' },
  offTrack: { fill: colors.red, soft: colors.redSoft, label: 'Off track' },
} as const;
export type TrackStatus = keyof typeof statusColors;

/** Colours the user can pick for a goal or habit. */
export const pickColors = [
  colors.pink,
  colors.orange,
  colors.yellow,
  colors.mint,
  colors.sky,
  colors.purple,
  colors.red,
];

export const fonts = {
  bubble: 'Baloo2_800ExtraBold', // bubble titles, big numbers
  display: 'Baloo2_700Bold', // buttons, card titles
  displaySemi: 'Baloo2_600SemiBold', // labels, pills, tab labels
  body: 'Nunito_700Bold', // body text
  bodyHeavy: 'Nunito_800ExtraBold', // captions, small emphasis
};

export const radius = {
  pill: 999,
  button: 26,
  card: 26,
  tile: 20,
  small: 14,
};

export const border = {
  width: 3,
  thin: 2.5,
  color: colors.ink,
};

/** Hard, offset bubble shadow (no blur). */
export const popShadow = (offset = 5) => ({
  shadowColor: colors.ink,
  shadowOffset: { width: 0, height: offset },
  shadowOpacity: 1,
  shadowRadius: 0,
});

export const layout = {
  screenPadding: 20,
  gap: 14,
  primaryButtonHeight: 64,
  secondaryButtonHeight: 52,
  tabBarHeight: 78,
};

export const type = {
  cardTitle: { fontFamily: fonts.display, fontSize: 21, color: colors.ink },
  body: { fontFamily: fonts.body, fontSize: 16, color: colors.ink },
  caption: { fontFamily: fonts.bodyHeavy, fontSize: 13, color: colors.inkMuted },
  button: { fontFamily: fonts.display, fontSize: 23, color: colors.ink },
  label: { fontFamily: fonts.displaySemi, fontSize: 16, color: colors.ink },
};
