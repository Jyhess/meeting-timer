import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { iconMap, IconName } from '../../types/icons';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<ImageStyle>;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color, style }) => {
  return (
    <Image
      source={iconMap[name]}
      style={[
        {
          width: size,
          height: size,
          tintColor: color,
        },
        style,
      ]}
    />
  );
};
