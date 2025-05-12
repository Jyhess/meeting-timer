import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Alert, getAlertTimeText, getAlertTitle } from '@/src/types/alerts';
import { ToggleSlider } from './ToggleSlider';
import { sounds } from '../../types/sounds';
import { Icon } from '../common/Icon';
import { styles } from '../../styles/AlertIcon.styles';
import { theme } from '../../theme';
import { useTranslation } from '../../hooks/useTranslation';


type AlertIconProps = {
  alert: Alert;
  isActive: boolean;
  onPress: () => void;
  onToggle: (enabled: boolean) => void;
  timeColor?: string;
  isRunning: boolean;
};

export const AlertIcon = ({ alert, isActive, onPress, onToggle, timeColor, isRunning }: AlertIconProps) => {
  const soundConfig = sounds[alert.sound];
  const [localEnabled, setLocalEnabled] = useState(alert.enabled);
  const { t } = useTranslation();

  // Synchronize local state with alert state
  useEffect(() => {
    setLocalEnabled(alert.enabled);
  }, [alert.enabled]);

  return (
    <Pressable onPress={onPress}>
      <View 
        style={[
          styles.alertItemContainer,
        ]}
      >
        <View style={styles.timeContainer}>
          <Text style={[
            styles.alertTime,
            { color: isActive ? theme.colors.secondary : localEnabled ? theme.colors.white : theme.colors.gray.light },
            timeColor && { color: timeColor }
          ]}>
            {getAlertTimeText(alert)}
          </Text>
        </View>

        <View style={[
          styles.colorDot,
          { backgroundColor: alert.color }
        ]} />

        <View style={styles.nameContainer}>
          <Text style={[
            styles.alertName,
            { color: isActive ? theme.colors.secondary : localEnabled ? theme.colors.white : theme.colors.gray.light }
          ]}>
            {alert.name || t(getAlertTitle(alert))}
          </Text>
        </View>

        <Icon 
          name={soundConfig?.icon as any}
          size={theme.layout.smallIconSize}
          color={isActive ? theme.colors.secondary : localEnabled ? theme.colors.white : theme.colors.gray.light}
          style={styles.soundIcon}
        />

        {isRunning && (
          <View style={styles.sliderContainer}>
            <ToggleSlider
              value={localEnabled}
            onToggle={(enabled) => {
              setLocalEnabled(enabled);
              onToggle(enabled);
            }}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};