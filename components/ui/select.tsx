import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { cn } from '@/lib/utils';

interface SelectProps {
  placeholder?: string;
  onValueChange: (value: string) => void;
  selectedValue: string;
  items: Array<{ label: string; value: string }>;
  error?: string;
}

export function Select({ placeholder, onValueChange, selectedValue, items, error }: SelectProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find(item => item.value === selectedValue);

  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className={cn(
          "h-10 px-3 py-2 rounded-md border border-input bg-transparent flex-row items-center justify-between",
          error && "border-red-500"
        )}
      >
        <Text className="text-sm">
          {selectedItem ? selectedItem.label : placeholder || 'Select an option'}
        </Text>
        <Text>▼</Text>
      </TouchableOpacity>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="bg-background rounded-t-lg">
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="p-4 border-b border-gray-200"
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              className="p-4 bg-gray-100"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-center font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}