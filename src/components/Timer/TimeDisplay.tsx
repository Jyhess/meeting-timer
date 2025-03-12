import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './TimeDisplay.styles';

interface TimeDisplayProps {
  timeBuffer: string;
  timeColor: string;
  prefix?: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  timeBuffer,
  timeColor,
  prefix,
}) => {

  return (
    <View style={styles.container}>
      {prefix && (
        <View style={styles.prefixContainer}>
          <Text style={[styles.prefix, { color: timeColor }]}>
            {prefix}
          </Text>
        </View>
      )}
      <Text style={[styles.time, { color: timeColor }]}>
        {timeBuffer}
      </Text>
    </View>
  );
}; 