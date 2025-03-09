import { useEffect, useState, useRef } from 'react';
import { Alert } from '../types/timer';
import { SettingsManager } from '../utils/SettingsManager';

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
  const settingsManagerRef = useRef<SettingsManager>(new SettingsManager());
  const [defaultTimerMinutes, setDefaultTimerMinutes] = useState(
    settingsManagerRef.current.getDefaultTimerMinutes()
  );
  const [defaultAlertDuration, setDefaultAlertDuration] = useState(
    settingsManagerRef.current.getDefaultAlertDuration()
  );
  const [beforeAlert, setBeforeAlert] = useState(
    settingsManagerRef.current.getBeforeAlert()
  );
  const [endAlert, setEndAlert] = useState(
    settingsManagerRef.current.getEndAlert()
  );
  const [afterAlert, setAfterAlert] = useState(
    settingsManagerRef.current.getAfterAlert()
  );

  useEffect(() => {
    const manager = settingsManagerRef.current;

    const onDefaultTimerMinutesChange = (minutes: number) => {
      setDefaultTimerMinutes(minutes);
    };

    const onDefaultAlertDurationChange = (duration: number) => {
      setDefaultAlertDuration(duration);
    };

    const onBeforeAlertChange = (alert: Alert) => {
      setBeforeAlert(alert);
    };

    const onEndAlertChange = (alert: Alert) => {
      setEndAlert(alert);
    };

    const onAfterAlertChange = (alert: Alert) => {
      setAfterAlert(alert);
    };

    manager.addEventListener('defaultTimerMinutesChange', onDefaultTimerMinutesChange);
    manager.addEventListener('defaultAlertDurationChange', onDefaultAlertDurationChange);
    manager.addEventListener('beforeAlertChange', onBeforeAlertChange);
    manager.addEventListener('endAlertChange', onEndAlertChange);
    manager.addEventListener('afterAlertChange', onAfterAlertChange);

    return () => {
      manager.removeEventListener('defaultTimerMinutesChange', onDefaultTimerMinutesChange);
      manager.removeEventListener('defaultAlertDurationChange', onDefaultAlertDurationChange);
      manager.removeEventListener('beforeAlertChange', onBeforeAlertChange);
      manager.removeEventListener('endAlertChange', onEndAlertChange);
      manager.removeEventListener('afterAlertChange', onAfterAlertChange);
      manager.dispose();
    };
  }, []);

  return {
    defaultTimerMinutes,
    defaultAlertDuration,
    defaultAlerts: [beforeAlert, endAlert, afterAlert],
    setDefaultTimerMinutes: (minutes: number) => {
      settingsManagerRef.current.setDefaultTimerMinutes(minutes);
    },
    setDefaultAlertDuration: (duration: number) => {
      settingsManagerRef.current.setDefaultAlertDuration(duration);
    },
    updateDefaultAlert: (alert: Alert) => {
      switch (alert.id) {
        case 'before':
          settingsManagerRef.current.updateBeforeAlert(alert);
          break;
        case 'end':
          settingsManagerRef.current.updateEndAlert(alert);
          break;
        case 'after':
          settingsManagerRef.current.updateAfterAlert(alert);
          break;
      }
    },
  };
};