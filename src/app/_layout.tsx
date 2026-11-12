import {
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useSyncExternalStore } from 'react';

import { useStore } from '@/store/useStore';
import { colors } from '@/theme';

// Keep the splash screen up until the fonts and saved data have loaded.
SplashScreen.preventAutoHideAsync();

/** True once the saved data has been loaded from the phone. */
function useHydrated() {
  return useSyncExternalStore(
    (onChange) => useStore.persist.onFinishHydration(onChange),
    () => useStore.persist.hasHydrated(),
    // On the web the first draw happens on the server, where nothing is saved yet.
    () => false,
  );
}

/**
 * Root navigator: a stack of screens.
 * The tabs (Today, Goals, Habits, Calendar) sit at the bottom of the stack,
 * and every other screen slides in on top. Screens draw their own headers.
 */
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });
  const hydrated = useHydrated();
  const ready = (fontsLoaded || fontError !== null) && hydrated;

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="goal/[id]" />
        <Stack.Screen name="goal/new" />
        <Stack.Screen name="plan" />
        <Stack.Screen name="habit/new" />
        <Stack.Screen name="habit/[id]" />
        <Stack.Screen name="review" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="components" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
