import { useRouter } from "expo-router";
import React from "react";
import { View, ImageBackground } from "react-native";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require('@/assets/images/cannabis-background.png')}
      className="flex-1"
    >
      <SafeAreaView className="flex flex-1 bg-twine-100/80 p-6">
        <View className="flex flex-1 items-center justify-center gap-y-6">
          <H1 className="text-center text-4xl font-bold text-twine-900">Welcome to CannaJournal</H1>
          <Muted className="text-center text-twine-700 text-lg">
            Your personal cannabis experience tracker.
          </Muted>
        </View>
        <View className="gap-y-4">
          <Button
            className="bg-twine-600"
            size="lg"
            onPress={() => {
              router.push("/sign-up");
            }}
          >
            <Text className="text-white font-semibold">Sign Up</Text>
          </Button>
          <Button
            className="bg-twine-300"
            size="lg"
            onPress={() => {
              router.push("/sign-in");
            }}
          >
            <Text className="text-twine-800 font-semibold">Sign In</Text>
          </Button>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}