import { useCallback, useEffect, useState } from 'react';
import { useAudio } from './useAudio';
import { useVibration } from './useVibration';
import { Alert, TimerState } from '../types/timer';
import { TimerManager } from '../utils/TimerManager';

export const useTimer = (
  timerManagerRef: React.RefObject<TimerManager>,
  duration: number
) => {
  const [state, setState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState(duration);
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);

  // Hooks audio pour les différents types d'alertes
  const beforeAlertSound = useAudio('bell');
  const endAlertSound = useAudio('gong');
  const afterAlertSound = useAudio('alarm');

  // Hook de vibration
  const shouldVibrate = activeAlert?.effects.includes('shake') ?? false;
  useVibration(
    shouldVibrate && state === 'running',
    timerManagerRef.current?.getEffectDuration() ?? 0
  );

  // Configuration des écouteurs d'événements
  useEffect(() => {
    if (!timerManagerRef.current) return;

    const onStateChange = (newState: TimerState) => {
      console.log('[useTimer] ⚡ État du timer modifié:', newState);
      setState(newState);
      if (newState !== 'running') {
        setActiveAlert(null);
      }
    };

    const onTimeChange = (newTime: number) => setTimeLeft(newTime);
    const onAlert = ({ type, sound }: { type: string; sound: string }) => {
      const alert = {
        before: timerManagerRef.current?.getBeforeAlert(),
        end: timerManagerRef.current?.getEndAlert(),
        after: timerManagerRef.current?.getAfterAlert()
      }[type];

      if (alert && alert.enabled) {
        setActiveAlert(alert);
        const audioPlayer = {
          before: beforeAlertSound,
          end: endAlertSound,
          after: afterAlertSound
        }[type];
        
        audioPlayer?.playSound();
      }
      else {
        setActiveAlert(null);
      }
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
  }, [beforeAlertSound, endAlertSound, afterAlertSound, timerManagerRef]);

  // Synchronisation des changements de configuration
  useEffect(() => {
    if (timerManagerRef.current) {
      timerManagerRef.current.updateConfig(duration);
    }
  }, [duration]);

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

  const restart = useCallback(() => {
    timerManagerRef.current?.restart();
  }, []);

  const updateTime = useCallback((newTime: number) => {
    timerManagerRef.current?.setTimeLeft(newTime);
  }, []);

  const updateAlert = useCallback((alert: Alert) => {
    timerManagerRef.current?.updateAlert(alert);
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
      restart,
      setTimeLeft: updateTime,
      updateAlert,
    },
  };
};