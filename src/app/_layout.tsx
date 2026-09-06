import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Observe, { ObserveRoot, useObserve } from "expo-observe";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native";

SplashScreen.preventAutoHideAsync();

Observe.configure({
  dispatchInDebug: true,
});

const queryClient = new QueryClient();

export const RootLayout = () => {
  const { markInteractive } = useObserve();
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Call this once your app has finished its initialization.
    markInteractive();
  }, [markInteractive]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default ObserveRoot.wrap(RootLayout);
