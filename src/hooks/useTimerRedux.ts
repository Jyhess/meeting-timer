import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  setDuration,
  start,
  pause,
  resume,
  stop,
  reset,
  resetFromDefault,
  loadPreset,
  updateAlert,
  addTime,
  tick,
  setShouldFlash,
  setHasActiveAlert
} from '../store/timerSlice';
import { useSettings } from './useSettings';
import { usePresets } from './usePresets';
import { useAudio } from './useAudio';
import { useVibration } from './useVibration';
import { useKeepAwake } from './useKeepAwake';
import { Alert } from '../types/alerts';

export function useTimerRedux() {
  const dispatch = useDispatch();
  const settings = useSettings();
  const presets = usePresets();
  const {
    duration,
    timeLeft,
    isRunning,
    state,
    beforeAlert,
    endAlert,
    afterAlert,
    effectDuration,
    presetName,
    presetColor,
    shouldFlash,
    hasActiveAlert
  } = useSelector((state: RootState) => state.timer);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAlerts = useRef<Set<string>>(new Set());
  const { playSound, stopSound: stopAudioSound } = useAudio();
  const alertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useVibration(shouldFlash, effectDuration * 1000);
  useKeepAwake(state === 'running' || state === 'paused');

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        dispatch(tick());
      }, 1000);
    } else {
      stopAlerts();
      if(state === 'idle') {
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
  }, [state, dispatch]);

  useEffect(() => {
    const checkAlerts = () => {
      const alerts = [beforeAlert, endAlert, afterAlert];

      alerts.forEach(alert => {
        if (!alert.enabled || startedAlerts.current.has(alert.id)) return;

        const shouldTrigger = (
          (alert.id === 'end' && timeLeft === 0) ||
          (alert.id === 'before' && timeLeft === alert.timeOffset) ||
          (alert.id === 'after' && timeLeft === -alert.timeOffset)
        );

        if (shouldTrigger) {
          startedAlerts.current.add(alert.id);
          if (alert.effects.includes('flash')) {
            dispatch(setShouldFlash(true));
          }
          if (alert.sound) {
            playSound(alert.sound);
          }
          if (alert.effects.includes('shake')) {
            dispatch(setShouldFlash(true));
          }
          dispatch(setHasActiveAlert(true));
        }
      });
    };

    if (state === 'running') {
      checkAlerts();
    }
  }, [timeLeft, state, beforeAlert, endAlert, afterAlert, dispatch, playSound]);

  useEffect(() => {
    if (shouldFlash) {
      alertTimerRef.current = setTimeout(() => {
        dispatch(setShouldFlash(false));
        dispatch(setHasActiveAlert(false));
      }, effectDuration * 1000);
    }
    return () => {
      if (alertTimerRef.current) {
        clearTimeout(alertTimerRef.current);
        alertTimerRef.current = null;
      }
    };
  }, [shouldFlash, effectDuration, dispatch]);

  const stopAlerts = useCallback(() => {
    stopAudioSound();
    dispatch(setShouldFlash(false));
    dispatch(setHasActiveAlert(false));
    startedAlerts.current.clear();
  }, [stopAudioSound, dispatch]);

  const savePreset = useCallback(async (name?: string, color?: string) => {
    await presets.createOrUpdatePreset(duration, [beforeAlert, endAlert, afterAlert], name, color);
  }, [duration, beforeAlert, endAlert, afterAlert, presets]);

  const actions = {
    setDuration: useCallback((duration: number) => {
      dispatch(setDuration(duration));
    }, [dispatch]),

    start: useCallback(() => {
      if(state === 'idle' && duration > 0) {
        savePreset();
      }
      dispatch(start());
    }, [state, duration, savePreset, dispatch]),

    pause: useCallback(() => {
      dispatch(pause());
    }, [dispatch]),

    resume: useCallback(() => {
      dispatch(resume());
    }, [dispatch]),

    stop: useCallback(() => {
      dispatch(stop());
    }, [dispatch]),

    reset: useCallback(() => {
      dispatch(reset());
      stopAlerts();
      startedAlerts.current.clear();
    }, [dispatch, stopAlerts]),

    resetFromDefault: useCallback(() => {
      dispatch(resetFromDefault({
        duration: 0,
        timeLeft: 0,
        endTime: null,
        isRunning: false,
        state: 'idle',
        beforeAlert: settings.defaultAlerts[0],
        endAlert: settings.defaultAlerts[1],
        afterAlert: settings.defaultAlerts[2],
        effectDuration: settings.defaultAlertDuration,
        presetName: '',
        presetColor: '',
        shouldFlash: false,
        hasActiveAlert: false
      }));
    }, [dispatch, settings.defaultAlerts, settings.defaultAlertDuration]),

    loadPreset: useCallback((presetId: string) => {
      const preset = presets.getPreset(presetId);
      if (preset) {
        dispatch(loadPreset({
          alerts: preset.alerts,
          seconds: preset.seconds,
          name: preset.name,
          color: preset.color
        }));
      }
    }, [dispatch, presets]),

    updateAlert: useCallback((alert: Alert) => {
      dispatch(updateAlert(alert));
    }, [dispatch]),

    addTime: useCallback((seconds: number) => {
      dispatch(addTime(seconds));
    }, [dispatch]),

    stopAlerts,
    savePreset,
  };

  return {
    duration,
    timeLeft,
    isRunning,
    state,
    beforeAlert,
    endAlert,
    afterAlert,
    effectDuration,
    presetName,
    presetColor,
    shouldFlash,
    hasActiveAlert,
    actions,
  };
} 