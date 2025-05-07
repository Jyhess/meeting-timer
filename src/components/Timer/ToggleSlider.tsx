import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { styles } from '../../styles/ToggleSlider.styles';
import { theme } from '../../theme';

type ToggleSliderProps = {
  value: boolean;
  onToggle: (value: boolean) => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ToggleSlider = ({ value, onToggle }: ToggleSliderProps) => {
  const translateX = useSharedValue(value ? 28 : 0);

  const panGesture = Gesture.Pan()
    .onStart(() => {})
    .onUpdate((event) => {
      translateX.value = Math.max(0, Math.min(28, event.translationX + (value ? 28 : 0)));
    })
    .onEnd(() => {
      const shouldToggle = translateX.value > 14;
      if (shouldToggle !== value) {
        runOnJS(onToggle)(shouldToggle);
      }
      translateX.value = withTiming(shouldToggle ? 28 : 0, { duration: theme.animations.duration.short });
    });

  useEffect(() => {
    translateX.value = withTiming(value ? 28 : 0, { duration: theme.animations.duration.short });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: value 
      ? `rgba(${parseInt(theme.colors.primary.slice(1, 3), 16)}, ${parseInt(theme.colors.primary.slice(3, 5), 16)}, ${parseInt(theme.colors.primary.slice(5, 7), 16)}, 0.9)`
      : 'rgba(255, 255, 255, 0.1)',
  }));

  const handlePress = () => {
    onToggle(!value);
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.sliderTrack, backgroundStyle]}>
        <AnimatedPressable
          style={[styles.sliderThumb, sliderStyle]}
          onPress={handlePress}
        />
        <Pressable
          style={styles.touchArea}
          onPress={handlePress}
        />
      </Animated.View>
    </GestureDetector>
  );
};