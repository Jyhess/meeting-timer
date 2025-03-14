import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, { 
  withTiming,
  useSharedValue,
  useAnimatedProps,
  Easing,
  useDerivedValue,
} from 'react-native-reanimated';
import { theme } from '../../theme';
import Svg, { Polyline } from 'react-native-svg';

const AnimatedPolyline = Animated.createAnimatedComponent(Polyline);

interface CircularProgressProps {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  beforeAlertOffset?: number;
  afterAlertOffset?: number;
  size?: number;
}

const polylinePath = (size: {width: number, height: number}, percentage: number): Array<{x: number, y: number}> => {

  const angle = (Math.PI * 2) - ((percentage) * Math.PI * 2);
  const angle1 = Math.atan2(size.height, size.width);
  const angle2 = Math.atan2(size.height, -size.width);
  const angle3 = angle1 + Math.PI;
  const angle4 = angle2 + Math.PI;

  const center = {x: size.width/2, y: size.height/ 2};
  let points: Array<{x: number, y: number}> = [
    {x: center.x, y: center.y},
    {x: size.width, y: center.y},
  ];

  if (angle < angle1) {
    points.push({x: size.width, y: size.height});
    points.push({x: 0, y: size.height});
    points.push({x: 0, y: 0});
    points.push({x: size.width, y: 0});
    points.push({x: size.width, y: center.y - (size.width/2) * Math.tan(angle)});
  }
  else if (angle < angle2) {
    points.push({x: size.width, y: size.height});
    points.push({x: 0, y: size.height});
    points.push({x: 0, y: 0});
    points.push({x: center.x + (size.height/2) / Math.tan(angle), y: 0});
  }
  else if (angle < angle3) {
    points.push({x: size.width, y: size.height});
    points.push({x: 0, y: size.height});
    points.push({x: 0, y: center.y + (size.width/2) * Math.tan(angle)});
  }
  else if (angle < angle4) {
    points.push({x: size.width, y: size.height});
    points.push({x: center.x - (size.height/2) / Math.tan(angle), y: size.height});
  }
  else{
    points.push({x: size.width, y: center.y - (size.width/2) * Math.tan(angle)});
  }
  points.push({x: center.x, y: center.y});
  return points;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  duration,
  timeLeft,
  isRunning,
  beforeAlertOffset,
  afterAlertOffset,
}) => {
  const [size, setSize] = useState({width: 0, height: 0});
  const animationRef = useRef<NodeJS.Timeout>();

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({width: width, height: height});
  };

  const progress = useSharedValue(0);
  const progressShape = useSharedValue('0,0 0,0');
  const progressNegative = useSharedValue(0);
  const progressShapeNegative = useSharedValue('0,0 0,0');

  React.useEffect(() => {
    if (isRunning) {
      progress.value = withTiming(
        timeLeft < 0 ? 1 : 1 - (timeLeft / duration),
        { 
          duration: 1000,
          easing: Easing.linear,
        }
      );
    }
  }, [timeLeft, duration, isRunning]);

  React.useEffect(() => {
    if (isRunning && timeLeft < 0) {
      progressNegative.value = withTiming(
        1 - ((duration+timeLeft) / duration),
        { 
          duration: 1000,
          easing: Easing.linear,
        }
      );
    }
  }, [timeLeft, duration, isRunning]);

  useEffect(() => {
    if (isRunning) {
      animationRef.current = setInterval(() => {
        // Some refresh glitch happens with Android, so we check if the size is valid
        if (size.width <= 0 || size.height <= 0) {
          return;
        }
        progressShape.value = polylinePath(size, progress.value)
          .map(point => `${point.x},${point.y}`)
          .join(' ');
        progressShapeNegative.value = polylinePath(size, progressNegative.value)
          .map(point => `${point.x},${point.y}`)
          .join(' ');
      }, 16);
    }
    else {
      clearInterval(animationRef.current);
    }
  }, [isRunning, size]);


  const beforeAlertAngle = (1-(beforeAlertOffset || 0) / duration);
  const afterAlertAngle = ((afterAlertOffset || 0) / duration);

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
      <Svg width='100%' height='100%' style = {{backgroundColor: 'orange'}}>
        <Polyline
          points={polylinePath(size, beforeAlertAngle).map(point => `${point.x},${point.y}`).join(' ')}
          fill='green'
        />
        <AnimatedPolyline
          animatedProps={animatedProps as any}
        />
        {timeLeft < 0 && (
          <>
            <Polyline
              points={polylinePath(size, afterAlertAngle).map(point => `${point.x},${point.y}`).join(' ')}
              fill='red'
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