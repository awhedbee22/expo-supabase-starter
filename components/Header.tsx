import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { useSupabase } from '@/context/supabase-provider';

export function Header() {
  const router = useRouter();
  const { session } = useSupabase();
  const insets = useSafeAreaInsets();
  const email = session?.user?.email || '';
  const initials = email.slice(0, 2).toUpperCase();
  const avatarUrl = session?.user?.user_metadata?.avatar_url;

  return (
    <View 
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: insets.top,
        paddingBottom: 12,
        backgroundColor: 'rgb(226, 213, 197)', // twine-200 color
      }}
    >
      <Text className="text-twine-900 text-2xl font-bold">Toke Journal</Text>
      <TouchableOpacity onPress={() => router.push('/settings')}>
        <Avatar
          src={avatarUrl}
          alt={`${email}'s avatar`}
          fallback={initials}
          size="md"
        />
      </TouchableOpacity>
    </View>
  );
}