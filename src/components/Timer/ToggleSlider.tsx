import React, { useEffect } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

type ToggleSliderProps = {
  value: boolean;
  onToggle: (value: boolean) => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ToggleSlider = ({ value, onToggle }: ToggleSliderProps) => {
  const translateX = useSharedValue(value ? 28 : 0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {},
    onActive: (event) => {
      translateX.value = Math.max(0, Math.min(28, event.translationX + (value ? 28 : 0)));
    },
    onEnd: () => {
      const shouldToggle = translateX.value > 14;
      if (shouldToggle !== value) {
        runOnJS(onToggle)(shouldToggle);
      }
      translateX.value = withTiming(shouldToggle ? 28 : 0, { duration: 100 });
    },
  });

  useEffect(() => {
    translateX.value = withTiming(value ? 28 : 0, { duration: 200 });
  }, [value]);

  const sliderStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: value 
      ? 'rgba(76, 175, 80, 0.9)' 
      : 'rgba(255, 255, 255, 0.1)',
  }));

  const handlePress = () => {
    onToggle(!value);
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
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
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  sliderTrack: {
    width: 50,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    padding: 2,
  },
  sliderThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  touchArea: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
});