import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

type ClickButtonVariant = 'primary' | 'danger' | 'default';

type ClickButtonProps = {
  label: string;
  onPress: () => void;
  variant?: ClickButtonVariant;
  disabled?: boolean;
};

export const ClickButton = ({
  label,
  onPress,
  variant = 'default',
  disabled = false,
}: ClickButtonProps) => {
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.buttonPrimary;
      case 'danger':
        return styles.buttonDanger;
      default:
        return styles.buttonDefault;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.textPrimary;
      case 'danger':
        return styles.textDanger;
      default:
        return styles.textDefault;
    }
  };

  return (
    <Pressable
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.text,
        getTextStyle(),
        disabled && styles.textDisabled,
      ]}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.small,
    borderRadius: theme.borders.radius.medium,
    marginHorizontal: theme.spacing.xs,
  },
  buttonDefault: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  buttonDanger: {
    backgroundColor: theme.colors.danger,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.disabled,
    opacity: 0.5,
  },
  text: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
  },
  textDefault: {
    color: theme.colors.white,
  },
  textPrimary: {
    color: theme.colors.white,
  },
  textDanger: {
    color: theme.colors.white,
  },
  textDisabled: {
    color: theme.colors.gray.light,
  },
}); 