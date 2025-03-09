import { useState, useEffect } from 'react';
import { Alert } from '../types/timer';
import { loadSettings, saveSettings as saveSettingsToStorage } from '../lib/storage';

// Alertes par défaut
const DEFAULT_ALERTS: Alert[] = [
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
];

// Durée des alertes par défaut (en secondes)
const DEFAULT_ALERT_DURATION = 5;

export type Settings = {
  defaultTimerMinutes: number;
  defaultAlerts: Alert[];
  defaultAlertDuration: number;
};

export const useSettings = () => {
  const [defaultTimerMinutes, setDefaultTimerMinutes] = useState<number>(30);
  const [defaultAlerts, setDefaultAlerts] = useState<Alert[]>(DEFAULT_ALERTS);
  const [defaultAlertDuration, setDefaultAlertDuration] = useState<number>(DEFAULT_ALERT_DURATION);
  const [isLoaded, setIsLoaded] = useState(false);

  // Charger les paramètres au démarrage
  useEffect(() => {
    const loadUserSettings = async () => {
      try {
        const settings = await loadSettings();
        if (settings) {
          if (settings.defaultTimerMinutes) {
            setDefaultTimerMinutes(settings.defaultTimerMinutes);
          }
          
          if (settings.defaultAlertDuration) {
            setDefaultAlertDuration(settings.defaultAlertDuration);
          }
          
          if (settings.defaultAlerts) {
            setDefaultAlerts(settings.defaultAlerts);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadUserSettings();
  }, []);

  // Sauvegarder les paramètres
  const saveSettings = async () => {
    try {
      const settings: Settings = {
        defaultTimerMinutes,
        defaultAlerts,
        defaultAlertDuration,
      };
      await saveSettingsToStorage(settings);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
    }
  };

  // Effet pour sauvegarder automatiquement les paramètres lorsqu'ils changent
  useEffect(() => {
    if (isLoaded) {
      saveSettings();
    }
  }, [defaultAlerts, defaultTimerMinutes, defaultAlertDuration, isLoaded]);

  return {
    defaultTimerMinutes,
    setDefaultTimerMinutes,
    defaultAlerts,
    setDefaultAlerts,
    defaultAlertDuration,
    setDefaultAlertDuration,
    isLoaded,
    saveSettings,
  };
};