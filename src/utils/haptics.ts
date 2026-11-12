import * as Haptics from 'expo-haptics';

/** Light tap for button presses. Haptics do nothing on the web, so errors are ignored. */
export function tapHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** Happy buzz for finishing something (a habit, a goal, a milestone). */
export function successHaptic() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

/** Warning buzz, e.g. when a goal falls behind. */
export function warningHaptic() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
}
