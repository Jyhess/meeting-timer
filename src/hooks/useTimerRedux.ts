import { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { actions } from '../store/timerSlice';
import { useAudio } from '../contexts/AudioContext';
import { useSettings } from './useSettings';
import { usePresets } from './usePresets';
import { useVibration } from './useVibration';
import { useKeepAwake } from './useKeepAwake';
import { Alert, DEFAULT_ALERTS, shouldAlertTrigger } from '../types/alerts';

export function useTimerRedux() {
  const dispatch = useDispatch();
  const settings = useSettings();
  const presets = usePresets();
  const { playSound, stopSound: stopAudioSound } = useAudio();
  const {
    duration,
    timeLeft,
    isRunning,
    state,
    alerts,
    effectDuration,
    presetName,
    presetColor,
    shouldFlash,
    hasActiveAlert
  } = useSelector((state: RootState) => state.timer);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAlerts = useRef<Set<string>>(new Set());
  const alertTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useVibration(shouldFlash, effectDuration * 1000);
  useKeepAwake(state === 'running' || state === 'paused');

  useEffect(() => {
    if (state === 'running') {
      intervalRef.current = setInterval(() => {
        dispatch(actions.tick());
      }, 100);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state, dispatch]);

  useEffect(() => {
    const checkAlerts = () => {
      alerts.forEach(alert => {
        if (!alert.enabled || startedAlerts.current.has(alert.id)) return;

        const shouldTrigger = shouldAlertTrigger(alert, timeLeft);

        if (shouldTrigger) {
          startedAlerts.current.add(alert.id);
          if (alert.effects.includes('flash')) {
            dispatch(actions.setShouldFlash(true));
          }
          if (alert.sound) {
            playSound(alert.sound);
          }
          if (alert.effects.includes('shake')) {
            dispatch(actions.setShouldFlash(true));
          }
          dispatch(actions.setHasActiveAlert(true));
        }
      });
    };

    if (state === 'running') {
      checkAlerts();
    }
  }, [timeLeft, state, alerts, dispatch, playSound]);

  useEffect(() => {
    if (shouldFlash) {
      alertTimerRef.current = setTimeout(() => {
        dispatch(actions.setShouldFlash(false));
        dispatch(actions.setHasActiveAlert(false));
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
    dispatch(actions.setShouldFlash(false));
    dispatch(actions.setHasActiveAlert(false));
  }, [stopAudioSound, dispatch]);

  const savePreset = useCallback(async (name?: string, color?: string) => {
    await presets.createOrUpdatePreset(duration, alerts, name, color);
  }, [duration, alerts, presets]);

  const setDuration = useCallback((duration: number) => {
    dispatch(actions.setDuration(duration));
  }, [dispatch]);

  const startTimer = useCallback(() => {
    if(state === 'idle' && duration > 0) {
      savePreset();
    }
    dispatch(actions.start());
  }, [state, duration, savePreset, dispatch]);

  const pauseTimer = useCallback(() => {
    dispatch(actions.pause());
    stopAlerts();
  }, [dispatch, stopAlerts]);

  const resumeTimer = useCallback(() => {
    dispatch(actions.resume());
  }, [dispatch]);

  const stopTimer = useCallback(() => {
    dispatch(actions.stop());
    stopAlerts();
    startedAlerts.current.clear();
  }, [dispatch, stopAlerts]);

  const resetTimer = useCallback(() => {
    dispatch(actions.reset());
    stopAlerts();
    startedAlerts.current.clear();
  }, [dispatch, stopAlerts]);

  const resetNewTimer = useCallback(() => {
    dispatch(actions.resetFromDefault({
      duration: 0,
      timeLeft: 0,
      timeLeftMS: 0,
      endTime: null,
      isRunning: false,
      state: 'idle',
      alerts: DEFAULT_ALERTS,
      effectDuration: settings.defaultAlertDuration,
      presetName: '',
      presetColor: '',
      shouldFlash: false,
      hasActiveAlert: false
    }));
  }, [dispatch, settings.defaultAlertDuration]);

  const loadTimerFromPreset = useCallback((presetId: string) => {
    const preset = presets.getPreset(presetId);
    if (preset) {
      dispatch(actions.loadPreset({
        alerts: preset.alerts,
        seconds: preset.seconds,
        name: preset.name,
        color: preset.color
      }));
    }
  }, [dispatch, presets]);

  const updateAlert = useCallback((alert: Alert) => {
    dispatch(actions.updateAlert(alert));
  }, [dispatch]);

  const addAlert = useCallback((alert: Alert) => {
    dispatch(actions.addAlert(alert));
  }, [dispatch]);

  const removeAlert = useCallback((id: string) => {
    dispatch(actions.removeAlert(id));
  }, [dispatch]);

  const addTimerTime = useCallback((seconds: number) => {
    dispatch(actions.addTime(seconds));
  }, [dispatch]);

  return {
    duration,
    timeLeft,
    isRunning,
    state,
    alerts,
    effectDuration,
    presetName,
    presetColor,
    shouldFlash,
    hasActiveAlert,
    savePreset,
    setDuration,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    resetNewTimer,
    loadTimerFromPreset,
    updateAlert,
    addAlert,
    removeAlert,
    addTimerTime,
    stopAlerts
  };
}