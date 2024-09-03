import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Leaf, Rocket, MoreVertical } from 'lucide-react-native';

type StrainCardProps = {
  strain: string;
  brand: string;
  type: string;
  highRating: number;
  flavorRating: number;
  image: string | null;
  onPress: () => void;
  onOptionsPress: () => void;
};

export const StrainCard: React.FC<StrainCardProps> = ({
  strain,
  brand,
  type,
  highRating,
  flavorRating,
  image,
  onPress,
  onOptionsPress,
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="bg-twine-100 rounded-lg overflow-hidden mb-4 border-twine-400 border"
    >
      {image && (
        <Image
          source={{ uri: image }}
          className="w-full h-40"
        />
      )}
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="font-bold text-lg text-twine-900">{strain}</Text>
            <Text className="text-twine-700">{brand}</Text>
          </View>
          <TouchableOpacity onPress={onOptionsPress}>
            <MoreVertical size={24} color="#6d4e33" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-between items-center mt-2">
          <View className="flex-row items-center">
            <Leaf size={16} color="#6d4e33" />
            <Text className="ml-1 text-twine-800">{flavorRating.toFixed(1)}/10</Text>
          </View>
          <View className="flex-row items-center">
            <Rocket size={16} color="#6d4e33" />
            <Text className="ml-1 text-twine-800">{highRating.toFixed(1)}/10</Text>
          </View>
          <View className="bg-twine-300 px-2 py-1 rounded-full">
            <Text className="text-twine-800 text-xs">{type}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};