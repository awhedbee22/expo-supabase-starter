import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { useSupabase } from '@/context/supabase-provider';
import { Leaf, Rocket, Calendar, X, DollarSign, Scale } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Entry = {
  id: string;
  strain: string;
  brand: string | null;
  type: string;
  size: number;
  size_unit: string;
  cost: number;
  high_rating: number;
  flavor_rating: number;
  high_description: string | null;
  flavor_description: string | null;
  date: string;
  image: string | null;
};

type StrainDetailProps = {
  entryId: string;
  onClose: () => void;
};

export const StrainDetail: React.FC<StrainDetailProps> = ({ entryId, onClose }) => {
  const { supabase } = useSupabase();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      // Try to get the entry from cache first
      const cachedEntry = await AsyncStorage.getItem(`entry_${entryId}`);
      if (cachedEntry) {
        setEntry(JSON.parse(cachedEntry));
      }

      // Fetch the latest data from Supabase
      const { data, error } = await supabase
        .from('entries')
        .select('*')
        .eq('id', entryId)
        .single();

      if (error) {
        console.error('Error fetching entry:', error);
      } else {
        setEntry(data as Entry);
        // Update cache
        await AsyncStorage.setItem(`entry_${entryId}`, JSON.stringify(data));
      }

      // Check if the strain is favorited
      const favorites = await AsyncStorage.getItem('favorites');
      const favoritesArray = favorites ? JSON.parse(favorites) : [];
      setIsFavorite(favoritesArray.includes(entryId));
    };

    if (entryId) {
      fetchEntry();
    }
  }, [entryId, supabase]);

  const toggleFavorite = async () => {
    const favorites = await AsyncStorage.getItem('favorites');
    const favoritesArray = favorites ? JSON.parse(favorites) : [];
    
    if (isFavorite) {
      const newFavorites = favoritesArray.filter((id: string) => id !== entryId);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      favoritesArray.push(entryId);
      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
    }

    setIsFavorite(!isFavorite);
  };

  if (!entry) {
    return (
      <View className="flex-1 items-center justify-center bg-twine-300">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-twine-300">
      <ScrollView className="flex-1">
        <TouchableOpacity onPress={onClose} className="absolute top-4 right-4 z-10">
          <X size={24} color="#6d4e33" />
        </TouchableOpacity>
        
        {entry.image && (
          <Image
            source={{ uri: entry.image }}
            className="w-full h-50 object-cover"
          />
        )}
        
        <View className="flex-row justify-between items-center p-4">
          <View>
            <Text className="text-2xl font-bold text-twine-950">{entry.strain}</Text>
            {entry.brand && <Text className="text-lg text-twine-900">{entry.brand}</Text>}
          </View>
        </View>
        
        <View className="bg-twine-500 self-start px-3 py-1 rounded-full ml-4 mb-4">
          <Text className="text-twine-950 text-base font-bold">{entry.type}</Text>
        </View>
        
        <View className="flex-row justify-around p-4">
          <View className="flex-row items-center">
            <Scale size={24} color="#6d4e33" />
            <Text className="ml-2 text-base text-twine-950">{`${entry.size} ${entry.size_unit}`}</Text>
          </View>
          <View className="flex-row items-center">
            <DollarSign size={24} color="#6d4e33" />
            <Text className="ml-2 text-base text-twine-950">{`$${entry.cost.toFixed(2)}`}</Text>
          </View>
        </View>
        
        <View className="flex-row justify-around p-4">
          <View className="flex-row items-center">
            <Leaf size={24} color="#6d4e33" />
            <Text className="ml-2 text-base text-twine-950">{`Flavor: ${entry.flavor_rating.toFixed(1)}/10`}</Text>
          </View>
          <View className="flex-row items-center">
            <Rocket size={24} color="#6d4e33" />
            <Text className="ml-2 text-base text-twine-950">{`High: ${entry.high_rating.toFixed(1)}/10`}</Text>
          </View>
        </View>
        
        <View className="flex-row items-center p-4">
          <Calendar size={24} color="#6d4e33" />
          <Text className="ml-2 text-base text-twine-950">
            {new Date(entry.date).toLocaleDateString()}
          </Text>
        </View>
        
        {entry.flavor_description && (
          <View className="bg-twine-100 p-4 mx-4 mb-4 rounded-lg">
            <Text className="text-lg font-bold text-twine-950 mb-2">Flavor Description:</Text>
            <Text className="text-base text-twine-900">{entry.flavor_description}</Text>
          </View>
        )}
        
        {entry.high_description && (
          <View className="bg-twine-100 p-4 mx-4 mb-4 rounded-lg">
            <Text className="text-lg font-bold text-twine-950 mb-2">High Description:</Text>
            <Text className="text-base text-twine-900">{entry.high_description}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};