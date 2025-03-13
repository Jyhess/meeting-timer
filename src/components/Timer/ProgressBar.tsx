import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import { theme } from '../../theme';

interface ProgressBarProps {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  beforeAlertOffset?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  duration,
  timeLeft,
  isRunning,
  beforeAlertOffset,
}) => {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    if (isRunning) {
      progress.value = withTiming(
        1 - (timeLeft / duration),
        { 
          duration: 1000,
          easing: Easing.linear,
        }
      );
    } else {
      progress.value = withTiming(
        1 - (timeLeft / duration),
        { 
          duration: 0,
        }
      );
    }
  }, [timeLeft, duration, isRunning]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: `${progress.value * 100}%`,
      backgroundColor: `${theme.colors.danger}`,
    };
  });

  return (
    <View style={styles.container}>
        <View style={[styles.greenProgress, { height: `${(duration - (beforeAlertOffset || 0)) / duration * 100}%` }]} />
        <View style={[styles.orangeProgress, { height: `${(beforeAlertOffset || 0) / duration * 100}%` }]} />
        <Animated.View style={[styles.progress, animatedStyle]}>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    //backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    //zIndex: 1,
  },
  greenProgress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: 0.8,
    backgroundColor: theme.colors.primary,
  },
  orangeProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0.8,
    backgroundColor: theme.colors.secondary,
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: 1,
  },
}); 