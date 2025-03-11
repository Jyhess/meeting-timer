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
  const flashTimerRef = useRef<NodeJS.Timeout | null>(null);

  useImperativeHandle(ref, () => ({
    startAnimation: () => {
      setIsAnimated(true);
    },
    stopAnimation: () => {
      setIsAnimated(false);
    }
  }));

  // Gérer l'effet de flash
  useEffect(() => {
    if (!isAnimated) {
      stopFlashAnimation();
      return;
    }

    startFlashAnimation();

    setTimeout(() => {
        stopFlashAnimation();
    }, effectDuration * 1000);

    return () => {
      stopFlashAnimation();
    };
  }, [isAnimated, effectDuration]);

  const startFlashAnimation = () => {
    // Arrêter toute animation précédente
    stopFlashAnimation();

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
    cancelAnimation(flashBackground);
    flashBackground.value = 0;

    // Nettoyer le timer
    if (flashTimerRef.current) {
      clearTimeout(flashTimerRef.current);
      flashTimerRef.current = null;
    }
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
