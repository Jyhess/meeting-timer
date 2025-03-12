import { useReducer, useCallback, useRef, useEffect, useState } from 'react';
import { Alert } from '../types/timer';
import { SettingsManager } from '../utils/SettingsManager';
import { PresetManager } from '../utils/PresetManager';
import { useAudio } from './useAudio';
import { useVibration } from './useVibration';

interface TimerState {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  state: 'idle' | 'running' | 'paused';
  beforeAlert: Alert;
  endAlert: Alert;
  afterAlert: Alert;
  effectDuration: number;
}

type TimerAction =
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'RESET' }
  | { type: 'RESET_FROM_DEFAULT' }
  | { type: 'LOAD_PRESET'; payload: string }
  | { type: 'UPDATE_ALERT'; payload: Alert }
  | { type: 'TICK' };

function getInitialState(): TimerState {
  const settings = SettingsManager.getInstance();
  const defaultDuration = settings.getDefaultTimerMinutes() * 60;

  return {
    duration: defaultDuration,
    timeLeft: defaultDuration,
    isRunning: false,
    state: 'idle',
    beforeAlert: settings.getBeforeAlert(),
    endAlert: settings.getEndAlert(),
    afterAlert: settings.getAfterAlert(),
    effectDuration: settings.getDefaultAlertDuration(),
  };
}

function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload,
        timeLeft: action.payload,
      };

    case 'START':
      return {
        ...state,
        isRunning: true,
        state: 'running',
      };

    case 'PAUSE':
      return {
        ...state,
        isRunning: true,
        state: 'paused',
      };

    case 'RESUME':
      return {
        ...state,
        isRunning: true,
        state: 'running',
      };

    case 'STOP':
      return {
        ...state,
        timeLeft: state.duration,
        isRunning: false,
        state: 'idle',
      };

    case 'RESET':
      return {
        ...state,
        timeLeft: state.duration,
        isRunning: true,
        state: 'running',
      };

    case 'RESET_FROM_DEFAULT':
      return getInitialState();

    case 'LOAD_PRESET':
      const presetManager = PresetManager.getInstance();
      const preset = presetManager.getPreset(action.payload);
      if (!preset) return state;
      return {
        ...state,
        duration: preset.seconds,
        timeLeft: preset.seconds,
        beforeAlert: preset.alerts.find(a => a.id === 'before') || state.beforeAlert,
        endAlert: preset.alerts.find(a => a.id === 'end') || state.endAlert,
        afterAlert: preset.alerts.find(a => a.id === 'after') || state.afterAlert,
        isRunning: false,
        state: 'idle',
      };

    case 'UPDATE_ALERT':
      switch (action.payload.id) {
        case 'before':
          return {
            ...state,
            beforeAlert: action.payload,
          };
        case 'end':
          return {
            ...state,
            endAlert: action.payload,
          };
        case 'after':
          return {
            ...state,
            afterAlert: action.payload,
          };
      }

    case 'TICK':
      if (state.state !== 'running') return state;
      const newTimeLeft = state.timeLeft - 1;
      return {
        ...state,
        timeLeft: newTimeLeft,
      };

    default:
      return state;
  }
}

export function useTimer() {
  const [state, dispatch] = useReducer(timerReducer, null, getInitialState);
  const intervalRef = useRef<NodeJS.Timeout>();
  const startedAlerts = useRef<Set<string>>(new Set());
  const [isVibrating, setIsVibrating] = useState(false);
  const [hasActiveAlert, setHasActiveAlert] = useState(false);
  const soundPlayer = useAudio();

  // Utiliser useVibration avec les paramètres requis
  useVibration(isVibrating, state.effectDuration / 1000);

  useEffect(() => {
    if (state.state === 'running') {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else if (state.state === 'idle' && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.state]);

  // Gérer les effets des alertes (son et vibration)
  useEffect(() => {
    if (state.state !== 'running') {
      startedAlerts.current.clear();
      stopAlerts(soundPlayer);
      return;
    }

    [state.beforeAlert, state.endAlert, state.afterAlert].forEach(alert => {
      if (!alert?.enabled) return;

      const shouldTrigger = (
        (alert.id === 'end' && state.timeLeft === 0) ||
        (alert.id === 'before' && state.timeLeft === alert.timeOffset * 60) ||
        (alert.id === 'after' && state.timeLeft === -alert.timeOffset * 60)
      );

      const alertKey = `${alert.id}`;
      if (shouldTrigger && !startedAlerts.current.has(alertKey)) {
        startedAlerts.current.add(alertKey);
        setHasActiveAlert(true);
        
        if (alert.effects.includes('shake')) {
          setIsVibrating(true);
          // Arrêter la vibration après la durée de l'effet
          setTimeout(() => {
            setIsVibrating(false);
          }, state.effectDuration);
        }
        soundPlayer.playSound(alert.sound);
      }
    });
  }, [state.state, state.timeLeft, state.beforeAlert, state.endAlert, state.afterAlert, state.effectDuration, soundPlayer]);

  const stopAlerts = (soundPlayer: any) => {
    setIsVibrating(false);
    setHasActiveAlert(false);
    soundPlayer.stopSound();
  };

  const savePreset = async () => {
    console.log('[useTimer] 💾 Sauvegarde du preset');
    const presetManager = PresetManager.getInstance();
    await presetManager.createPreset(state.duration, [state.beforeAlert, state.endAlert, state.afterAlert]);
  };

  const actions = {
    setDuration: useCallback((duration: number) => {
      dispatch({ type: 'SET_DURATION', payload: duration });
    }, []),

    start: useCallback(() => {
      if(state.state === 'idle' && state.duration > 0) {
        savePreset();
      }
      dispatch({ type: 'START' });
    }, [state.state, state.duration]),

    pause: useCallback(() => {
      dispatch({ type: 'PAUSE' });
    }, []),

    resume: useCallback(() => {
      dispatch({ type: 'RESUME' });
    }, []),

    stop: useCallback(() => {
      dispatch({ type: 'STOP' });
      stopAlerts(soundPlayer);
    }, []),

    reset: useCallback(() => {
      dispatch({ type: 'RESET' });
      stopAlerts(soundPlayer);
      startedAlerts.current.clear();
    }, []),

    resetFromDefault: useCallback(() => {
      dispatch({ type: 'RESET_FROM_DEFAULT' });
    }, []),

    loadPreset: useCallback((presetId: string) => {
      dispatch({ type: 'LOAD_PRESET', payload: presetId });
    }, []),

    updateAlert: useCallback((alert: Alert) => {
      dispatch({ type: 'UPDATE_ALERT', payload: alert });
    }, []),

    stopAlerts: useCallback(() => {
      stopAlerts(soundPlayer);
    }, [soundPlayer]),
  };

  return {
    ...state,
    hasActiveAlert,
    actions,
  };
}