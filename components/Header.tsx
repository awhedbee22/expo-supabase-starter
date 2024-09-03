import React from 'react';
import { View, TouchableOpacity, SafeAreaView } from 'react-native';
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

  const adjustedTopPadding = insets.top * 0.2; // Use 70% of the top inset

  return (
    <SafeAreaView style={{ backgroundColor: 'background' }}>
      <View 
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 12,
          paddingTop: adjustedTopPadding,
          paddingBottom: 12,
        }}
      >
        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>CannaJournal</Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Avatar
            src={avatarUrl}
            alt={`${email}'s avatar`}
            fallback={initials}
            size="md"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}