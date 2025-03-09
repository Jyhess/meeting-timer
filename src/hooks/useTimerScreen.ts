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

  // Réinitialiser les états quand la key change
  React.useEffect(() => {
    const timeLeftInSeconds = timerManagerRef.current?.getTimeLeft() ?? 0;
    setSeconds(timeLeftInSeconds);
    setInputBuffer('');
  }, [key]);

  // Hooks
  const { presets, addPreset } = usePresets();
  const { timeLeft, isRunning, state, beforeAlert, endAlert, afterAlert, actions } = useTimer(
    timerManagerRef,
    seconds
  );

  // Convertir le buffer en secondes totales
  const secondsFromBuffer = useCallback((buffer: string) => {
    setInputBuffer(buffer);
    const digits = buffer.padStart(4, '0').split('').map(Number);
    const mins = parseInt(digits.slice(0, 2).join(''), 10);
    const secs = parseInt(digits.slice(2).join(''), 10);
    if (secs < 60) {
      setSeconds(mins * 60 + secs);
    }
}, []);

  // Sauvegarde automatique du timer
  const autoSaveTimer = useCallback(async () => {
    const alerts = [beforeAlert, endAlert, afterAlert].filter(Boolean) as Alert[];
    const existingPreset = presets.find(p => 
      p.minutes * 60 === seconds && 
      JSON.stringify(p.alerts) === JSON.stringify(alerts)
    );

    if (!existingPreset) {
      const newPreset: TimerPreset = {
        id: Date.now().toString(),
        name: `Timer ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`,
        minutes: seconds / 60,
        alerts,
        created_at: new Date().toISOString()
      };
      await addPreset(newPreset);
    }
  }, [seconds, beforeAlert, endAlert, afterAlert, presets, addPreset]);

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
    setSeconds(Math.round(preset.minutes * 60));
    setInputBuffer('');
    preset.alerts.forEach(alert => {
      actions.updateAlert(alert);
    });
  }, [actions]);

  // Surcharge des actions du timer pour ajouter la sauvegarde automatique
  const enhancedActions = {
    ...actions,
    start: async () => {
      await autoSaveTimer();
      actions.start();
    }
  };

  return {
    // États
    minutes: Math.floor(seconds / 60),
    seconds: seconds % 60,
    timeLeft,
    isRunning,
    state,
    beforeAlert,
    endAlert,
    afterAlert,
    presets,

    // Actions
    loadPreset,
    handleNumberPress,
    handleBackspace,
    handleDoubleZero,
    ...enhancedActions,
  };
}; 