// Design tokens for Motivator's clean, colourful look.
// Every screen uses these values. Do not hard-code new colours elsewhere.

export const colors = {
  // Core
  ink: '#1C1B29', // main text
  inkMuted: '#6E6B80', // secondary text
  inkFaint: '#A3A0B4', // hints, inactive tab labels
  bg: '#FAF8F6', // screen background (warm off-white)
  card: '#FFFFFF', // cards, tab bar
  line: '#EEEAE6', // hairlines, empty progress tracks
  white: '#FFFFFF',

  // Brand
  brand: '#8C89C9', // header blocks, primary buttons (dusty periwinkle)
  brandSoft: '#ECEBF7',
  link: '#D9596A', // "See all" links

  // One colour per area (accent + soft tint + darker text shade)
  amber: '#E9A86B', // dusty apricot
  amberSoft: '#FBEEDF',
  amberText: '#9A5E22',
  rose: '#DE8C9B', // dusty rose
  roseSoft: '#F8E6E9',
  roseText: '#A8455A',
  green: '#7DBDB3', // sage teal
  greenSoft: '#E3F2EF',
  greenText: '#2F7D71',
  blue: '#8EB1DE', // soft sky
  blueSoft: '#E6EEF9',
  blueText: '#3D6AA6',
  orange: '#EE9A5B',
  orangeSoft: '#FFEADC',
  orangeText: '#B8541A',
  red: '#DC6B6B',
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
  review: { fill: colors.brand, soft: colors.brandSoft, text: '#5D5A9E' },
} as const;
export type Area = keyof typeof areas;

/** On-track status colours. Always the same everywhere. */
export const statusColors = {
  ahead: { fill: '#5DB58A', soft: '#E1F3E9', text: '#2C7A53', label: 'Ahead' },
  onTrack: { fill: colors.blue, soft: colors.blueSoft, text: colors.blueText, label: 'On track' },
  behind: { fill: colors.orange, soft: colors.orangeSoft, text: colors.orangeText, label: 'Behind' },
  offTrack: { fill: colors.red, soft: colors.redSoft, text: colors.redText, label: 'Off track' },
} as const;
export type TrackStatus = keyof typeof statusColors;

/** Looks for every goal state: the four statuses, plus finished and nothing-to-measure-yet. */
export const goalLooks = {
  ...statusColors,
  done: { fill: '#9CC9B4', soft: '#E6F3EC', text: '#2C7A53', label: 'Done' },
  none: { fill: colors.brand, soft: colors.brandSoft, text: '#5D5A9E', label: 'No steps yet' },
} as const;

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

/** Text on top of a coloured header or tile. */
export const onColor = {
  title: '#FFFFFF',
  body: 'rgba(255,255,255,0.88)',
  faint: 'rgba(255,255,255,0.7)',
  glass: 'rgba(255,255,255,0.22)', // see-through white pills on colour
};

export const layout = {
  screenPadding: 20,
  tileWidth: 156,
  tileHeight: 176,
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
