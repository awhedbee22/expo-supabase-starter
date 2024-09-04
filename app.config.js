export default ({ config }) => ({
    ...config,
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      eas: {
        projectId: "1ef3cae7-93b2-4a64-9c5c-1fee9fd1d39e"
      }
    },
  });
  