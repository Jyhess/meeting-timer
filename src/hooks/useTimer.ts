import { useState, useRef, useEffect } from 'react';
import { Alert, AlertSound, TimerPreset } from '../types/timer';
import { useAudio } from './useAudio';
import { loadPresets, savePresets } from '../lib/storage';
import { useSettings } from './useSettings';

type InputMode = 'minutes' | 'seconds';

export const useTimer = (initialMinutes: number) => {
  const { defaultTimerMinutes, defaultAlerts, defaultAlertDuration, isLoaded } = useSettings();
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
  const initialLoadDoneRef = useRef<boolean>(false);
  const soundTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const isMountedRef = useRef(true);

  // Set up mount tracking
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Utiliser les alertes par défaut si elles sont chargées
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'before',
      name: 'Bientôt fini',
      enabled: true,
      timeOffset: 5,
      sound: 'bell',
      effects: ['flash'],
      effectDuration: 5,
      lastTriggered: 0
    },
    {
      id: 'end',
      name: 'Temps écoulé',
      enabled: true,
      timeOffset: 0,
      sound: 'gong',
      effects: ['flash'],
      effectDuration: 5,
      lastTriggered: 0
    },
    {
      id: 'after',
      name: 'Temps dépassé',
      enabled: true,
      timeOffset: 5,
      sound: 'alarm',
      effects: ['shake'],
      vibrationDuration: 10,
      lastTriggered: 0
    }
  ]);

  // Mettre à jour alertsRef quand alerts change
  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);

  // Utiliser les valeurs par défaut une fois chargées
  useEffect(() => {
    if (isLoaded && !initialLoadDoneRef.current && !isRunning) {
      // Mettre à jour les minutes et les secondes
      setMinutes(defaultTimerMinutes);
      setSeconds(0);
      
      // Mettre à jour le temps restant
      setTimeLeft(defaultTimerMinutes * 60);
      lastTimeRef.current = defaultTimerMinutes * 60;
      
      // Migrer les anciennes alertes avec 'effect' vers le nouveau format 'effects'
      const migratedAlerts = defaultAlerts.map(alert => {
        // Si l'alerte a déjà un tableau 'effects', l'utiliser
        if (Array.isArray(alert.effects)) {
          // Remplacer 'pulse' par 'flash' si présent
          const newEffects = alert.effects.map(effect => 
            effect === 'pulse' ? 'flash' : effect
          );
          
          // Appliquer la durée d'alerte unifiée
          const updatedAlert = { 
            ...alert,
            effects: newEffects
          };
          
          // Mettre à jour les durées spécifiques en fonction des effets
          if (newEffects.includes('flash')) {
            updatedAlert.effectDuration = defaultAlertDuration;
          }
          
          if (newEffects.includes('shake')) {
            updatedAlert.vibrationDuration = defaultAlertDuration;
          }
          
          return updatedAlert;
        }
        
        // Sinon, convertir 'effect' en tableau 'effects'
        let newEffect = alert.effect;
        if (newEffect === 'pulse') {
          newEffect = 'flash';
        }
        
        const updatedAlert = {
          ...alert,
          effects: newEffect ? [newEffect] : [],
        };
        
        // Mettre à jour les durées spécifiques en fonction des effets
        if (newEffect === 'flash') {
          updatedAlert.effectDuration = defaultAlertDuration;
        }
        
        if (newEffect === 'shake') {
          updatedAlert.vibrationDuration = defaultAlertDuration;
        }
        
        return updatedAlert;
      });
      
      // Mettre à jour les alertes avec une copie profonde pour éviter les références partagées
      setAlerts(JSON.parse(JSON.stringify(migratedAlerts)));
      alertsRef.current = JSON.parse(JSON.stringify(migratedAlerts));
      
      // Marquer l'initialisation comme terminée
      initialLoadDoneRef.current = true;
    }
  }, [isLoaded, defaultTimerMinutes, defaultAlerts, defaultAlertDuration, isRunning]);

  // Créer des hooks audio pour chaque type d'alerte
  const beforeAlertSound = useAudio(alerts.find(a => a.id === 'before')?.sound || 'bell', 
                                   alerts.find(a => a.id === 'before')?.customSoundUri);
  const endAlertSound = useAudio(alerts.find(a => a.id === 'end')?.sound || 'gong',
                                alerts.find(a => a.id === 'end')?.customSoundUri);
  const afterAlertSound = useAudio(alerts.find(a => a.id === 'after')?.sound || 'alarm',
                                  alerts.find(a => a.id === 'after')?.customSoundUri);

  const audioHooks = {
    before: beforeAlertSound,
    end: endAlertSound,
    after: afterAlertSound,
  };

  // Mettre à jour les hooks audio quand les alertes changent
  useEffect(() => {
    // Arrêter tous les sons en cours
    Object.values(audioHooks).forEach(hook => hook.stopSound());
    
    // Les hooks audio seront automatiquement mis à jour avec les nouveaux sons
  }, [alerts]);

  // Nettoyer les timers lors du démontage du composant
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Nettoyer tous les timers de son
      soundTimersRef.current.forEach(timer => {
        clearTimeout(timer);
      });
      soundTimersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    refreshPresets();
  }, []);

  const refreshPresets = async () => {
    if (!isMountedRef.current) return;
    
    const savedPresets = await loadPresets();
    if (savedPresets.length > 0 && isMountedRef.current) {
      setPresets(savedPresets);
    }
  };

  const areAlertsEqual = (a1: Alert[], a2: Alert[]) => {
    if (a1.length !== a2.length) return false;
    return a1.every(alert1 => {
      const alert2 = a2.find(a => a.id === alert1.id);
      if (!alert2) return false;
      
      // Vérifier si les tableaux d'effets sont égaux
      const effectsEqual = Array.isArray(alert1.effects) && Array.isArray(alert2.effects) 
        ? alert1.effects.length === alert2.effects.length && 
          alert1.effects.every(e => alert2.effects.includes(e))
        : alert1.effect === alert2.effect; // Compatibilité avec l'ancien format
      
      return (
        alert1.enabled === alert2.enabled &&
        alert1.timeOffset === alert2.timeOffset &&
        alert1.sound === alert2.sound &&
        effectsEqual
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
      alerts: JSON.parse(JSON.stringify(alertsRef.current)), // Copie profonde pour éviter les références partagées
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

    if (isMountedRef.current) {
      setPresets(updatedPresets);
      await savePresets(updatedPresets);
    }
  };

  const loadPreset = (preset: TimerPreset) => {
    const totalMinutes = preset.minutes;
    const mins = Math.floor(totalMinutes);
    const secs = Math.round((totalMinutes - mins) * 60);
    
    setMinutes(mins);
    setSeconds(secs);
    setTimeLeft(Math.round(totalMinutes * 60));
    
    // Migrer les anciennes alertes avec 'effect' vers le nouveau format 'effects'
    const migratedAlerts = preset.alerts.map(alert => {
      // Si l'alerte a déjà un tableau 'effects', l'utiliser
      if (Array.isArray(alert.effects)) {
        // Remplacer 'pulse' par 'flash' si présent
        const newEffects = alert.effects.map(effect => 
          effect === 'pulse' ? 'flash' : effect
        );
        
        // Appliquer la durée d'alerte unifiée
        const updatedAlert = { 
          ...alert,
          effects: newEffects
        };
        
        // Mettre à jour les durées spécifiques en fonction des effets
        if (newEffects.includes('flash')) {
          updatedAlert.effectDuration = defaultAlertDuration;
        }
        
        if (newEffects.includes('shake')) {
          updatedAlert.vibrationDuration = defaultAlertDuration;
        }
        
        return updatedAlert;
      }
      
      // Sinon, convertir 'effect' en tableau 'effects'
      let newEffect = alert.effect;
      if (newEffect === 'pulse') {
        newEffect = 'flash';
      }
      
      const updatedAlert = {
        ...alert,
        effects: newEffect ? [newEffect] : [],
      };
      
      // Mettre à jour les durées spécifiques en fonction des effets
      if (newEffect === 'flash') {
        updatedAlert.effectDuration = defaultAlertDuration;
      }
      
      if (newEffect === 'shake') {
        updatedAlert.vibrationDuration = defaultAlertDuration;
      }
      
      return updatedAlert;
    });
    
    // Utiliser une copie profonde pour éviter les références partagées
    setAlerts(JSON.parse(JSON.stringify(migratedAlerts)));
    alertsRef.current = JSON.parse(JSON.stringify(migratedAlerts));
    lastTimeRef.current = Math.round(totalMinutes * 60);
    
    // Marquer comme initialisé pour éviter l'écrasement par les valeurs par défaut
    initialLoadDoneRef.current = true;
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
        // Jouer le son correspondant à l'alerte
        let audioHook;
        if (alert.id === 'before') {
          audioHook = audioHooks.before;
        } else if (alert.id === 'end') {
          audioHook = audioHooks.end;
        } else if (alert.id === 'after') {
          audioHook = audioHooks.after;
        }
        
        if (audioHook) {
          audioHook.playSound();
          
          // Configurer un timer pour arrêter le son après la durée spécifiée
          const soundDuration = alert.effectDuration || defaultAlertDuration || 5;
          
          // Créer une clé unique pour ce son
          const soundKey = `${alert.id}_${now}`;
          
          // Nettoyer tout timer existant pour cette alerte
          const existingTimer = soundTimersRef.current.get(alert.id);
          if (existingTimer) {
            clearTimeout(existingTimer);
            soundTimersRef.current.delete(alert.id);
          }
          
          // Créer un nouveau timer pour arrêter le son
          const timer = setTimeout(() => {
            if (isMountedRef.current) {
              audioHook.stopSound();
              soundTimersRef.current.delete(soundKey);
            }
          }, soundDuration * 1000);
          
          // Stocker le timer
          soundTimersRef.current.set(soundKey, timer);
        }
        
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
      
      // Nettoyer tous les timers de son
      soundTimersRef.current.forEach(timer => {
        clearTimeout(timer);
      });
      soundTimersRef.current.clear();
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
    
    // Nettoyer tous les timers de son
    soundTimersRef.current.forEach(timer => {
      clearTimeout(timer);
    });
    soundTimersRef.current.clear();
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

  return {
    minutes,
    seconds,
    isRunning,
    isPaused,
    timeLeft,
    overtime,
    alerts,
    setAlerts: (updater: React.SetStateAction<Alert[]>) => {
      // Si c'est une fonction, l'appliquer et s'assurer que le résultat est une copie profonde
      if (typeof updater === 'function') {
        setAlerts(prev => {
          const updated = updater(prev);
          return JSON.parse(JSON.stringify(updated)); // Copie profonde
        });
      } else {
        // Si c'est une valeur directe, s'assurer que c'est une copie profonde
        setAlerts(JSON.parse(JSON.stringify(updater)));
      }
    },
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