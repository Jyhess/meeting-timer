import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
  withTiming,
  useSharedValue,
  useAnimatedProps,
  Easing,
} from 'react-native-reanimated';
import { theme } from '../../theme';
import Svg, { Polyline } from 'react-native-svg';
import { polylinePath } from '../../utils/polyline';
import { useTimer } from '@/src/contexts/TimerContext';
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

export function CircularProgress() {
  const {
    duration,
    timeLeft,
    isRunning,
    beforeAlert,
    afterAlert,
  } = useTimer();

  const [size, setSize] = useState({width: 0, height: 0});
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({width: width, height: height});
  };

  const progress = useSharedValue(0);
  const progressShape = useSharedValue('0,0 0,0');
  const progressNegative = useSharedValue(0);
  const progressShapeNegative = useSharedValue('0,0 0,0');

  const getAnimetedValue = (remaining: number, currentProgress: number) => {
    if(remaining - currentProgress < 0)
    {
      return withTiming(
        remaining - (1/duration),
        {
          duration: 1000,
          easing: Easing.out(Easing.quad),
        }
      );
    }
    else
    {
      return withTiming(
        remaining,
        { 
          duration: 1000,
          easing: Easing.linear,
        }
      );
    }
  };

  React.useEffect(() => {
    if(timeLeft >= 1)
    {
      const remaining = 1 - ((timeLeft-1) / duration);
      progress.value = getAnimetedValue(remaining, progress.value);
    }
    else if(timeLeft > (-duration))
    {
      const remaining = 1 - ((duration+timeLeft-1) / duration);
      progressNegative.value = getAnimetedValue(remaining, progressNegative.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, duration, isRunning]);

  useEffect(() => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
    animationRef.current = setInterval(() => {
      // Some refresh glitch happens with Android, so we check if the size is valid
      if (size.width <= 0 || size.height <= 0) {
        return;
      }
      progressShape.value = polylinePath(size, progress.value)
        .map((point: { x: number; y: number }) => `${point.x},${point.y}`)
        .join(' ');
      progressShapeNegative.value = polylinePath(size, progressNegative.value)
        .map((point: { x: number; y: number }) => `${point.x},${point.y}`)
        .join(' ');
    }, 16);
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, size]);


  const beforeAlertAngle = (1-(beforeAlert.timeOffset || 0) / duration);
  const afterAlertAngle = ((afterAlert.timeOffset || 0) / duration);

  const animatedProps = useAnimatedProps(() => ({
    points: progressShape.value,
    fill: 'red',
    opacity: 0.7,
  }));

  const animatedProps2 = useAnimatedProps(() => ({
    points: progressShapeNegative.value,
    fill: 'black',
    opacity: 0.7,
  }));

  return (
    <View style={[styles.container]} onLayout={onLayout}>
      <Svg width='100%' height='100%' style = {{backgroundColor: theme.colors.secondary}}>
        <Polyline
          points={polylinePath(size, beforeAlertAngle).map((point: { x: number; y: number }) => `${point.x},${point.y}`).join(' ')}
          fill={theme.colors.primary}
        />
        <AnimatedPolyline
          animatedProps={animatedProps as any}
        />
        {timeLeft < 1 && (
          <>
            <Polyline
              points={polylinePath(size, afterAlertAngle).map((point: { x: number; y: number }) => `${point.x},${point.y}`).join(' ')}
              fill={theme.colors.danger}
            />
            <AnimatedPolyline
              animatedProps={animatedProps2 as any}
            />
          </>
        )}
      </Svg>
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
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 