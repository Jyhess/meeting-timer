import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Icon } from './Icon';
import { theme } from '../../theme';
import { getContrastColor } from '../../utils/color';

type ColorButtonProps = {
  hex: string;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
};

export const ColorButton = ({
  hex,
  isSelected,
  onPress,
  style,
}: ColorButtonProps) => {
  const contrastColor = getContrastColor(hex);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: hex },
        isSelected && styles.buttonActive,
        style,
      ]}
      onPress={onPress}
    >
      {isSelected && (
        <Icon 
          name="check" 
          size={24} 
          color={contrastColor === 'black' ? theme.colors.black : theme.colors.white} 
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
}); 