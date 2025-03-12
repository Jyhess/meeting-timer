import React from 'react';
import { View, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { TimerPreset } from '../../types/timer';
import { ALERT_SOUNDS } from '../../types/alerts';
import { Icon } from './Icon';
import { formatTimeFromSeconds } from '../../utils/time';

type PresetCardProps = {
  preset: TimerPreset;
  style?: StyleProp<ViewStyle>;
  timeStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  iconSize?: number;
};

export const PresetCard = ({ 
  preset, 
  style, 
  timeStyle,
  iconColor = "#fff",
  iconSize = 20 
}: PresetCardProps) => {
  return (
    <View style={style}>
      <Text style={timeStyle}>
        {formatTimeFromSeconds(preset.seconds)}
      </Text>
      <View style={{ flexDirection: 'row', gap: 4, justifyContent: 'center' }}>
        {preset.alerts
          .map((alert) => (
            <Icon
              key={alert.id}
              name={ALERT_SOUNDS[alert.sound].iconName as any}
              size={iconSize}
              color={alert.enabled ? iconColor : "#777"}
            />
          ))}
      </View>
    </View>
  );
}; 