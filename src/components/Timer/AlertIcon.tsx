import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Alert } from '../../types/alerts';
import { ToggleSlider } from './ToggleSlider';
import { sounds } from '../../config/alerts';
import { Icon } from './Icon';
import { styles } from '../../styles/AlertIcon.styles';
import { theme } from '../../theme';
import { formatTimeFromSeconds } from '@/src/utils/time';

type AlertIconProps = {
  alert: Alert;
  isActive: boolean;
  onPress: () => void;
  onToggle: (enabled: boolean) => void;
  timeColor?: string;
};

const AnimatedView = Animated.createAnimatedComponent(View);

export const AlertIcon = ({ alert, isActive, onPress, onToggle, timeColor }: AlertIconProps) => {
  const soundConfig = sounds.find(s => s.id === alert.sound);
  const [localEnabled, setLocalEnabled] = useState(alert.enabled);
  
  // Synchronize local state with alert state
  useEffect(() => {
    setLocalEnabled(alert.enabled);
  }, [alert.enabled]);

  const getAlertTimeText = () => {
    if (alert.id === 'end') return 'End';
    const prefix = alert.id === 'before' ? '-' : '+';
    return `${prefix}${formatTimeFromSeconds(alert.timeOffset)}`;
  };

  // Shake animation
  const shakeAnimation = useAnimatedStyle(() => {
    if (isActive && alert.effects.includes('shake')) {
      return {
         transform: [{
          translateX: withRepeat(
            withSequence(
              withTiming(-5, { duration: 100 }),
              withTiming(5, { duration: 100 }),
              withTiming(0, { duration: 100 })
            ),
            -1
          ),
        }],
      };
    }
    return { transform: [{ translateX: 0 }] };
  });

  // Générer des icônes pour les effets actifs
  const renderEffectIcons = () => {
    if (!alert.effects || alert.effects.length === 0) return null;
    
    return (
      <View style={styles.effectIconsContainer}>
        {alert.effects.map(effect => {
          const iconName = 
            effect === 'flash' ? 'flash' :
            effect === 'shake' ? 'vibration' : '';
            
          return (
            <Icon 
              key={effect}
              name={iconName as any}
              size={12}
              color={isActive ? theme.colors.secondary : localEnabled ? theme.colors.white : theme.colors.gray.light}
              style={styles.effectIcon}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.alertItemContainer}>
      <View style={styles.alertIconContainer}>
        <Pressable onPress={onPress}>
          <AnimatedView 
            style={[
              styles.alertIcon,
              !localEnabled && styles.alertIconDisabled,
              isActive && styles.alertIconActive,
              alert.effects.includes('shake') && shakeAnimation,
            ]}
          >
            <Icon 
              name={soundConfig?.icon as any}
              size={28}
              color={isActive ? theme.colors.secondary : localEnabled ? theme.colors.white : theme.colors.gray.light}
            />
            <Text style={[
              styles.alertTime,
              { color: isActive ? theme.colors.secondary : localEnabled ? theme.colors.white : theme.colors.gray.light },
              timeColor && { color: timeColor }
            ]}>
              {getAlertTimeText()}
            </Text>
            {renderEffectIcons()}
          </AnimatedView>
        </Pressable>
      </View>
      <View style={styles.sliderContainer}>
        <ToggleSlider
          value={localEnabled}
          onToggle={(enabled) => {
            setLocalEnabled(enabled);
            onToggle(enabled);
          }}
        />
      </View>
    </View>
  );
};