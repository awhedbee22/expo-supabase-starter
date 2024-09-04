import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ActivityIndicator, View } from "react-native";
import * as z from "zod";

import { SafeAreaView } from "@/components/safe-area-view";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormInput } from "@/components/ui/form";
import { Text } from "@/components/ui/text";
import { H1, Muted } from "@/components/ui/typography";
import { useSupabase } from "@/context/supabase-provider";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Please enter at least 8 characters.")
    .max(64, "Please enter fewer than 64 characters."),
});

export default function SignIn() {
  const { signInWithPassword } = useSupabase();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signInWithPassword(data.email, data.password);
      form.reset();
    } catch (error: Error | any) {
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-twine-100 p-6">
      <View className="flex-1">
        <H1 className="text-3xl font-bold text-twine-900 mb-2">Sign In</H1>
        <Muted className="text-twine-700 mb-8">
          Welcome back to Toke Diary
        </Muted>
        <Form {...form}>
          <View className="gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormInput
                  label="Email"
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  keyboardType="email-address"
                  className="bg-white border-twine-300"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormInput
                  label="Password"
                  placeholder="Enter your password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  className="bg-white border-twine-300"
                  {...field}
                />
              )}
            />
          </View>
        </Form>
      </View>
      <View className="gap-y-4">
        <Button
          size="lg"
          className="bg-twine-600"
          onPress={form.handleSubmit(onSubmit)}
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white font-semibold">Sign In</Text>
          )}
        </Button>
        <Muted
          className="text-center text-twine-700"
          onPress={() => {
            router.replace("/sign-up");
          }}
        >
          Don't have an account?{" "}
          <Text className="text-twine-900 font-semibold">Sign up</Text>
        </Muted>
      </View>
    </SafeAreaView>
  );
}