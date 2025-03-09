import { useState, useCallback } from 'react';
import { useTimer } from './useTimer';
import { usePresets } from './usePresets';
import { Alert, TimerPreset } from '../types/timer';

export const useTimerScreen = (initialMinutes: number = 30) => {
  // États locaux
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);
  const [inputMode, setInputMode] = useState<'minutes' | 'seconds'>('minutes');
  const [inputBuffer, setInputBuffer] = useState('');
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'before',
      name: 'Bientôt fini',
      enabled: true,
      timeOffset: 5,
      sound: 'bell',
      effects: ['flash'],
      effectDuration: 5,
    },
    {
      id: 'end',
      name: 'Temps écoulé',
      enabled: true,
      timeOffset: 0,
      sound: 'gong',
      effects: ['flash'],
      effectDuration: 5,
    },
    {
      id: 'after',
      name: 'Temps dépassé',
      enabled: true,
      timeOffset: 5,
      sound: 'alarm',
      effects: ['shake'],
      vibrationDuration: 10,
    },
  ]);

  // Hooks
  const { presets, addPreset } = usePresets();
  const { timeLeft, isRunning, state, actions } = useTimer(
    minutes * 60,
    alerts.find(a => a.id === 'before'),
    alerts.find(a => a.id === 'end'),
    alerts.find(a => a.id === 'after')
  );

  // Sauvegarde automatique du timer
  const autoSaveTimer = useCallback(async () => {
    const totalSeconds = minutes * 60 + seconds;
    const existingPreset = presets.find(p => 
      p.minutes * 60 === totalSeconds && 
      JSON.stringify(p.alerts) === JSON.stringify(alerts)
    );

    if (!existingPreset) {
      const newPreset: TimerPreset = {
        id: Date.now().toString(),
        name: `Timer ${minutes}:${seconds.toString().padStart(2, '0')}`,
        minutes: minutes + seconds / 60,
        alerts: JSON.parse(JSON.stringify(alerts)),
        created_at: new Date().toISOString()
      };
      await addPreset(newPreset);
    }
  }, [minutes, seconds, alerts, presets, addPreset]);

  // Gestion du pavé numérique
  const handleNumberPress = useCallback((num: number) => {
    if (!isRunning) {
      if (inputMode === 'minutes' && inputBuffer.length < 2) {
        const newBuffer = inputBuffer + num.toString();
        setInputBuffer(newBuffer);
        const newMinutes = parseInt(newBuffer, 10);
        if (newMinutes <= 99) {
          setMinutes(newMinutes);
        }
      } else if (inputMode === 'seconds' && inputBuffer.length < 2) {
        const newBuffer = inputBuffer + num.toString();
        setInputBuffer(newBuffer);
        const newSeconds = parseInt(newBuffer, 10);
        if (newSeconds <= 59) {
          setSeconds(newSeconds);
        }
      }
    }
  }, [isRunning, inputMode, inputBuffer]);

  const handleBackspace = useCallback(() => {
    if (!isRunning) {
      if (inputBuffer.length > 0) {
        const newBuffer = inputBuffer.slice(0, -1);
        setInputBuffer(newBuffer);
        const newValue = newBuffer.length > 0 ? parseInt(newBuffer, 10) : 0;
        if (inputMode === 'minutes') {
          setMinutes(newValue);
        } else {
          setSeconds(newValue);
        }
      }
    }
  }, [isRunning, inputMode, inputBuffer]);

  const handleColonPress = useCallback(() => {
    if (!isRunning) {
      setInputMode(prev => prev === 'minutes' ? 'seconds' : 'minutes');
      setInputBuffer('');
    }
  }, [isRunning]);

  // Chargement d'un preset
  const loadPreset = useCallback((preset: TimerPreset) => {
    const mins = Math.floor(preset.minutes);
    const secs = Math.round((preset.minutes - mins) * 60);
    setMinutes(mins);
    setSeconds(secs);
    setAlerts(preset.alerts);
  }, []);

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
    minutes,
    seconds,
    timeLeft,
    isRunning,
    state,
    inputMode,
    alerts,
    presets,

    // Actions
    setAlerts,
    loadPreset,
    handleNumberPress,
    handleBackspace,
    handleColonPress,
    ...enhancedActions,
  };
}; 