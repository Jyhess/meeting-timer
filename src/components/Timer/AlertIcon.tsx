import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

type AlertIconProps = {
  alert: Alert;
  isActive: boolean;
  onPress: () => void;
  onToggle: (enabled: boolean) => void;
};

const AnimatedView = Animated.createAnimatedComponent(View);

export const AlertIcon = ({ alert, isActive, onPress, onToggle }: AlertIconProps) => {
  const { isPlaying, stopSound } = useAudio(alert.sound);

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
            <Ionicons 
              name={
                alert.sound === 'gong' ? 'disc-outline' :
                alert.sound === 'bell' ? 'notifications-outline' :
                'musical-note-outline'
              }
              size={28}
              color={isActive ? '#fff' : alert.enabled ? '#999' : '#333'}
            />
            <Text style={[
              styles.alertTime,
              !alert.enabled && styles.alertTimeDisabled,
              isActive && styles.alertTimeActive
            ]}>
              {alert.id === 'end' ? 'Fin' :
               alert.id === 'before' ? `-${Math.abs(alert.timeOffset)}min` :
               `+${alert.timeOffset}min`}
            </Text>
          </AnimatedView>
        </Pressable>
        {isPlaying && (
          <View style={styles.stopSoundButtonContainer}>
            <Pressable 
              style={styles.stopSoundButton}
              onPress={stopSound}
            >
              <Ionicons 
                name="volume-mute" 
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

const styles = StyleSheet.create({
  alertItemContainer: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    borderRadius: 16,
    minWidth: 100,
  },
  alertIconContainer: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
  },
  alertIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  alertIconActive: {
    opacity: 1,
  },
  alertIconDisabled: {
    opacity: 0.5,
  },
  alertTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  alertTimeActive: {
    color: '#fff',
    fontWeight: '700',
  },
  alertTimeDisabled: {
    color: '#555',
  },
  sliderContainer: {
    width: 50,
    alignItems: 'center',
    marginTop: 4,
  },
  stopSoundButtonContainer: {
    position: 'absolute',
    top: -12,
    right: 0,
    zIndex: 1,
  },
  stopSoundButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
  },
});