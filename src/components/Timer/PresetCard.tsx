import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { sounds } from '../../config/alerts';
import { Icon } from './Icon';
import { TimerPreset, Alert } from '../../types/timer';
import { formatTimeFromSeconds } from '../../utils/time';
import { theme } from '../../theme';

type PresetCardProps = {
  preset: TimerPreset;
  onPress: () => void;
};

export const PresetCard = ({ preset, onPress }: PresetCardProps) => {
  const { alerts } = preset;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.title}>{preset.name}</Text>
        <Text style={styles.duration}>{formatTimeFromSeconds(preset.seconds)}</Text>
      </View>

      <View style={styles.alerts}>
        {alerts.map((alert: Alert) => {
          const soundConfig = sounds.find(s => s.id === alert.sound);
          if (!soundConfig) return null;
          
          return (
            <View key={alert.id} style={styles.alert}>
              <Icon
                name={soundConfig.icon as any}
                size={16}
                color={theme.colors.gray.light}
              />
              <Text style={styles.alertText}>
                {alert.id === 'before'
                  ? `${formatTimeFromSeconds(alert.timeOffset)} avant la fin`
                  : alert.id === 'end'
                  ? 'À la fin'
                  : `${formatTimeFromSeconds(alert.timeOffset)} après la fin`}
              </Text>
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.gray.dark,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  duration: {
    fontSize: 16,
    color: theme.colors.white,
  },
  alerts: {
    gap: 8,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertText: {
    fontSize: 14,
    color: theme.colors.gray.light,
  },
}); 