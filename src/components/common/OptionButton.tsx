import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Icon } from './Icon';
import { theme } from '../../theme';

type OptionButtonProps = {
  id: string;
  label: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
};

export const OptionButton = ({
  id,
  label,
  isSelected,
  onPress,
  icon,
  iconSize = 28,
  iconColor = '#fff',
}: OptionButtonProps) => {
  return (
    <TouchableOpacity
      key={id}
      style={[
        styles.optionButton,
        isSelected && styles.optionButtonActive,
      ]}
      onPress={onPress}
    >
      {icon && (
        <Icon 
          name={icon as any}
          size={iconSize}
          color={iconColor}
        />
      )}
      <Text
        style={[
          styles.optionText,
          isSelected && styles.optionTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  optionButton: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.medium,
    padding: theme.spacing.medium,
    alignItems: 'center',
    minWidth: 100,
  },
  optionButtonActive: {
    backgroundColor: theme.colors.background.selected,
  },
  optionText: {
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.small,
  },
  optionTextActive: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
  },
}); 