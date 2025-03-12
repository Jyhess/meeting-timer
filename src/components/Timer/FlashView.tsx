import React, { useEffect, useRef, useImperativeHandle, useState, forwardRef } from 'react';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
  useSharedValue,
} from 'react-native-reanimated';


export interface FlashViewRef {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export type FlashViewProps = {
  effectDuration: number;
}

export const FlashView = forwardRef<FlashViewRef, FlashViewProps>(({ effectDuration }, ref) => {  
  const [isAnimated, setIsAnimated] = useState(false);
  const flashBackground = useSharedValue(0);

  useImperativeHandle(ref, () => ({
    startAnimation: () => {
      startFlashAnimation();
    },
    stopAnimation: () => {
      stopFlashAnimation();
    }
  }));

  useEffect(() => {
    return () => {
      stopFlashAnimation();
    };
  }, []);

  const startFlashAnimation = () => {
    // Arrêter toute animation précédente
    if(isAnimated) {return;}

    stopFlashAnimation();
    setIsAnimated(true);
    // Démarrer l'animation de flash
    flashBackground.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 250, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 250, easing: Easing.in(Easing.ease) })
      ),
      -1 // Répéter indéfiniment
    );
  };

  const stopFlashAnimation = () => {
    // Annuler l'animation
    setIsAnimated(false);
    cancelAnimation(flashBackground);
    flashBackground.value = 0;
  };

  const animatedFlashStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'white',
      opacity: flashBackground.value * 0.7,
      zIndex: 1,
    };
  });

  return <Animated.View style={animatedFlashStyle} />;
});

export default FlashView;
