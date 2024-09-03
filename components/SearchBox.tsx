import React from 'react';
import { View } from 'react-native';
import { Input } from '@/components/ui/input';

interface SearchBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  className?: string;
}

export function SearchBox({ value, onChangeText, className }: SearchBoxProps) {
  return (
    <View className="mb-4 border-2 border-twine-400 rounded-lg">
      <Input
        placeholder="Search strains..."
        value={value}
        onChangeText={onChangeText}
        className={className}
      />
    </View>
  );
}