import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Alert } from '../../types/timer';
import { ToggleSlider } from './ToggleSlider';
import { useAudio } from '../../hooks/useAudio';
import { sounds } from '../../config/alerts';
import { Icon } from './Icon';
import { styles } from '../../styles/AlertIcon.styles';

type AlertIconProps = {
  alert: Alert;
  isActive: boolean;
  onPress: () => void;
  onToggle: (enabled: boolean) => void;
};

const AnimatedView = Animated.createAnimatedComponent(View);

export const AlertIcon = ({ alert, isActive, onPress, onToggle }: AlertIconProps) => {
  const { isPlaying, stopSound } = useAudio(alert.sound);
  const soundConfig = sounds.find(s => s.id === alert.sound);

  const getAlertTimeText = () => {
    if (alert.id === 'end') return 'Fin';
    if (alert.id === 'before') return `-${alert.timeOffset}min`;
    return `+${alert.timeOffset}min`;
  };

  const flashAnimation = useAnimatedStyle(() => {
    if (isActive && alert.effect === 'flash') {
      return {
        opacity: withRepeat(
          withSequence(
            withTiming(0.3, { duration: 250 }),
            withTiming(1, { duration: 250 })
          ),
          -1
        ),
      };
    }
    return { opacity: 1 };
  });

  const pulseAnimation = useAnimatedStyle(() => {
    if (isActive && alert.effect === 'pulse') {
      return {
        transform: [{
          scale: withRepeat(
            withSequence(
              withTiming(1.2, { duration: 500, easing: Easing.out(Easing.ease) }),
              withTiming(1, { duration: 500, easing: Easing.in(Easing.ease) })
            ),
            -1
          ),
        }],
      };
    }
    return { transform: [{ scale: 1 }] };
  });

  const shakeAnimation = useAnimatedStyle(() => {
    if (isActive && alert.effect === 'shake') {
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

  return (
    <View style={styles.alertItemContainer}>
      <View style={styles.alertIconContainer}>
        <Pressable onPress={onPress}>
          <AnimatedView 
            style={[
              styles.alertIcon,
              !alert.enabled && styles.alertIconDisabled,
              isActive && styles.alertIconActive,
              alert.effect === 'flash' && flashAnimation,
              alert.effect === 'pulse' && pulseAnimation,
              alert.effect === 'shake' && shakeAnimation,
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
              isActive && styles.alertTimeActive
            ]}>
              {getAlertTimeText()}
            </Text>
          </AnimatedView>
        </Pressable>
        {isPlaying && (
          <View style={styles.stopSoundButtonContainer}>
            <Pressable 
              style={styles.stopSoundButton}
              onPress={stopSound}
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