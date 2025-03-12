import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
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
  const [displayValue, setDisplayValue] = useState(formatTime('', Math.floor(initialSeconds / 60), initialSeconds % 60));

  useEffect(() => {
    setDisplayValue(formatTime('', Math.floor(initialSeconds / 60), initialSeconds % 60));
  }, [initialSeconds]);

  const handleBufferChange = (newBuffer: string) => {
    setInputBuffer(newBuffer);

    if (newBuffer.length === 0) {
      onTimeChange(0, false);
      setDisplayValue(formatTime('', 0, 0));
      return;
    }

    const digits = newBuffer.padStart(4, '0').split('').map(Number);
    const mins = parseInt(digits.slice(0, 2).join(''), 10);
    const secs = parseInt(digits.slice(2).join(''), 10);
    const totalSeconds = mins * 60 + secs;
    setDisplayValue(formatTime('', mins, secs));

    const isValidTime = secs < 60 && totalSeconds > 0;
    onTimeChange(totalSeconds, isValidTime);
  };

  const handleNumberPress = (num: number) => {
    if (inputBuffer.length < 4) {
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
    const newBuffer = inputBuffer + '00';
    if (newBuffer.length <= 4) {
      handleBufferChange(newBuffer);
    }
    else if (newBuffer.length === 5) {
      handleBufferChange(newBuffer.slice(0, -1));
    }
  };

  return (
    <View>
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