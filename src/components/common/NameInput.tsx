import React, { useRef, useEffect } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Icon } from '../Timer/Icon';
import { theme } from '../../theme';

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}

export const NameInput = ({
  value,
  onChange,
  placeholder,
  autoFocus = false,
}: NameInputProps) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [autoFocus]);

  const handleClear = () => {
    inputRef.current?.focus();
    onChange('');
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray.medium}
        selectTextOnFocus
        autoFocus={autoFocus}
      />
      <Pressable 
        style={styles.clearButton}
        onPress={handleClear}
        disabled={!value.trim()}
      >
        <Icon name="backspace" size={20} color={theme.colors.danger} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borders.radius.medium,
  },
  input: {
    flex: 1,
    padding: theme.spacing.medium,
    color: theme.colors.white,
    fontSize: theme.typography.fontSize.medium,
  },
  clearButton: {
    padding: theme.spacing.medium,
  },
}); 