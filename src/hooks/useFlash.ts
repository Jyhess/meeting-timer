import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export const useFlash = () => {
  const [isFlashing, setIsFlashing] = useState(false);
  const [flashTimer, setFlashTimer] = useState<NodeJS.Timeout | null>(null);
  const [flashInterval, setFlashInterval] = useState<NodeJS.Timeout | null>(null);
  const [flashStartTime, setFlashStartTime] = useState<number | null>(null);
  const [flashElapsedTime, setFlashElapsedTime] = useState<number>(0);
  const [progressTimer, setProgressTimer] = useState<number | null>(null);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      stopFlash();
    };
  });

  // Update elapsed time for progress tracking
  useEffect(() => {
    if (isFlashing && flashStartTime) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - flashStartTime) / 1000);
        setFlashElapsedTime(elapsed);
      }, 1000);
      setProgressTimer(timer);
      
      return () => {
        if (progressTimer) {
          clearInterval(progressTimer);
        }
      };
    } else {
      if (progressTimer) {
        clearInterval(progressTimer);
        setProgressTimer(null);
      }
      setFlashElapsedTime(0);
    }
  }, [isFlashing, flashStartTime, progressTimer]);

  const stopFlash = () => {
    if (Platform.OS === 'web') return;
    
    if (flashTimer) {
      clearTimeout(flashTimer);
      setFlashTimer(null);
    }
    
    if (flashInterval) {
      clearInterval(flashInterval);
      setFlashInterval(null);
    }
    
    if (progressTimer) {
      clearInterval(progressTimer);
      setProgressTimer(null);
    }
    
    setIsFlashing(false);
    setFlashStartTime(null);
    setFlashElapsedTime(0);
  };

  // Calculer le pourcentage de progression
  const getFlashProgress = (totalDuration: number) => {
    if (!isFlashing || !flashStartTime) return 0;
    
    if (isNaN(totalDuration) || totalDuration <= 0) return 0;
    
    const elapsed = (Date.now() - flashStartTime) / 1000;
    const progress = Math.min(elapsed / totalDuration, 1);
    return progress * 100;
  };

  return {
    isFlashing,
    flashElapsedTime,
    stopFlash,
    getFlashProgress,
  };
};