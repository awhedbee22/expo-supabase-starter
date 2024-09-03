import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { Header } from "@/components/Header";

export default function ProtectedLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          header: () => <Header />,
          contentStyle: {
            backgroundColor:
              colorScheme === "dark"
                ? theme.dark.background
                : theme.light.background,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
						name="settings"
						options={{
							presentation: "modal",
							header: () => null,
						}}
					/>
      </Stack>
    </SafeAreaProvider>
  );
}