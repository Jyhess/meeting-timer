import { useEffect, useRef } from 'react';
import { Platform, Vibration } from 'react-native';
import * as Haptics from 'expo-haptics';

export const useVibration = (isActive: boolean, duration: number) => {
  const vibrationStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let vibrationInterval: NodeJS.Timeout | null = null;
    
    if (isActive) {
      vibrationStartTimeRef.current = Date.now();
      
      if (Platform.OS === 'ios') {
        // Pour iOS, utiliser Haptics avec un intervalle
        vibrationInterval = setInterval(async () => {
          // Vérifier si la durée de vibration est dépassée
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
        // Pour Android, utiliser l'API Vibration avec un pattern qui se répète
        const pattern = [0, 300, 150, 300, 150, 300];
        Vibration.vibrate(pattern, true);
        
        // Arrêter la vibration après la durée spécifiée
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