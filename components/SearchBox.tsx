import React from 'react';
import { View } from 'react-native';
import { Input } from '@/components/ui/input';

interface SearchBoxProps {
  value: string;
  onChangeText: (text: string) => void;
}

export function SearchBox({ value, onChangeText }: SearchBoxProps) {
  return (
    <View className="mb-4">
      <Input
        placeholder="Search strains..."
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}