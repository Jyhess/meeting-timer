import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { sounds } from '../../config/alerts';
import { Icon } from './Icon';
import { TimerPreset } from '../../types/timer';
import { Alert } from '../../types/alerts';
import { formatTimeFromSeconds } from '../../utils/time';
import { theme } from '../../theme';

type PresetCardProps = {
  preset: TimerPreset;
};

export const PresetCard = ({ preset }: PresetCardProps) => {
  const { alerts } = preset;

  return (
    <View style={styles.container}>
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
                  ? `- ${formatTimeFromSeconds(alert.timeOffset)}`
                  : alert.id === 'end'
                  ? 'À la fin'
                  : `+ ${formatTimeFromSeconds(alert.timeOffset)}`}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.gray.dark,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    width: '100%',
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