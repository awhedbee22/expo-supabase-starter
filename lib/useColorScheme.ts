import { useColorScheme as useNativewindColorScheme } from "nativewind";

export function useColorScheme() {
  const { setColorScheme, toggleColorScheme } = useNativewindColorScheme();

  // Always return 'light' for colorScheme
  return {
    colorScheme: "light",
    isDarkColorScheme: false,
    setColorScheme,
    toggleColorScheme,
  };
}