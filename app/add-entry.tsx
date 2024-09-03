import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { useSupabase } from '@/context/supabase-provider';

const schema = z.object({
  strain: z.string().min(1, 'Strain is required'),
  size: z.number().min(0, 'Size must be a positive number'),
  cost: z.number().min(0, 'Cost must be a positive number'),
  type: z.string().min(1, 'Type is required'),
  high_rating: z.number().min(0).max(5),
  flavor_rating: z.number().min(0).max(5),
  high_description: z.string(),
  flavor_description: z.string(),
  date: z.date(),
});

type FormData = z.infer<typeof schema>;

export default function AddEntryPage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [image, setImage] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      strain: '',
      size: 0,
      cost: 0,
      type: 'Flower',
      high_rating: 0,
      flavor_rating: 0,
      high_description: '',
      flavor_description: '',
      date: new Date(),
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { data: entry, error } = await supabase
        .from('entries')
        .insert([
          {
            ...data,
            image: image,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ])
        .single();

      if (error) throw error;
      console.log('New entry added:', entry);
      router.back();
    } catch (error) {
      console.error('Error adding new entry:', error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4">Add New Entry</Text>
        
        <Controller
          control={control}
          name="strain"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Strain"
              onChangeText={onChange}
              value={value}
              error={errors.strain?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="size"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Size"
              onChangeText={(text) => onChange(parseFloat(text))}
              value={value.toString()}
              keyboardType="numeric"
              error={errors.size?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="cost"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Cost"
              onChangeText={(text) => onChange(parseFloat(text))}
              value={value.toString()}
              keyboardType="numeric"
              error={errors.cost?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <Select
              placeholder="Type"
              onValueChange={onChange}
              selectedValue={value}
              items={[
                { label: 'Flower', value: 'Flower' },
                { label: 'Concentrate', value: 'Concentrate' },
                { label: 'Edible', value: 'Edible' },
              ]}
              error={errors.type?.message}
            />
          )}
        />

        <Button onPress={pickImage}>
          <Text>{image ? 'Change Image' : 'Pick an image'}</Text>
        </Button>

        <Controller
          control={control}
          name="high_rating"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="High Rating (0-5)"
              onChangeText={(text) => onChange(parseInt(text))}
              value={value.toString()}
              keyboardType="numeric"
              error={errors.high_rating?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="flavor_rating"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Flavor Rating (0-5)"
              onChangeText={(text) => onChange(parseInt(text))}
              value={value.toString()}
              keyboardType="numeric"
              error={errors.flavor_rating?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="high_description"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="High Description"
              onChangeText={onChange}
              value={value}
              multiline
              error={errors.high_description?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="flavor_description"
          render={({ field: { onChange, value } }) => (
            <Input
              placeholder="Flavor Description"
              onChangeText={onChange}
              value={value}
              multiline
              error={errors.flavor_description?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <DateTimePicker
              value={value}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate || value;
                onChange(currentDate);
              }}
            />
          )}
        />

        <View className="flex-row justify-between mt-4">
          <Button onPress={() => router.back()} variant="outline">
            <Text>Cancel</Text>
          </Button>
          <Button onPress={handleSubmit(onSubmit)}>
            <Text>Save</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}