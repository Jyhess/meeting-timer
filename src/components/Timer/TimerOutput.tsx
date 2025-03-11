import React from 'react';
import { TimeDisplay } from './TimeDisplay';
import { theme } from '@/src/theme';
import { formatTimeFromSeconds } from '@/src/utils/time';

interface TimerOutputProps {
  timeLeft: number;
  beforeAlertOffset?: number;
}

export const TimerOutput: React.FC<TimerOutputProps> = ({
  timeLeft,
  beforeAlertOffset,
}) => {
  const getTimeColor = () => {
    if (timeLeft < 0) {
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
        timeBuffer={formatTimeFromSeconds(timeLeft)}
        timeColor={getTimeColor()}
      />
    </>
  );
}; 
