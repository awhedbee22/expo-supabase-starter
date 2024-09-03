import React from 'react';
import { View, Modal, TouchableWithoutFeedback } from 'react-native';

interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: () => React.ReactNode;
  content: React.ReactNode;
}

export function Popover({ open, onOpenChange, trigger, content }: PopoverProps) {
  return (
    <View>
      <TouchableWithoutFeedback onPress={() => onOpenChange(true)}>
        <View>{trigger()}</View>
      </TouchableWithoutFeedback>
      <Modal
        transparent
        visible={open}
        onRequestClose={() => onOpenChange(false)}
      >
        <TouchableWithoutFeedback onPress={() => onOpenChange(false)}>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-md shadow-md">
                {content}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}