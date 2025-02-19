import { useState, useRef, useEffect } from 'react';
import { Alert } from '../types/timer';
import { useAudio } from './useAudio';

export const useTimer = (initialMinutes: number) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [overtime, setOvertime] = useState(0);
  const [inputBuffer, setInputBuffer] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(timeLeft);

  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'before',
      name: 'Bientôt fini',
      enabled: true,
      timeOffset: -5,
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
      sound: 'chime',
      effect: 'shake',
      lastTriggered: 0
    }
  ]);

  const audioHooks = {
    before: useAudio(alerts.find(a => a.id === 'before')?.sound || 'bell'),
    end: useAudio(alerts.find(a => a.id === 'end')?.sound || 'gong'),
    after: useAudio(alerts.find(a => a.id === 'after')?.sound || 'chime'),
  };

  const checkAlerts = (currentTime: number) => {
    const now = Date.now();
    
    alerts.forEach(alert => {
      if (!alert.enabled) return;

      const triggerTime = alert.timeOffset * 60;
      const hasPassedTrigger = lastTimeRef.current > triggerTime && currentTime <= triggerTime;
      const shouldTrigger = hasPassedTrigger && (!alert.lastTriggered || now - alert.lastTriggered > 5000);

      if (shouldTrigger) {
        audioHooks[alert.id as keyof typeof audioHooks].playSound();
        setAlerts(prev => prev.map(a => 
          a.id === alert.id ? { ...a, lastTriggered: now } : a
        ));
      }
    });

    lastTimeRef.current = currentTime;
  };

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      setIsPaused(false);
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
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(minutes * 60);
    setOvertime(0);
    lastTimeRef.current = minutes * 60;
    setAlerts(prev => prev.map(alert => ({ ...alert, lastTriggered: 0 })));
  };

  const handleNumberPress = (num: number) => {
    if (!isRunning && inputBuffer.length < 4) {
      const newBuffer = inputBuffer + num.toString();
      setInputBuffer(newBuffer);
      const newMinutes = parseInt(newBuffer, 10);
      if (newMinutes <= 999) {
        setMinutes(newMinutes);
        setTimeLeft(newMinutes * 60);
        lastTimeRef.current = newMinutes * 60;
      }
    }
  };

  const handleBackspace = () => {
    if (!isRunning && inputBuffer.length > 0) {
      const newBuffer = inputBuffer.slice(0, -1);
      setInputBuffer(newBuffer);
      const newMinutes = newBuffer.length > 0 ? parseInt(newBuffer, 10) : 0;
      setMinutes(newMinutes);
      setTimeLeft(newMinutes * 60);
      lastTimeRef.current = newMinutes * 60;
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
    isRunning,
    isPaused,
    timeLeft,
    overtime,
    alerts,
    setAlerts,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    handleNumberPress,
    handleBackspace,
  };
};