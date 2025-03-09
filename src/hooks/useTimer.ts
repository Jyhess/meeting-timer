import { useCallback, useEffect, useState } from 'react';
import { useAudio } from './useAudio';
import { Alert, TimerState } from '../types/timer';
import { TimerManager } from '../utils/TimerManager';

export const useTimer = (
  timerManagerRef: React.RefObject<TimerManager>,
  duration: number,
  beforeAlert?: Alert,
  endAlert?: Alert,
  afterAlert?: Alert
) => {
  const [state, setState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState(duration);

  // Hooks audio
  const beforeAlertSound = useAudio(beforeAlert?.sound || 'bell');
  const endAlertSound = useAudio(endAlert?.sound || 'gong');
  const afterAlertSound = useAudio(afterAlert?.sound || 'alarm');

  // Configuration des écouteurs d'événements
  useEffect(() => {
    if (!timerManagerRef.current) return;

    const onStateChange = (newState: TimerState) => {
      console.log('[useTimer] ⚡ État du timer modifié:', newState);
      setState(newState);
    };

    const onTimeChange = (newTime: number) => setTimeLeft(newTime);
    const onAlert = ({ type, sound }: { type: string; sound: string }) => {
      const audioPlayer = {
        before: beforeAlertSound,
        end: endAlertSound,
        after: afterAlertSound
      }[type];
      
      audioPlayer?.playSound();
    };

    timerManagerRef.current.addEventListener('stateChange', onStateChange);
    timerManagerRef.current.addEventListener('timeChange', onTimeChange);
    timerManagerRef.current.addEventListener('alert', onAlert);

    return () => {
      if (timerManagerRef.current) {
        timerManagerRef.current.removeEventListener('stateChange', onStateChange);
        timerManagerRef.current.removeEventListener('timeChange', onTimeChange);
        timerManagerRef.current.removeEventListener('alert', onAlert);
      }
    };
  }, [beforeAlertSound, endAlertSound, afterAlertSound]);

  // Synchronisation des changements de configuration
  useEffect(() => {
    if (timerManagerRef.current) {
      timerManagerRef.current.updateConfig(duration, beforeAlert, endAlert, afterAlert);
    }
  }, [duration, beforeAlert, endAlert, afterAlert]);

  // Actions
  const start = useCallback(() => {
    timerManagerRef.current?.start();
  }, []);

  const pause = useCallback(() => {
    timerManagerRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    timerManagerRef.current?.resume();
  }, []);

  const reset = useCallback(() => {
    timerManagerRef.current?.reset();
  }, []);

  const updateTime = useCallback((newTime: number) => {
    timerManagerRef.current?.setTimeLeft(newTime);
  }, []);

  return {
    timeLeft,
    isRunning: state !== 'idle' && state !== 'finished',
    state,
    actions: {
      start,
      pause,
      resume,
      reset,
      setTimeLeft: updateTime,
    },
  };
};