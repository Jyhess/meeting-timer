import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { sounds } from '../../config/alerts';
import { Icon } from './Icon';
import { TimerPreset } from '../../types/timer';
import { Alert } from '../../types/alerts';
import { formatTimeFromSeconds } from '../../utils/time';
import { theme } from '../../theme';

type PresetCardProps = {
  preset: TimerPreset;
  onEdit?: (preset: TimerPreset) => void;
  onDelete?: (preset: TimerPreset) => void;
  onMove?: (preset: TimerPreset, direction: 'left' | 'right') => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
};

export const PresetCard = ({ 
  preset, 
  onEdit, 
  onDelete, 
  onMove,
  canMoveLeft = true,
  canMoveRight = true
}: PresetCardProps) => {
  const { alerts, color } = preset;
  const displayColor = color ? color : theme.colors.gray.dark;
  const cardColor = color ? displayColor + '33' : theme.colors.gray.light;
  // La couleur disabled est la couleur de display avec 50% de transparence
  const disabledColor = `${displayColor}50`;

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

      {(onEdit || onDelete || onMove) && (
        <View style={styles.actions}>
          {onMove && (
            <Pressable
            style={styles.actionButton}
            onPress={() => onMove(preset, 'left')}
              disabled={!canMoveLeft}
            >
              <Icon name="arrow_left" size={30} color={canMoveLeft ? theme.colors.white : theme.colors.gray.dark} />
            </Pressable>
          )}
          {onEdit && (
            <Pressable
              style={styles.actionButton}
              onPress={() => onEdit(preset)}
            >
              <Icon name="edit" size={20} color={theme.colors.white} />
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              style={styles.actionButton}
              onPress={() => onDelete(preset)}
            >
              <Icon name="delete" size={20} color={theme.colors.white} />
            </Pressable>
          )}
          {onMove && (
            <Pressable
            style={styles.actionButton}
            onPress={() => onMove(preset, 'right')}
              disabled={!canMoveRight}
            >
              <Icon name="arrow_right" size={30} color={canMoveRight ? theme.colors.white : theme.colors.gray.dark} />
            </Pressable>
          )}
        </View>
      )}
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
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: theme.spacing.medium,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 