import "../global.css";
import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SupabaseProvider } from "@/context/supabase-provider";
import { useEffect } from "react";
import * as SplashScreen from 'expo-splash-screen';
import { View, Text } from "react-native";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

class CustomErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("Caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Something went wrong.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function RootLayout() {
  useEffect(() => {
    const initApp = async () => {
      try {
        // Perform any necessary async initialization here
        console.log("App initialization started");
        
        // Simulate some async work
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log("App initialization completed successfully");
      } catch (error) {
        console.error("Error during app initialization:", error);
      } finally {
        // Hide the splash screen
        await SplashScreen.hideAsync();
      }
    };

    initApp();
  }, []);

  return (
    <CustomErrorBoundary>
      <SupabaseProvider>
        <SafeAreaProvider>
          <View style={{ flex: 1 }}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="(protected)" />
              <Stack.Screen name="(public)" />
              <Stack.Screen
                name="add-entry"
                options={{
                  presentation: "modal",
                }}
              />
            </Stack>
          </View>
        </SafeAreaProvider>
      </SupabaseProvider>
    </CustomErrorBoundary>
  );
}