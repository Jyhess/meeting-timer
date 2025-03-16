import { useReducer, useCallback, useRef, useEffect, useState } from 'react';
import { Alert } from '../types/alerts';
import { useSettings } from './useSettings';
import { usePresets } from './usePresets';
import { useAudio } from './useAudio';
import { useVibration } from './useVibration';
import { AlertEffect } from '../types/alerts';

interface TimerState {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  state: 'idle' | 'running' | 'paused';
  beforeAlert: Alert;
  endAlert: Alert;
  afterAlert: Alert;
  effectDuration: number;
  presetName: string;
  presetColor: string;
}

type TimerAction =
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'STOP' }
  | { type: 'RESET' }
  | { type: 'RESET_FROM_DEFAULT'; payload: TimerState }
  | { type: 'LOAD_PRESET'; payload: string }
  | { type: 'BOOKMARK_PRESET'; payload: { name: string; color: string } }
  | { type: 'UPDATE_ALERT'; payload: Alert }
  | { type: 'ADD_TIME'; payload: number }
  | { type: 'TICK' };


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
      return {...action.payload};

    case 'LOAD_PRESET':
      const preset = usePresets.getState().getPreset(action.payload);
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
        presetName: preset.name,
        presetColor: preset.color,
      };

    case 'BOOKMARK_PRESET':
      return {
        ...state,
        presetName: action.payload.name,
        presetColor: action.payload.color,
      };

    case 'UPDATE_ALERT':
      switch (action.payload.id) {
        case 'before':
          return {
            ...state,
            beforeAlert: {...action.payload},
          };
        case 'end':
          return {
            ...state,
            endAlert: {...action.payload},
          };
        case 'after':
          return {
            ...state,
            afterAlert: {...action.payload},
          };
      }

    case 'ADD_TIME':
      return {
        ...state,
        timeLeft: Number(state.timeLeft) + Number(action.payload),
      };

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
  const settings = useSettings();
  const presets = usePresets();
  const [state, dispatch] = useReducer(timerReducer, {
    duration: 0,
    timeLeft: 0,
    isRunning: false,
    state: 'idle',
    beforeAlert: settings.defaultAlerts[0],
    endAlert: settings.defaultAlerts[1],
    afterAlert: settings.defaultAlerts[2],
    effectDuration: settings.defaultAlertDuration,
    presetName: '',
    presetColor: '',
  });
  const intervalRef = useRef<NodeJS.Timeout>();
  const startedAlerts = useRef<Set<string>>(new Set());
  const [shouldFlash, setShouldFlash] = useState(false);
  const [isVibrating, setIsVibrating] = useState(false);
  const [hasActiveAlert, setHasActiveAlert] = useState(false);
  const { playSound, stopSound: stopAudioSound } = useAudio();
  const alertTimerRef = useRef<NodeJS.Timeout | null>(null);

  useVibration(isVibrating, state.effectDuration * 1000);

  useEffect(() => {
    console.log('[useTimer] 🔔 useEffect [state.state] :', state.state);
    if (state.state === 'running') {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' });
      }, 1000);
    } else {
      stopAlerts();
      if(state.state === 'idle') {
        startedAlerts.current.clear();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.state]);

  useEffect(() => {
    console.log('[useTimer] 🔔 useEffect [state.timeLeft] :', state.timeLeft);
    const checkAlerts = () => {
      const alerts = [state.beforeAlert, state.endAlert, state.afterAlert];

      alerts.forEach(alert => {
        if (!alert.enabled || startedAlerts.current.has(alert.id)) return;

        const shouldTrigger = (
          (alert.id === 'end' && state.timeLeft === 0) ||
          (alert.id === 'before' && state.timeLeft === alert.timeOffset) ||
          (alert.id === 'after' && state.timeLeft === -alert.timeOffset)
        );

      if (shouldTrigger) {
          startedAlerts.current.add(alert.id);
          if (alert.effects.includes('flash' as AlertEffect)) {
            console.log('[useTimer] 🔔 Alerte flash active :', alert.id);
            setShouldFlash(true);
          }
          if (alert.sound) {
            console.log('[useTimer] 🔔 Alerte sound active :', alert.id);
            playSound(alert.sound);
          }
          if (alert.effects.includes('shake' as AlertEffect)) {
            console.log('[useTimer] 🔔 Alerte vibration active :', alert.id);
            setIsVibrating(true);
          }
          setHasActiveAlert(true);
        }
      });
    };

    if (state.state === 'running') {
      checkAlerts();
    }
  }, [state.timeLeft]);

  useEffect(() => {
    console.log('[useTimer] 🔔 useEffect [flash & vibration] :', shouldFlash, isVibrating);
    if (shouldFlash || isVibrating) {
      console.log('[useTimer] 🔔 Create alert effect timeout :', shouldFlash, isVibrating, state.effectDuration);
      alertTimerRef.current = setTimeout(() => {
        console.log('[useTimer] 🔔 Clear alert effect timeout');
        setShouldFlash(false);
        setIsVibrating(false);
        setHasActiveAlert(false);
      }, state.effectDuration * 1000);
    }
    return () => {
      if (alertTimerRef.current) {
        clearTimeout(alertTimerRef.current);
        alertTimerRef.current = null;
      }
    };
  }, [shouldFlash, isVibrating]);

  const stopAlerts = useCallback(() => {
    console.log('[useTimer] 🔔 stopAlerts');
    stopAudioSound();
    setIsVibrating(false);
    setShouldFlash(false);
    setHasActiveAlert(false);
    startedAlerts.current.clear();
  }, [stopAudioSound]);

  const savePreset = async (name?: string, color?: string) => {
    console.log('[useTimer] 💾 Sauvegarde du preset');
    await presets.createOrUpdatePreset(state.duration, [state.beforeAlert, state.endAlert, state.afterAlert], name, color);
    dispatch({ type: 'BOOKMARK_PRESET', payload: { name: name || '', color: color || '' } });
  };

  const actions = {
    setDuration: useCallback((duration: number) => {
      console.log('[useTimer] 🔔 actions [setDuration] :', duration);
      dispatch({ type: 'SET_DURATION', payload: duration });
    }, []),

    start: useCallback(() => {
      console.log('[useTimer] 🔔 actions [start] :', state.state, state.duration);
      if(state.state === 'idle' && state.duration > 0) {
        savePreset();
      }
      dispatch({ type: 'START' });
    }, [state.state, state.duration, savePreset]),

    pause: useCallback(() => {
      console.log('[useTimer] 🔔 actions [pause] :', state.state);
      dispatch({ type: 'PAUSE' });
    }, []),

    resume: useCallback(() => {
      console.log('[useTimer] 🔔 actions [resume] :', state.state);
      dispatch({ type: 'RESUME' });
    }, []),

    stop: useCallback(() => {
      console.log('[useTimer] 🔔 actions [stop] :', state.state);
      dispatch({ type: 'STOP' });
    }, []),

    reset: useCallback(() => {
      console.log('[useTimer] 🔔 actions [reset] :', state.state);
      dispatch({ type: 'RESET' });
      stopAlerts();
      startedAlerts.current.clear();
    }, [stopAlerts]),

    resetFromDefault: useCallback(() => {
      console.log('[useTimer] 🔔 actions [resetFromDefault] :', state.state);
      dispatch({ type: 'RESET_FROM_DEFAULT', payload: {
        duration: 0,
        timeLeft: 0,
        isRunning: false,
        state: 'idle',
        beforeAlert: settings.defaultAlerts[0],
        endAlert: settings.defaultAlerts[1],
        afterAlert: settings.defaultAlerts[2],
        effectDuration: settings.defaultAlertDuration,
        presetName: '',
        presetColor: '',
      }});
    }, [settings.defaultAlerts, settings.defaultAlertDuration]),
  
    loadPreset: useCallback((presetId: string) => {
      console.log('[useTimer] 🔔 actions [loadPreset] :', presetId);
      dispatch({ type: 'LOAD_PRESET', payload: presetId });
    }, []),

    updateAlert: useCallback((alert: Alert) => {
      console.log('[useTimer] 🔔 actions [updateAlert] :', alert);
      dispatch({ type: 'UPDATE_ALERT', payload: alert });
    }, []),
    addTime: useCallback((seconds: number) => {
      console.log('[useTimer] 🔔 actions [addTime] :', seconds);
      dispatch({ type: 'ADD_TIME', payload: seconds });
    }, []),
    stopAlerts,
    savePreset,
  };

  return {
    duration: state.duration,
    timeLeft: state.timeLeft,
    isRunning: state.isRunning,
    state: state.state,
    beforeAlert: state.beforeAlert,
    endAlert: state.endAlert,
    afterAlert: state.afterAlert,
    effectDuration: state.effectDuration,
    presetName: state.presetName,
    presetColor: state.presetColor,
    shouldFlash,
    hasActiveAlert,
    actions,
  };
}