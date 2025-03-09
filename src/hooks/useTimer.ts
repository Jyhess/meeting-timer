import { useCallback, useEffect, useState } from 'react';
import { useAudio } from './useAudio';
import { Alert, TimerState } from '../types/timer';
import { TimerManager } from '../utils/TimerManager';

const DEFAULT_ALERTS = {
  before: {
    id: 'before',
    name: 'Bientôt fini',
    enabled: true,
    timeOffset: 5,
    sound: 'bell',
    effects: ['flash'],
  },
  end: {
    id: 'end',
    name: 'Temps écoulé',
    enabled: true,
    timeOffset: 0,
    sound: 'gong',
    effects: ['flash'],
  },
  after: {
    id: 'after',
    name: 'Temps dépassé',
    enabled: true,
    timeOffset: 5,
    sound: 'alarm',
    effects: ['shake'],
  },
} as const;

export const useTimer = (
  timerManagerRef: React.RefObject<TimerManager>,
  duration: number
) => {
  const [state, setState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState(duration);

  // Hooks audio pour les différents types d'alertes
  const beforeAlertSound = useAudio('bell');
  const endAlertSound = useAudio('gong');
  const afterAlertSound = useAudio('alarm');

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
    beforeAlert: timerManagerRef.current?.getBeforeAlert() ?? DEFAULT_ALERTS.before,
    endAlert: timerManagerRef.current?.getEndAlert() ?? DEFAULT_ALERTS.end,
    afterAlert: timerManagerRef.current?.getAfterAlert() ?? DEFAULT_ALERTS.after,
    actions: {
      start,
      pause,
      resume,
      reset,
      setTimeLeft: updateTime,
      updateAlert,
    },
  };
};