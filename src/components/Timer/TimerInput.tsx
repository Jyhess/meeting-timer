import React, { useEffect, useState } from 'react';
import { TimeDisplay } from './TimeDisplay';
import { Keypad } from './Keypad';
import { theme } from '@/src/theme';
import { formatTime, formatTimeFromSeconds } from '@/src/utils/time';

interface TimerInputProps {
  timeLeft: number;
  beforeAlertOffset?: number;
  onDurationChange: (duration: number, isValidTime: boolean) => void;
}

export const TimerInput: React.FC<TimerInputProps> = ({
  timeLeft,
  beforeAlertOffset,
  onDurationChange,
}) => {
  const [displayValue, setDisplayValue] = useState(formatTimeFromSeconds(timeLeft));
  const [inputBuffer, setInputBuffer] = useState('');
  const [isValidTime, setIsValidTime] = useState(false);

  useEffect(() => {
    setDisplayValue(formatTimeFromSeconds(timeLeft));
  }, [timeLeft]);

  const handleBufferChange = (newBuffer: string) => {
    setInputBuffer(newBuffer);

    if (newBuffer.length === 0) {
      onDurationChange(0, false);
      setDisplayValue(formatTimeFromSeconds(0));
      setIsValidTime(false);
    } else {
      const digits = newBuffer.padStart(4, '0').split('').map(Number);
      const mins = parseInt(digits.slice(0, 2).join(''), 10);
      const secs = parseInt(digits.slice(2).join(''), 10);
      const totalSeconds = mins * 60 + secs;
      setDisplayValue(formatTime('', mins, secs));
    
      if (totalSeconds > 0 && secs < 60 && (!beforeAlertOffset || totalSeconds > beforeAlertOffset * 60)) {
        onDurationChange(totalSeconds, true);
        setIsValidTime(true);
      }
      else {
        onDurationChange(0, false);
        setIsValidTime(false);
      }
    }
  }
  
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
    else if (newBuffer.length == 5) {
      handleBufferChange(newBuffer.slice(0, -1));
    }
  };

  const getTimeColor = () => {
    if (!isValidTime) {
      return theme.colors.error;
    }
    if (beforeAlertOffset && timeLeft <= beforeAlertOffset * 60) {
      return theme.colors.secondary;
    }
    return theme.colors.white;
  };

  return (
    <>
      <TimeDisplay
        timeBuffer={displayValue}
        timeColor={getTimeColor()}
      />
      <Keypad
        onNumberPress={handleNumberPress}
        onBackspace={handleBackspace}
        onDoubleZero={handleDoubleZero}
      />
    </>
  );
}; 
