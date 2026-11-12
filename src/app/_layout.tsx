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
import { useEffect } from 'react';

import { colors } from '@/theme';

// Keep the splash screen up until the fonts have loaded.
SplashScreen.preventAutoHideAsync();

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
  const ready = fontsLoaded || fontError !== null;

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
        <Stack.Screen name="goal/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="habit/new" options={{ presentation: 'modal' }} />
        <Stack.Screen name="review" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="components" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
