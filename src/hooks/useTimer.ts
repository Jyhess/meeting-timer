import { useState, useRef, useEffect } from 'react';
import { Alert, AlertSound, TimerPreset } from '../types/timer';
import { useAudio } from './useAudio';
import { loadPresets, savePresets } from '../lib/storage';

type InputMode = 'minutes' | 'seconds';

export const useTimer = (initialMinutes: number) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [overtime, setOvertime] = useState(0);
  const [inputBuffer, setInputBuffer] = useState('');
  const [activeSound, setActiveSound] = useState<AlertSound | null>(null);
  const [presets, setPresets] = useState<TimerPreset[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>('minutes');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(timeLeft);
  const alertsRef = useRef<Alert[]>([]);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'before',
      name: 'Bientôt fini',
      enabled: true,
      timeOffset: 5,
      sound: 'bell',
      effect: 'pulse',
      lastTriggered: 0
    },
    {
      id: 'end',
      name: 'Temps écoulé',
      enabled: true,
      timeOffset: 0,
      sound: 'gong',
      effect: 'flash',
      lastTriggered: 0
    },
    {
      id: 'after',
      name: 'Temps dépassé',
      enabled: true,
      timeOffset: 5,
      sound: 'alarm',
      effect: 'shake',
      lastTriggered: 0
    }
  ]);

  // Mettre à jour alertsRef quand alerts change
  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);

  const audioHooks = {
    before: useAudio(alerts.find(a => a.id === 'before')?.sound || 'bell'),
    end: useAudio(alerts.find(a => a.id === 'end')?.sound || 'gong'),
    after: useAudio(alerts.find(a => a.id === 'after')?.sound || 'alarm'),
  };

  useEffect(() => {
    refreshPresets();
  }, []);

  const refreshPresets = async () => {
    const savedPresets = await loadPresets();
    if (savedPresets.length > 0) {
      setPresets(savedPresets);
    }
  };

  const areAlertsEqual = (a1: Alert[], a2: Alert[]) => {
    if (a1.length !== a2.length) return false;
    return a1.every(alert1 => {
      const alert2 = a2.find(a => a.id === alert1.id);
      if (!alert2) return false;
      return (
        alert1.enabled === alert2.enabled &&
        alert1.timeOffset === alert2.timeOffset &&
        alert1.sound === alert2.sound &&
        alert1.effect === alert2.effect
      );
    });
  };

  const autoSaveTimer = async () => {
    const totalSeconds = minutes * 60 + seconds;
    const existingPresetIndex = presets.findIndex(p => 
      p.minutes * 60 === totalSeconds && areAlertsEqual(p.alerts, alertsRef.current)
    );

    const newPreset: TimerPreset = {
      id: Date.now().toString(),
      name: `Timer ${minutes}:${seconds.toString().padStart(2, '0')}`,
      minutes: minutes + seconds / 60,
      alerts: alertsRef.current,
      created_at: new Date().toISOString()
    };

    let updatedPresets: TimerPreset[];
    if (existingPresetIndex !== -1) {
      updatedPresets = [
        newPreset,
        ...presets.slice(0, existingPresetIndex),
        ...presets.slice(existingPresetIndex + 1)
      ].slice(0, 6);
    } else {
      updatedPresets = [newPreset, ...presets].slice(0, 6);
    }

    setPresets(updatedPresets);
    await savePresets(updatedPresets);
  };

  const loadPreset = (preset: TimerPreset) => {
    const totalMinutes = preset.minutes;
    const mins = Math.floor(totalMinutes);
    const secs = Math.round((totalMinutes - mins) * 60);
    
    setMinutes(mins);
    setSeconds(secs);
    setTimeLeft(Math.round(totalMinutes * 60));
    setAlerts(preset.alerts);
    alertsRef.current = preset.alerts;
    lastTimeRef.current = Math.round(totalMinutes * 60);
  };

  const checkAlerts = (currentTime: number) => {
    const now = Date.now();
    
    alertsRef.current.forEach(alert => {
      if (!alert.enabled) return;

      const triggerTime = alert.id === 'before' ? alert.timeOffset * 60 :
                         alert.id === 'end' ? 0 :
                         -alert.timeOffset * 60;

      const hasPassedTrigger = lastTimeRef.current > triggerTime && currentTime <= triggerTime;
      const shouldTrigger = hasPassedTrigger && (!alert.lastTriggered || now - alert.lastTriggered > 5000);

      if (shouldTrigger) {
        audioHooks[alert.id as keyof typeof audioHooks].playSound();
        setActiveSound(alert.sound);
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, lastTriggered: now } : a
        ));
      }
    });

    lastTimeRef.current = currentTime;
  };

  const stopActiveSound = () => {
    if (activeSound) {
      Object.values(audioHooks).forEach(hook => hook.stopSound());
      setActiveSound(null);
    }
  };

  const startTimer = async () => {
    if (!isRunning) {
      await autoSaveTimer();
      setIsRunning(true);
      setIsPaused(false);
      const totalSeconds = minutes * 60 + seconds;
      setTimeLeft(totalSeconds);
      lastTimeRef.current = totalSeconds;
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setOvertime((o) => o + 1);
          }
          checkAlerts(newTime);
          return newTime;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsPaused(false);
    if (!intervalRef.current) {
      lastTimeRef.current = timeLeft;
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            setOvertime((o) => o + 1);
          }
          checkAlerts(newTime);
          return newTime;
        });
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopActiveSound();
    setIsRunning(false);
    setIsPaused(false);
    const totalSeconds = minutes * 60 + seconds;
    setTimeLeft(totalSeconds);
    setOvertime(0);
    lastTimeRef.current = totalSeconds;
    setAlerts(prev => prev.map(alert => ({ ...alert, lastTriggered: 0 })));
  };

  const handleNumberPress = (num: number) => {
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
  };

  const handleBackspace = () => {
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
  };

  const handleColonPress = () => {
    if (!isRunning) {
      setInputMode(prev => prev === 'minutes' ? 'seconds' : 'minutes');
      setInputBuffer('');
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    minutes,
    seconds,
    isRunning,
    isPaused,
    timeLeft,
    overtime,
    alerts,
    setAlerts,
    activeSound,
    stopActiveSound,
    presets,
    refreshPresets,
    loadPreset,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    handleNumberPress,
    handleBackspace,
    handleColonPress,
    inputMode,
  };
};