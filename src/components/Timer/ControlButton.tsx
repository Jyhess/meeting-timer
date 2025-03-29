import React from 'react';
import { Pressable, ViewStyle, StyleSheet } from 'react-native';
import { Icon } from './Icon';
import { theme } from '../../theme';

interface ControlButtonProps {
  onPress: () => void;
  icon: string;
  color?: string;
  disabled?: boolean;
  size?: number;
  style?: ViewStyle;
}

export const ControlButton: React.FC<ControlButtonProps> = ({
  onPress,
  icon,
  color = theme.colors.white,
  disabled = false,
  size = theme.layout.iconSize,
  style,
}) => {
  return (
    <Pressable
      style={[style || styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Icon name={icon as any} size={size} color={disabled ? theme.colors.gray.dark : color} />
    </Pressable>
  );
};

 const styles = StyleSheet.create({
  button: {
    aspectRatio: 1,
    maxWidth: '100%',
    padding: theme.spacing.small,
    borderRadius: theme.borders.radius.medium,
    backgroundColor: theme.colors.gray.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: theme.effects.opacity.disabled,
  },
});
