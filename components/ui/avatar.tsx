import React from 'react';
import { View, Image, Text } from 'react-native';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ src, alt, fallback, size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const containerClasses = cn(
    'rounded-full overflow-hidden bg-muted',
    sizeClasses[size],
    className
  );

  const textClasses = cn(
    'text-foreground font-semibold',
    size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
  );

  if (src) {
    return (
      <View className={containerClasses}>
        <Image
          source={{ uri: src }}
          className="w-full h-full"
          accessibilityLabel={alt}
        />
      </View>
    );
  }

  return (
    <View className={cn(containerClasses, 'items-center justify-center')}>
      <Text className={textClasses}>{fallback}</Text>
    </View>
  );
}