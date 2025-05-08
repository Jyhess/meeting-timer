import { useEffect, useRef } from 'react';
import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

export const useVibration = (isActive: boolean, duration: number) => {
  const vibrationStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let vibrationInterval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive) {
      vibrationStartTimeRef.current = Date.now();
      
      if (Platform.OS === 'ios') {
        // Pour iOS, utiliser Haptics avec un intervalle
        vibrationInterval = setInterval(async () => {
          // Check if vibration duration is exceeded
          if (vibrationStartTimeRef.current && 
              Date.now() - vibrationStartTimeRef.current >= duration * 1000) {
            if (vibrationInterval) {
              clearInterval(vibrationInterval);
              vibrationInterval = null;
            }
            return;
          }
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }, 500);
      } else if (Platform.OS === 'android') {
        // For Android, use Vibration API with a repeating pattern
        const pattern = [0, 300, 150, 300, 150, 300];
        Vibration.vibrate(pattern, true);
        
        // Stop vibration after specified duration
        setTimeout(() => {
          Vibration.cancel();
        }, duration * 1000);
      }
    }
    
    return () => {
      // Nettoyage
      if (vibrationInterval) {
        clearInterval(vibrationInterval);
      }
      if (Platform.OS !== 'web') {
        Vibration.cancel();
      }
      vibrationStartTimeRef.current = null;
    };
  }, [isActive, duration]);
};