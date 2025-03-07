import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Vibration, Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Alert } from '../../types/timer';
import { ToggleSlider } from './ToggleSlider';
import { useAudio } from '../../hooks/useAudio';
import { sounds } from '../../config/alerts';
import { Icon } from './Icon';
import { styles } from '../../styles/AlertIcon.styles';
import { useSettings } from '../../hooks/useSettings';

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
  const { isPlaying, stopSound, playSound } = useAudio(alert.sound, alert.customSoundUri);
  const soundConfig = sounds.find(s => s.id === alert.sound);
  const vibrationStartTimeRef = useRef<number | null>(null);
  const { defaultAlertDuration } = useSettings();
  
  // Utiliser la durée de vibration spécifique à l'alerte ou la valeur par défaut
  const vibrationDuration = alert.vibrationDuration || defaultAlertDuration || 5;

  // Sound and vibration effect
  useEffect(() => {
    let vibrationInterval: NodeJS.Timeout | null = null;
    
    if (isActive && alert.enabled) {
      // Play sound
      playSound();
      
      // Configure vibration if effect includes "shake" and on mobile
      if (alert.effects.includes('shake') && Platform.OS !== 'web') {
        vibrationStartTimeRef.current = Date.now();
        
        if (Platform.OS === 'ios') {
          // For iOS, use Haptics with an interval
          vibrationInterval = setInterval(async () => {
            // Vérifier si la durée de vibration est dépassée
            if (vibrationStartTimeRef.current && 
                Date.now() - vibrationStartTimeRef.current >= vibrationDuration * 1000) {
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
          }, vibrationDuration * 1000);
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
  }, [isActive, alert.enabled, alert.effects, vibrationDuration]);

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
              color={isActive ? '#fff' : alert.enabled ? '#999' : '#333'}
              style={styles.effectIcon}
            />
          );
        })}
      </View>
    );
  };

  // Fonction pour arrêter le son et les effets
  const handleStopAll = () => {
    stopSound();
    
    // Arrêter les vibrations
    if (Platform.OS !== 'web') {
      Vibration.cancel();
    }
    
    // Notifier le parent pour arrêter les effets visuels
    if (onStopEffects) {
      onStopEffects();
    }
  };

  return (
    <View style={styles.alertItemContainer}>
      <View style={styles.alertIconContainer}>
        <Pressable onPress={onPress}>
          <AnimatedView 
            style={[
              styles.alertIcon,
              !alert.enabled && styles.alertIconDisabled,
              isActive && styles.alertIconActive,
              alert.effects.includes('shake') && shakeAnimation,
            ]}
          >
            <Icon 
              name={soundConfig?.icon as any}
              size={28}
              color={isActive ? '#fff' : alert.enabled ? '#999' : '#333'}
            />
            <Text style={[
              styles.alertTime,
              !alert.enabled && styles.alertTimeDisabled,
              isActive && styles.alertTimeActive,
              timeColor && { color: timeColor }
            ]}>
              {getAlertTimeText()}
            </Text>
            {renderEffectIcons()}
          </AnimatedView>
        </Pressable>
        {isPlaying && (
          <View style={styles.stopSoundButtonContainer}>
            <Pressable 
              style={styles.stopSoundButton}
              onPress={handleStopAll}
            >
              <Icon 
                name="volume-off"
                size={20}
                color="#fff"
              />
            </Pressable>
          </View>
        )}
      </View>
      <View style={styles.sliderContainer}>
        <ToggleSlider
          value={alert.enabled}
          onToggle={onToggle}
        />
      </View>
    </View>
  );
};