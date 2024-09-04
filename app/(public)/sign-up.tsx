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

const formSchema = z
  .object({
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(8, "Please enter at least 8 characters.")
      .max(64, "Please enter fewer than 64 characters.")
      .regex(
        /^(?=.*[a-z])/,
        "Your password must have at least one lowercase letter.",
      )
      .regex(
        /^(?=.*[A-Z])/,
        "Your password must have at least one uppercase letter.",
      )
      .regex(/^(?=.*[0-9])/, "Your password must have at least one number.")
      .regex(
        /^(?=.*[!@#$%^&*])/,
        "Your password must have at least one special character.",
      ),
    confirmPassword: z.string().min(8, "Please enter at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Your passwords do not match.",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const { signUp } = useSupabase();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      await signUp(data.email, data.password);
      form.reset();
    } catch (error: Error | any) {
      console.log(error.message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-twine-100 p-6">
      <View className="flex-1">
        <H1 className="text-3xl font-bold text-twine-900 mb-2">Sign Up</H1>
        <Muted className="text-twine-700 mb-8">
          Create your Toke Diary account
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
                  placeholder="Create a password"
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry
                  className="bg-white border-twine-300"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
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
            <Text className="text-white font-semibold">Sign Up</Text>
          )}
        </Button>
        <Muted
          className="text-center text-twine-700"
          onPress={() => {
            router.replace("/sign-in");
          }}
        >
          Already have an account?{" "}
          <Text className="text-twine-900 font-semibold">Sign in</Text>
        </Muted>
      </View>
    </SafeAreaView>
  );
}