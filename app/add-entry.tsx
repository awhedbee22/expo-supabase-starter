import React, { useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Popover } from '@/components/ui/popover';
import { useSupabase } from '@/context/supabase-provider';

const schema = z.object({
  strain: z.string().min(1, 'Strain is required'),
  brand: z.string().optional(),
  size: z.string().min(1, 'Size is required'),
  size_unit: z.enum(['g', 'oz', 'lb']),
  cost: z.number().min(0, 'Cost must be a positive number'),
  type: z.string().min(1, 'Type is required'),
  high_rating: z.number().min(1).max(10),
  flavor_rating: z.number().min(1).max(10),
  high_description: z.string(),
  flavor_description: z.string(),
  date: z.date(),
});

type FormData = z.infer<typeof schema>;

export default function AddEntryPage() {
  const router = useRouter();
  const navigation = useNavigation();
  const { supabase } = useSupabase();
  const [image, setImage] = useState<string | null>(null);
  const [sizeUnitOpen, setSizeUnitOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);

  const { control, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      strain: '',
      brand: '',
      size: '',
      size_unit: 'g',
      cost: 0,
      type: 'Concentrate',
      high_rating: 1,
      flavor_rating: 1,
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
            size: parseFloat(data.size),
            image: image,
            user_id: (await supabase.auth.getUser()).data.user?.id,
          },
        ])
        .single();

      if (error) throw error;
      console.log('New entry added:', entry);
      navigation.goBack();
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

  const inputClass = "bg-twine-100 border border-twine-300 rounded-sm text-twine-950 p-2";
  const labelClass = "text-twine-950 text-sm mb-1";

  return (
    <SafeAreaView className="flex-1 bg-twine-100">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6 text-twine-950">Add New Entry</Text>
        
        <View className="space-y-6">
          <View className="mb-2">
            <Text className={labelClass}>Strain</Text>
            <Controller
              control={control}
              name="strain"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Strain"
                  onChangeText={onChange}
                  value={value}
                  error={errors.strain?.message}
                  className={inputClass}
                />
              )}
            />
          </View>

          <View className="flex-row space-x-4 mb-2">
            <View className="flex-[3]">
              <Text className={labelClass}>Brand</Text>
              <Controller
                control={control}
                name="brand"
                render={({ field: { onChange, value } }) => (
                  <Input
                    placeholder="Brand"
                    onChangeText={onChange}
                    value={value}
                    error={errors.brand?.message}
                    className={inputClass}
                  />
                )}
              />
            </View>
            <View className="flex-1 ml-4">
              <Text className={labelClass}>Type</Text>
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <Popover
                    open={typeOpen}
                    onOpenChange={setTypeOpen}
                    trigger={() => (
                      <TouchableOpacity
                        onPress={() => setTypeOpen(true)}
                        className={`${inputClass} h-12 justify-center`}
                      >
                        <Text>{value}</Text>
                      </TouchableOpacity>
                    )}
                    content={
                      <View className="bg-white p-2 rounded-md">
                        {['Flower', 'Concentrate', 'Edible'].map((type) => (
                          <TouchableOpacity
                            key={type}
                            onPress={() => {
                              onChange(type);
                              setTypeOpen(false);
                            }}
                            className="py-2"
                          >
                            <Text>{type}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    }
                  />
                )}
              />
            </View>
          </View>

          <View className="flex-row space-x-4 mb-2">
            <View className="flex-1">
              <Text className={labelClass}>Size</Text>
              <View className="flex-row">
                <Controller
                  control={control}
                  name="size"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="Size"
                      onChangeText={(text) => {
                        const num = parseFloat(text);
                        onChange(isNaN(num) ? '' : text);
                      }}
                      value={value}
                      keyboardType="numeric"
                      error={errors.size?.message}
                      className={`${inputClass} flex-1`}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="size_unit"
                  render={({ field: { onChange, value } }) => (
                    <Popover
                      open={sizeUnitOpen}
                      onOpenChange={setSizeUnitOpen}
                      trigger={() => (
                        <TouchableOpacity
                          onPress={() => setSizeUnitOpen(true)}
                          className={`${inputClass} mx-4 h-12 w-24 justify-center items-center`}
                        >
                          <Text>{value}</Text>
                        </TouchableOpacity>
                      )}
                      content={
                        <View className="bg-white p-2 rounded-md">
                          {['g', 'oz', 'lb'].map((unit) => (
                            <TouchableOpacity
                              key={unit}
                              onPress={() => {
                                onChange(unit);
                                setSizeUnitOpen(false);
                              }}
                              className="py-2"
                            >
                              <Text>{unit}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      }
                    />
                  )}
                />
              </View>
            </View>

            <View className="flex-1">
              <Text className={labelClass}>Cost</Text>
              <Controller
                control={control}
                name="cost"
                render={({ field: { onChange, value } }) => (
                  <View className={`${inputClass} flex-row items-center`}>
                    <Text className="text-twine-950 py-1 mr-1">$</Text>
                    <TextInput
                      placeholder="0.00"
                      onChangeText={(text) => {
                        const num = parseFloat(text);
                        onChange(isNaN(num) ? 0 : num);
                      }}
                      value={value.toString()}
                      keyboardType="numeric"
                      className="flex-1 text-twine-950"
                    />
                  </View>
                )}
              />
              {errors.cost && <Text className="text-red-500 text-xs mt-1">{errors.cost.message}</Text>}
            </View>
          </View>

          <View className="flex-row space-x-4 mb-2">
            <View className="flex-1">
              <Text className={labelClass}>Date</Text>
              <Controller
                control={control}
                name="date"
                render={({ field: { onChange, value } }) => (
                  <View className={inputClass}>
                    <DateTimePicker
                      value={value}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        const currentDate = selectedDate || value;
                        onChange(currentDate);
                      }}
                      textColor="#39261a"
                      style={{width: '100%'}}
                    />
                  </View>
                )}
              />
            </View>

            <View className="flex-1 ml-4">
              <Text className={labelClass}>Image</Text>
              <Button 
                onPress={pickImage} 
                className={`${inputClass} flex-row justify-between items-center`}
              >
                <Text className="text-twine-950">
                  {image ? 'Change Image' : 'Choose File no file selected'}
                </Text>
              </Button>
            </View>
          </View>

          <View>
            <Text className={labelClass}>High Rating</Text>
            <Controller
              control={control}
              name="high_rating"
              render={({ field: { onChange, value } }) => (
                <View>
                  <Slider
                    style={{height: 40}}
                    minimumValue={1}
                    maximumValue={10}
                    step={0.5}
                    value={value}
                    onValueChange={(v) => onChange(parseFloat(v.toFixed(1)))}
                    minimumTrackTintColor="#a57243"
                    maximumTrackTintColor="#decda5"
                    thumbTintColor="#865d3c"
                  />
                  <Text className="text-center text-twine-950">{value.toFixed(1)}</Text>
                </View>
              )}
            />
          </View>

          <View>
            <Text className={labelClass}>Flavor Rating</Text>
            <Controller
              control={control}
              name="flavor_rating"
              render={({ field: { onChange, value } }) => (
                <View>
                  <Slider
                    style={{height: 40}}
                    minimumValue={1}
                    maximumValue={10}
                    step={0.5}
                    value={value}
                    onValueChange={(v) => onChange(parseFloat(v.toFixed(1)))}
                    minimumTrackTintColor="#a57243"
                    maximumTrackTintColor="#decda5"
                    thumbTintColor="#865d3c"
                  />
                  <Text className="text-center text-twine-950">{value.toFixed(1)}</Text>
                </View>
              )}
            />
          </View>

          <View className="mb-4">
            <Text className={labelClass}>High Description</Text>
            <Controller
              control={control}
              name="high_description"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="High Description"
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={4}
                  error={errors.high_description?.message}
                  className={`${inputClass} h-24`}
                />
              )}
            />
          </View>

          <View>
            <Text className={labelClass}>Flavor Description</Text>
            <Controller
              control={control}
              name="flavor_description"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Flavor Description"
                  onChangeText={onChange}
                  value={value}
                  multiline
                  numberOfLines={4}
                  error={errors.flavor_description?.message}
                  className={`${inputClass} h-24`}
                />
              )}
            />
          </View>

          <View className="flex-row justify-end space-x-4 mt-6">
            <Button 
              onPress={() => navigation.goBack()} 
              variant="outline" 
              className="bg-twine-100 border-twine-300 px-4 py-2 mr-4 rounded-sm"
            >
              <Text className="text-twine-950">Cancel</Text>
            </Button>
            <Button 
              onPress={handleSubmit(onSubmit)} 
              className="bg-twine-500 px-4 py-2 rounded-sm"
            >
              <Text className="text-twine-50">Save</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}