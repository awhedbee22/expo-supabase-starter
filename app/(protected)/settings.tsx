import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useSupabase } from '@/context/supabase-provider';
import { Avatar } from '@/components/ui/avatar';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

type FormData = z.infer<typeof schema>;

export default function SettingsPage() {
  const router = useRouter();
  const { supabase, session } = useSupabase();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(session?.user?.user_metadata?.avatar_url || null);
  const [isUploading, setIsUploading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: session?.user?.email || '',
      password: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const updates = {
        email: data.email,
        ...(data.password ? { password: data.password } : {}),
      };

      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const pickImage = async () => {
    try {
      setIsUploading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) {
        setIsUploading(false);
        return;
      }

      const file = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(file.uri);
      
      if (!fileInfo.size) {
        throw new Error("Couldn't get file size");
      }

      if (fileInfo.size > 5 * 1024 * 1024) {
        Alert.alert("Error", "File size must be less than 5MB");
        setIsUploading(false);
        return;
      }

      const fileExt = file.uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${session?.user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, {
          uri: file.uri,
          type: `image/${fileExt}`, // Adjust this if needed
          name: fileName,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(publicUrl);
      Alert.alert('Success', 'Avatar updated successfully');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Error', 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/welcome');
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <View className="items-center mb-6">
        <TouchableOpacity onPress={pickImage} disabled={isUploading}>
          <Avatar
            src={avatarUrl}
            alt={`${session?.user?.email}'s avatar`}
            fallback={session?.user?.email?.slice(0, 2).toUpperCase() || ''}
            size="lg"
          />
        </TouchableOpacity>
        <Text className="mt-2">
          {isUploading ? 'Uploading...' : 'Tap to change avatar'}
        </Text>
      </View>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Email"
            onChangeText={onChange}
            value={value}
            error={errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="New Password (optional)"
            onChangeText={onChange}
            value={value}
            secureTextEntry
            error={errors.password?.message}
          />
        )}
      />

      <Button onPress={handleSubmit(onSubmit)} className="mt-4">
        <Text>Update Profile</Text>
      </Button>

      <Button onPress={handleSignOut} variant="destructive" className="mt-4">
        <Text>Sign Out</Text>
      </Button>
    </ScrollView>
  );
}