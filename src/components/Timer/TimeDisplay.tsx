import React from 'react';
import { Text } from 'react-native';
import { styles } from './TimeDisplay.styles';

interface TimeDisplayProps {
  timeBuffer: string;
  timeColor: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  timeBuffer,
  timeColor,
}) => {
  return (
    <Text style={[styles.time, { color: timeColor }]}>
      {timeBuffer}
    </Text>
  );
}; 