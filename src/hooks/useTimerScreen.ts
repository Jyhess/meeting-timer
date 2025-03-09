import { useState, useCallback } from 'react';
import { useTimer } from './useTimer';
import { usePresets } from './usePresets';
import { Alert, TimerPreset } from '../types/timer';
import { TimerManager } from '../utils/TimerManager';
import React from 'react';

export const useTimerScreen = (
  timerManagerRef: React.RefObject<TimerManager>,
  key?: number
) => {
  // États locaux
  const timeLeftInSeconds = timerManagerRef.current?.getTimeLeft() ?? 0;
  const [seconds, setSeconds] = useState(() => timeLeftInSeconds);
  const [inputBuffer, setInputBuffer] = useState('');
  const [isValidTime, setIsValidTime] = useState(true);
  const [displayMinutes, setDisplayMinutes] = useState(() => Math.floor(timeLeftInSeconds / 60));
  const [displaySeconds, setDisplaySeconds] = useState(() => timeLeftInSeconds % 60);

  // Hooks
  const { presets, addPreset } = usePresets();
  const { timeLeft, isRunning, state, beforeAlert, endAlert, afterAlert, actions } = useTimer(
    timerManagerRef,
    seconds
  );

  // Vérifier si le timer est valide
  const checkTimeValidity = useCallback((mins: number, secs: number, beforeAlertOffset?: number, isBeforeEnabled?: boolean) => {
    // Vérifier que les secondes sont valides
    if (secs >= 60) return false;

    // Si l'alerte "before" est activée, vérifier que son offset est inférieur au temps total
    if (beforeAlertOffset !== undefined && (isBeforeEnabled ?? beforeAlert?.enabled)) {
      const totalSeconds = mins * 60 + secs;
      if (totalSeconds <= beforeAlertOffset * 60) return false;
    }

    return true;
  }, [beforeAlert]);

  // Réinitialiser les états quand la key change
  React.useEffect(() => {
    const timeLeftInSeconds = timerManagerRef.current?.getTimeLeft() ?? 0;
    setSeconds(timeLeftInSeconds);
    setInputBuffer('');
    setIsValidTime(true);
    setDisplayMinutes(Math.floor(timeLeftInSeconds / 60));
    setDisplaySeconds(timeLeftInSeconds % 60);
  }, [key]);

  // Convertir le buffer en secondes totales
  const secondsFromBuffer = useCallback((buffer: string) => {
    setInputBuffer(buffer);

    const digits = buffer.padStart(4, '0').split('').map(Number);
    const mins = parseInt(digits.slice(0, 2).join(''), 10);
    const secs = parseInt(digits.slice(2).join(''), 10);
    
    // Mettre à jour l'affichage exact
    setDisplayMinutes(mins);
    setDisplaySeconds(secs);
    
    // Toujours mettre à jour les secondes totales
    setSeconds(mins * 60 + secs);
    
    // Vérifier la validité du temps
    setIsValidTime(checkTimeValidity(mins, secs, beforeAlert?.timeOffset));
  }, [beforeAlert, checkTimeValidity]);

  // Sauvegarde automatique du timer
  const autoSaveTimer = useCallback(async () => {
    // Récupérer les alertes actuelles directement du TimerManager
    const alerts = [
      timerManagerRef.current?.getBeforeAlert(),
      timerManagerRef.current?.getEndAlert(),
      timerManagerRef.current?.getAfterAlert()
    ].filter(Boolean) as Alert[];

    console.log('Alertes à sauvegarder:', alerts);

    // Vérifier si un preset similaire existe déjà
    const existingPreset = presets.find(p => 
      p.seconds === seconds && 
      JSON.stringify(p.alerts) === JSON.stringify(alerts)
    );

    if (!existingPreset) {
      const newPreset: TimerPreset = {
        id: Date.now().toString(),
        name: `Timer ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
        seconds,
        alerts,
        created_at: new Date().toISOString()
      };
      await addPreset(newPreset);
    }
  }, [seconds, presets, addPreset]);

  // Gestion du pavé numérique
  const handleNumberPress = useCallback((num: number) => {
    if (!isRunning && inputBuffer.length < 4) {
      const newBuffer = inputBuffer + num.toString();
      secondsFromBuffer(newBuffer);
    }
  }, [isRunning, inputBuffer, secondsFromBuffer]);

  const handleBackspace = useCallback(() => {
    if (!isRunning && inputBuffer.length > 0) {
      const newBuffer = inputBuffer.slice(0, -1);
      secondsFromBuffer(newBuffer);
    }
  }, [isRunning, inputBuffer, secondsFromBuffer]);

  const handleDoubleZero = useCallback(() => {
    if (!isRunning) {
      const newBuffer = inputBuffer + '00';
      if (newBuffer.length <= 4) {
        secondsFromBuffer(newBuffer);
      }
    }
  }, [isRunning, inputBuffer, secondsFromBuffer]);

  // Chargement d'un preset
  const loadPreset = useCallback((preset: TimerPreset) => {
    setSeconds(preset.seconds);
    setInputBuffer('');
    const mins = Math.floor(preset.seconds / 60);
    const secs = preset.seconds % 60;
    setDisplayMinutes(mins);
    setDisplaySeconds(secs);
    
    // Mettre à jour les alertes
    preset.alerts.forEach(alert => {
      actions.updateAlert(alert);
    });
    
    // Vérifier la validité avec la nouvelle configuration
    const beforeAlertFromPreset = preset.alerts.find(a => a.id === 'before');
    setIsValidTime(checkTimeValidity(mins, secs, beforeAlertFromPreset?.timeOffset));
  }, [actions, checkTimeValidity]);

  // Surcharge des actions du timer pour ajouter la sauvegarde automatique
  const enhancedActions = {
    ...actions,
    start: async () => {
      if (!isValidTime) {
        console.log('Impossible de démarrer : temps invalide');
        return;
      }
      await autoSaveTimer();
      actions.start();
    },
    updateAlert: (alert: Alert) => {
      actions.updateAlert(alert);
      // Si c'est l'alerte "before", vérifier la validité du timer
      if (alert.id === 'before') {
        setIsValidTime(checkTimeValidity(displayMinutes, displaySeconds, alert.timeOffset, alert.enabled));
      }
    }
  };

  return {
    // États
    minutes: displayMinutes,
    seconds: displaySeconds,
    timeLeft,
    isRunning,
    state,
    beforeAlert,
    endAlert,
    afterAlert,
    presets,
    isValidTime,

    // Actions
    loadPreset,
    handleNumberPress,
    handleBackspace,
    handleDoubleZero,
    ...enhancedActions,
  };
}; 