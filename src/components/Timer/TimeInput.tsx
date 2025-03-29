import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TimeDisplay } from './TimeDisplay';
import { Keypad } from './Keypad';
import { theme } from '@/src/theme';
import { formatTime } from '@/src/utils/time';

interface TimeInputProps {
  initialSeconds: number;
  onTimeChange: (seconds: number, isValidTime: boolean) => void;
  timeColor?: string;
  prefix?: string;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  initialSeconds,
  onTimeChange,
  timeColor = theme.colors.white,
  prefix = '',
}) => {
  const [inputBuffer, setInputBuffer] = useState('');
  const [displayValue, setDisplayValue] = useState(formatTime('', 
    Math.floor(initialSeconds / 3600),
    Math.floor((initialSeconds % 3600) / 60),
    initialSeconds % 60,
    true
  ));

  useEffect(() => {
    if (initialSeconds === 0) {
      setInputBuffer('');
      setDisplayValue(formatTime('', 0, 0, 0, true));
    }
    else {
      setDisplayValue(formatTime('',
        Math.floor(initialSeconds / 3600),
        Math.floor((initialSeconds % 3600) / 60),
        initialSeconds % 60,
        true
      ));
    }
  }, [initialSeconds]);

  const handleBufferChange = (newBuffer: string) => {
    setInputBuffer(newBuffer);

    if (newBuffer.length === 0) {
      onTimeChange(0, false);
      setDisplayValue(formatTime('', 0, 0, 0, true));
      return;
    }

    const digits = newBuffer.padStart(6, '0').split('').map(Number);
    const hours = parseInt(digits.slice(0, 2).join(''), 10);
    const mins = parseInt(digits.slice(2, 4).join(''), 10);
    const secs = parseInt(digits.slice(4).join(''), 10);
    const totalSeconds = hours * 3600 + mins * 60 + secs;
    setDisplayValue(formatTime('', hours, mins, secs, true));

    const isValidTime = secs < 60 && totalSeconds > 0;
    onTimeChange(totalSeconds, isValidTime);
  };

  const handleNumberPress = (num: number) => {
    if (inputBuffer.length < 6) {
      if (num === 0 && inputBuffer.length === 0) {
        return;
      }
      const newBuffer = inputBuffer + num.toString();
      handleBufferChange(newBuffer);
    }
  };

  const handleBackspace = () => {
    if (inputBuffer.length > 0) {
      const newBuffer = inputBuffer.slice(0, -1);
      handleBufferChange(newBuffer);
    }
  };

  const handleDoubleZero = () => {
    if (inputBuffer.length === 0) {
      return;
    }
    const newBuffer = inputBuffer + '00';
    if (newBuffer.length <= 6) {
      handleBufferChange(newBuffer);
    }
    else if (newBuffer.length === 7) {
      handleBufferChange(newBuffer.slice(0, -1));
    }
  };

  return (
    <View style={styles.container}>
      <TimeDisplay
        timeBuffer={displayValue}
        timeColor={timeColor}
        prefix={prefix}
      />
      <Keypad
        onNumberPress={handleNumberPress}
        onBackspace={handleBackspace}
        onDoubleZero={handleDoubleZero}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
});
