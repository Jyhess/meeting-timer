import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/TimeDisplay.styles';

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
      {prefix?.trim() !== '' && <Text style={[styles.prefix, { color: timeColor }]}>{prefix}</Text>}
      <Text style={[styles.time, { color: timeColor }]}>{timeBuffer}</Text>
      {prefix?.trim() !== '' && <Text style={[styles.prefix, { color: 'transparent' }]}>{prefix}</Text>}
    </View>
  );
};