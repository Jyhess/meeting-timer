import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { styles } from '../../styles/Keypad.styles';
import { Icon } from './Icon';
import { theme } from '../../theme';

interface KeypadProps {
  onNumberPress: (num: number) => void;
  onBackspace: () => void;
  onDoubleZero: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  onNumberPress,
  onBackspace,
  onDoubleZero,
}) => {
  const renderKeypadButton = (num: number) => (
    <Pressable
      style={styles.keypadButton}
      onPress={() => onNumberPress(num)}
    >
      <Text style={styles.keypadButtonText}>{num}</Text>
    </Pressable>
  );

  return (
    <View style={styles.keypadContainer}>
      <View style={styles.keypadRow}>
        {renderKeypadButton(1)}
        {renderKeypadButton(2)}
        {renderKeypadButton(3)}
      </View>
      <View style={styles.keypadRow}>
        {renderKeypadButton(4)}
        {renderKeypadButton(5)}
        {renderKeypadButton(6)}
      </View>
      <View style={styles.keypadRow}>
        {renderKeypadButton(7)}
        {renderKeypadButton(8)}
        {renderKeypadButton(9)}
      </View>
      <View style={styles.keypadRow}>
        <Pressable
          style={styles.keypadButton}
          onPress={onBackspace}
        >
          <Icon name="backspace" size={theme.layout.iconSize} color={theme.colors.danger} />
        </Pressable>
        {renderKeypadButton(0)}
        <Pressable
          style={styles.keypadButton}
          onPress={onDoubleZero}
        >
          <Text style={styles.keypadButtonText}>00</Text>
        </Pressable>
      </View>
    </View>
  );
}; 