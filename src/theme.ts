// Design tokens for Motivator's clean, colourful look.
// Every screen uses these values. Do not hard-code new colours elsewhere.

export const colors = {
  // Core
  ink: '#1C1B29', // main text
  inkMuted: '#6E6B80', // secondary text
  inkFaint: '#A3A0B4', // hints, inactive tab labels
  bg: '#F6F5FB', // screen background
  card: '#FFFFFF', // cards, tab bar
  line: '#ECEAF3', // hairlines, empty progress tracks
  white: '#FFFFFF',

  // Brand
  brand: '#7C5CFF', // primary buttons, selected states
  brandSoft: '#EEE9FF',

  // One colour per area (accent + soft tint + darker text shade)
  amber: '#FFB020',
  amberSoft: '#FFF4DC',
  amberText: '#A86A00',
  rose: '#F2557A',
  roseSoft: '#FDE7EC',
  roseText: '#B8284D',
  green: '#22C38E',
  greenSoft: '#DEF7EE',
  greenText: '#0F8A61',
  blue: '#3D8BFD',
  blueSoft: '#E2EEFF',
  blueText: '#1F5FC4',
  orange: '#FF8A3D',
  orangeSoft: '#FFEADC',
  orangeText: '#B8541A',
  red: '#EF4444',
  redSoft: '#FDE4E4',
  redText: '#B42323',

  // Disabled
  disabledBg: '#ECEAF3',
  disabledText: '#A3A0B4',
};

/** The colours each tab / area uses. */
export const areas = {
  today: { fill: colors.amber, soft: colors.amberSoft, text: colors.amberText },
  goals: { fill: colors.rose, soft: colors.roseSoft, text: colors.roseText },
  habits: { fill: colors.green, soft: colors.greenSoft, text: colors.greenText },
  calendar: { fill: colors.blue, soft: colors.blueSoft, text: colors.blueText },
  review: { fill: colors.brand, soft: colors.brandSoft, text: colors.brand },
} as const;
export type Area = keyof typeof areas;

/** On-track status colours. Always the same everywhere. */
export const statusColors = {
  ahead: { fill: colors.green, soft: colors.greenSoft, text: colors.greenText, label: 'Ahead' },
  onTrack: { fill: colors.blue, soft: colors.blueSoft, text: colors.blueText, label: 'On track' },
  behind: { fill: colors.orange, soft: colors.orangeSoft, text: colors.orangeText, label: 'Behind' },
  offTrack: { fill: colors.red, soft: colors.redSoft, text: colors.redText, label: 'Off track' },
} as const;
export type TrackStatus = keyof typeof statusColors;

/** Colours the user can pick for a goal or habit. */
export const pickColors = [
  colors.rose,
  colors.orange,
  colors.amber,
  colors.green,
  colors.blue,
  colors.brand,
];

export const fonts = {
  heavy: 'PlusJakartaSans_800ExtraBold', // screen titles, big numbers
  bold: 'PlusJakartaSans_700Bold', // card titles, buttons
  semi: 'PlusJakartaSans_600SemiBold', // labels, chips, tabs
  medium: 'PlusJakartaSans_500Medium', // body text
};

export const radius = {
  pill: 999,
  button: 16,
  card: 20,
  tile: 16,
  small: 12,
};

/** Soft, blurred shadow for cards and floating buttons. */
export const softShadow = {
  shadowColor: '#2B2160',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 14,
  elevation: 2,
};

export const layout = {
  screenPadding: 20,
  gap: 14,
  primaryButtonHeight: 56,
  secondaryButtonHeight: 50,
  tabBarHeight: 64,
};

export const type = {
  screenTitle: { fontFamily: fonts.heavy, fontSize: 32, color: colors.ink, letterSpacing: -0.6 },
  cardTitle: { fontFamily: fonts.bold, fontSize: 17, color: colors.ink, letterSpacing: -0.2 },
  body: { fontFamily: fonts.medium, fontSize: 15, color: colors.ink },
  caption: { fontFamily: fonts.medium, fontSize: 13, color: colors.inkMuted },
  label: { fontFamily: fonts.semi, fontSize: 14, color: colors.ink },
  button: { fontFamily: fonts.bold, fontSize: 16, color: colors.white },
  bigNumber: { fontFamily: fonts.heavy, fontSize: 34, color: colors.ink, letterSpacing: -0.8 },
};
