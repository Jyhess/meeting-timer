import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Vibration, Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Alert } from '../../types/timer';
import { ToggleSlider } from './ToggleSlider';
import { useAudio } from '../../hooks/useAudio';
import { sounds } from '../../config/alerts';
import { Icon } from './Icon';
import { styles } from '../../styles/AlertIcon.styles';
import { useSettings } from '../../hooks/useSettings';
import { theme } from '../../theme';

type AlertIconProps = {
  alert: Alert;
  isActive: boolean;
  onPress: () => void;
  onToggle: (enabled: boolean) => void;
  timeColor?: string;
  onStopEffects?: () => void;
};

const AnimatedView = Animated.createAnimatedComponent(View);

export const AlertIcon = ({ alert, isActive, onPress, onToggle, timeColor, onStopEffects }: AlertIconProps) => {
  const soundConfig = sounds.find(s => s.id === alert.sound);
  const vibrationStartTimeRef = useRef<number | null>(null);
  const { defaultAlertDuration } = useSettings();
  const [localEnabled, setLocalEnabled] = useState(alert.enabled);
  
  // Synchroniser l'état local avec l'état de l'alerte
  useEffect(() => {
    setLocalEnabled(alert.enabled);
  }, [alert.enabled]);

  // Sound and vibration effect
  useEffect(() => {
    let vibrationInterval: NodeJS.Timeout | null = null;
    
    if (isActive && alert.enabled) {
      console.log(`[AlertIcon] 🔔 Alerte active et active: ${isActive} et enabled: ${alert.enabled}`);
    
      // Configure vibration if effect includes "shake" and on mobile
      if (alert.effects.includes('shake') && Platform.OS !== 'web') {
        vibrationStartTimeRef.current = Date.now();
        
        if (Platform.OS === 'ios') {
          // For iOS, use Haptics with an interval
          vibrationInterval = setInterval(async () => {
            // Vérifier si la durée de vibration est dépassée
            if (vibrationStartTimeRef.current && 
                Date.now() - vibrationStartTimeRef.current >= defaultAlertDuration * 1000) {
              if (vibrationInterval) {
                clearInterval(vibrationInterval);
                vibrationInterval = null;
              }
              return;
            }
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          }, 500);
        } else {
          // For Android, use Vibration API with a pattern that will repeat
          // for the specified duration
          const pattern = [0, 300, 150, 300, 150, 300];
          Vibration.vibrate(pattern, true);
          
          // Set a timeout to stop vibration after the specified duration
          setTimeout(() => {
            Vibration.cancel();
          }, defaultAlertDuration * 1000);
        }
      }
    }
    
    return () => {
      // Clean up vibration
      if (vibrationInterval) {
        clearInterval(vibrationInterval);
      }
      if (Platform.OS !== 'web') {
        Vibration.cancel();
      }
      vibrationStartTimeRef.current = null;
    };
  }, [isActive, alert.enabled, alert.effects, defaultAlertDuration]);

  const getAlertTimeText = () => {
    if (alert.id === 'end') return 'Fin';
    if (alert.id === 'before') return `-${alert.timeOffset} min`;
    return `+${alert.timeOffset} min`;
  };

  // Suppression de l'animation de pulsation
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