import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { TimerPreset } from '../../types/timer';
import { Icon } from './Icon';
import { styles } from '../../styles/PresetList.styles';

type PresetListProps = {
  presets: TimerPreset[];
  onSelectPreset: (preset: TimerPreset) => void;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const PresetList = ({ presets, onSelectPreset }: PresetListProps) => {
  if (presets.length === 0) return null;

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presetScroll}
      >
        {presets.map((preset) => (
          <Pressable
            key={preset.id}
            style={styles.presetButton}
            onPress={() => onSelectPreset(preset)}
          >
            <Text style={styles.presetTime}>{formatTime(preset.seconds)}</Text>
            <View style={styles.alertIcons}>
              {preset.alerts.filter(a => a.enabled).map((alert) => {
                const icon = alert.id === 'before' ? 'notifications' :
                           alert.id === 'end' ? 'target' :
                           'crisis_alert';
                return (
                  <Icon
                    key={alert.id}
                    name={icon}
                    size={20}
                    style={styles.alertIcon}
                  />
                );
              })}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};