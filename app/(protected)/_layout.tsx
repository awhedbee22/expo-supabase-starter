import "../global.css";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SupabaseProvider } from "@/context/supabase-provider";
import * as SplashScreen from 'expo-splash-screen';
import { View, Text } from "react-native";
import { useColorScheme } from "@/lib/useColorScheme"; // Adjust the import path as necessary

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
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    const initApp = async () => {
      try {
        console.log("App initialization started");
        
        // Set the color scheme to light
        setColorScheme("light");
        
        // Perform any other necessary async initialization here
        // For example, loading initial data, checking authentication status, etc.
        
        // Simulate some async work (remove this in production)
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
  }, [setColorScheme]);

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

// Optionally, you can add this to catch any errors in the root component
export function ErrorBoundary(props: { error: Error }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>An error occurred: {props.error.message}</Text>
    </View>
  );
}