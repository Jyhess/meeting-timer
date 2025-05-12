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
import { polylinePath, polylinePathToEnd } from '../../utils/polyline';
import { useTimer } from '@/src/contexts/TimerContext';
import { Alert } from '../../types/alerts';
const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

export function CircularProgress() {
  const {
    duration,
    timeLeft,
    isRunning,
    alerts,
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
    // When the timer is reset, we need to reset the progress
    if( timeLeft == duration)
    {
      progress.value = 0;
      progressNegative.value = 0;
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

  const beforeAlerts = alerts.filter(a => a.type === 'before');
  const afterAlerts = alerts.filter(a => a.type === 'after').sort((a, b) => (b.timeOffset || 0) - (a.timeOffset || 0));

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

  const renderBeforeAlerts = () => {
    return beforeAlerts.map((alert: Alert) => {
      const angle = 1 - ((alert.timeOffset || 0) / duration);
      const points = polylinePathToEnd(size, angle)
        .map((point: { x: number; y: number }) => `${point.x},${point.y}`)
        .join(' ');

      return (
        <Polyline
          key={alert.id}
          points={points}
          fill={alert.color || theme.colors.white}
        />
      );
    });
  };

  const renderAfterAlerts = () => {
    return afterAlerts.map((alert: Alert) => {
      const angle = (alert.timeOffset || 0) / duration;
      const points = polylinePath(size, angle)
        .map((point: { x: number; y: number }) => `${point.x},${point.y}`)
        .join(' ');

      return (
        <Polyline
          key={alert.id}
          points={points}
          fill={alert.color || theme.colors.white}
        />
      );
    });
  };

  return (
    <View style={[styles.container]} onLayout={onLayout}>
      <Svg width='100%' height='100%' style = {{backgroundColor: theme.colors.primary}}>
        {renderBeforeAlerts()}
        <AnimatedPolyline
          animatedProps={animatedProps as any}
        />
        {timeLeft < 1 && afterAlerts.length > 0 && (
          <>
            {renderAfterAlerts()}
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