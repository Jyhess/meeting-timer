import { useEffect, useState } from 'react';
import { Alert } from '../types/timer';
import { SettingsManager } from '../utils/SettingsManager';


export type Settings = {
  defaultDurationSeconds: number;
  defaultAlerts: Alert[];
  defaultAlertDuration: number;
};

export const useSettings = () => {
  const settingsManager = SettingsManager.getInstance();
  const [defaultDurationSeconds, setDefaultDurationSeconds] = useState(
    settingsManager.getDefaultDurationSeconds()
  );
  const [defaultAlertDuration, setDefaultAlertDuration] = useState(
    settingsManager.getDefaultAlertDuration()
  );
  const [beforeAlert, setBeforeAlert] = useState(
    settingsManager.getBeforeAlert()
  );
  const [endAlert, setEndAlert] = useState(
    settingsManager.getEndAlert()
  );
  const [afterAlert, setAfterAlert] = useState(
    settingsManager.getAfterAlert()
  );

  useEffect(() => {
    const onDefaultDurationSecondsChange = (seconds: number) => {
      setDefaultDurationSeconds(seconds);
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

    settingsManager.addEventListener('defaultDurationSecondsChange', onDefaultDurationSecondsChange);
    settingsManager.addEventListener('defaultAlertDurationChange', onDefaultAlertDurationChange);
    settingsManager.addEventListener('beforeAlertChange', onBeforeAlertChange);
    settingsManager.addEventListener('endAlertChange', onEndAlertChange);
    settingsManager.addEventListener('afterAlertChange', onAfterAlertChange);

    return () => {
      settingsManager.removeEventListener('defaultDurationSecondsChange', onDefaultDurationSecondsChange);
      settingsManager.removeEventListener('defaultAlertDurationChange', onDefaultAlertDurationChange);
      settingsManager.removeEventListener('beforeAlertChange', onBeforeAlertChange);
      settingsManager.removeEventListener('endAlertChange', onEndAlertChange);
      settingsManager.removeEventListener('afterAlertChange', onAfterAlertChange);
    };
  }, []);

  return {
    defaultDurationSeconds,
    defaultAlertDuration,
    defaultAlerts: [beforeAlert, endAlert, afterAlert],
    setDefaultDurationSeconds: (seconds: number) => {
      settingsManager.setDefaultDurationSeconds(seconds);
    },
    setDefaultAlertDuration: (duration: number) => {
      settingsManager.setDefaultAlertDuration(duration);
    },
    updateDefaultAlert: (alert: Alert) => {
      switch (alert.id) {
        case 'before':
          settingsManager.updateBeforeAlert(alert);
          break;
        case 'end':
          settingsManager.updateEndAlert(alert);
          break;
        case 'after':
          settingsManager.updateAfterAlert(alert);
          break;
      }
    },
  };
};