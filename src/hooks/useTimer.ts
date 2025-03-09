import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useAudio } from './useAudio';
import { Alert, TimerState } from '../types/timer';

export const useTimer = (
  duration: number,
  beforeAlert?: Alert,
  endAlert?: Alert,
  afterAlert?: Alert
) => {
  console.log(`[useTimer] 🕒 Initialisation du hook avec durée: ${duration}s et alertes`, { beforeAlert, endAlert, afterAlert });

  // États
  const [state, setState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState(duration);

  // Fonction pour déterminer si le timer est en cours d'exécution
  const isRunning = useMemo(() => state !== 'idle' && state !== 'finished', [state]);

  // Références pour le timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastTickRef = useRef<number | null>(null);
  const isManualStopRef = useRef(false);

  // Hooks audio
  const beforeAlertSound = useAudio(beforeAlert?.sound || 'bell');
  const endAlertSound = useAudio(endAlert?.sound || 'gong');
  const afterAlertSound = useAudio(afterAlert?.sound || 'alarm');

  // Mise à jour du timeLeft quand duration change
  useEffect(() => {
    console.log(`[useTimer] 🔄 Mise à jour de la durée: ${duration}s`);
    if (!isRunning) {
      setTimeLeft(duration);
    }
  }, [duration, isRunning]);

  // Fonction pour mettre à jour manuellement le temps
  const setTimeLeftWithTracking = useCallback((newTime: number) => {
    console.log(`[useTimer] ⌨️ Mise à jour manuelle: ${newTime}s`);
    setTimeLeft(newTime);
  }, []);

  // Nettoyage du timer
  const clearTimer = useCallback(() => {
    console.log('[useTimer] 🧹 Nettoyage du timer');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Mise à jour du temps restant
  const updateTimeLeft = useCallback(() => {
    if (!startTimeRef.current || !lastTickRef.current) return;

    const now = Date.now();
    const elapsed = now - startTimeRef.current;
    const newTimeLeft = Math.max(0, duration - Math.floor(elapsed / 1000));

    console.log(`[useTimer] ⏱️ Mise à jour - Temps restant: ${newTimeLeft}s`);

    if (newTimeLeft !== timeLeft) {
      setTimeLeft(newTimeLeft);
      lastTickRef.current = now;

      // Gestion des alertes - uniquement si le timer est en cours d'exécution
      if (isRunning) {
        if (beforeAlert?.enabled && newTimeLeft === beforeAlert.timeOffset) {
          console.log('[useTimer] 🔔 Déclenchement de l\'alerte "before"');
          beforeAlertSound.playSound();
        }
        if (endAlert?.enabled && newTimeLeft === 0 && !isManualStopRef.current) {
          console.log('[useTimer] 🔔 Déclenchement de l\'alerte "end"');
          endAlertSound.playSound();
        }
        if (afterAlert?.enabled && newTimeLeft === afterAlert.timeOffset) {
          console.log('[useTimer] 🔔 Déclenchement de l\'alerte "after"');
          afterAlertSound.playSound();
        }
      }

      // Mise à jour de l'état
      if (newTimeLeft === 0) {
        console.log('[useTimer] ⏹️ Timer terminé');
        setState('finished');
        clearTimer();
      }
    }
  }, [timeLeft, duration, beforeAlert, endAlert, afterAlert, beforeAlertSound, endAlertSound, afterAlertSound, clearTimer, isRunning]);

  // Démarrage du timer
  const start = useCallback(() => {
    console.log('[useTimer] ▶️ Démarrage du timer');
    
    if (state === 'finished') {
      console.log('[useTimer] 🔄 Réinitialisation du timer terminé');
      setTimeLeft(duration);
      setState('idle');
    }

    if (!isRunning) {
      console.log('[useTimer] ⏱️ Configuration du timer');
      isManualStopRef.current = false;
      startTimeRef.current = Date.now() - ((duration - timeLeft) * 1000);
      lastTickRef.current = Date.now();
      setState('running');

      timerRef.current = setInterval(() => {
        updateTimeLeft();
      }, 100);
    } else {
      console.log('[useTimer] ⚠️ Timer déjà en cours');
    }
  }, [isRunning, state, duration, timeLeft, updateTimeLeft]);

  // Pause du timer
  const pause = useCallback(() => {
    console.log('[useTimer] ⏸️ Mise en pause du timer');
    setState('paused');
    clearTimer();
  }, [clearTimer]);

  // Réinitialisation du timer
  const reset = useCallback(() => {
    console.log('[useTimer] 🔄 Réinitialisation du timer');
    isManualStopRef.current = true;
    clearTimer();
    setState('idle');
    setTimeLeft(duration);
    startTimeRef.current = null;
    lastTickRef.current = null;
  }, [duration, clearTimer]);

  // Nettoyage à la destruction du composant
  useEffect(() => {
    console.log('[useTimer] 🔄 Effect de montage du timer');
    return () => {
      console.log('[useTimer] 🧹 Nettoyage final du timer');
      clearTimer();
    };
  }, [clearTimer]);

  return {
    timeLeft,
    isRunning,
    state,
    actions: {
      start,
      pause,
      reset,
      setTimeLeft: setTimeLeftWithTracking,
    },
  };
};