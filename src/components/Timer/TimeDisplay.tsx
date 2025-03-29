import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

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

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  time: {
    fontSize: theme.typography.fontSize.timer,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
  },
  prefix: {
    fontSize: theme.typography.fontSize.timer,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'right',
    minWidth: 40,
  },
});
