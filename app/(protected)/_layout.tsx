import { Stack } from "expo-router";
import React from "react";

import { theme } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";

export default function ProtectedLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor:
            colorScheme === "dark"
              ? theme.dark.background
              : theme.light.background,
        },
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}