import React, { useState } from 'react';
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
  const { alerts, color } = preset;
  const displayColor = color ? color : theme.colors.gray.dark;
  const cardColor = color ? displayColor + '33' : theme.colors.gray.light;
  // La couleur disabled est la couleur de display avec 50% de transparence
  const disabledColor = `${displayColor}50`;

  console.log('[PresetCard]', preset, displayColor);


  return (
    <View style={[styles.container, { backgroundColor: cardColor }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View style={[styles.colorDot, { backgroundColor: displayColor }]} />
          <Text style={styles.title}>{preset.name}</Text>
        </View>
      </View>

      <View style={styles.alertsContainer}>
        <Text style={styles.duration}>{formatTimeFromSeconds(preset.seconds)}</Text>
        <View style={styles.alerts}>
          {alerts.map((alert: Alert) => {
            const soundConfig = sounds.find(s => s.id === alert.sound);
            if (!soundConfig) return null;
            
            return (
              <View key={alert.id} style={styles.alert}>
                <Icon
                  name={soundConfig.icon as any}
                  size={16}
                  color={alert.enabled ? displayColor : disabledColor}
                />
                <Text style={[styles.alertText, { color: alert.enabled ? displayColor : disabledColor }]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borders.radius.medium,
    padding: theme.spacing.medium,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.small,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.small,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: theme.borders.radius.round,
  },
  title: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
  },
  duration: {
    fontSize: theme.typography.fontSize.large,
    color: theme.colors.white,
  },
  alerts: {
    gap: theme.spacing.xs,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  alertText: {
    fontSize: theme.typography.fontSize.small,
  },
  alertsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.xs,
  },
}); 