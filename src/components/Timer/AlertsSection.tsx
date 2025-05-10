import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { AlertIcon } from './AlertIcon';
import { AlertEditor } from './AlertEditor';
import { theme } from '../../theme';
import { useTimer } from '@/src/contexts/TimerContext';
import { Alert } from '@/src/types/alerts';

export function AlertsSection() {
  const {
    alerts,
    isRunning,
    timeLeft,
    updateAlert,
  } = useTimer();

  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  const getAlertTimeColor = (alert: Alert) => {
    if (alert.id === 'before' && alert.enabled && timeLeft <= alert.timeOffset) {
      return theme.colors.error;
    }
    return undefined;
  };

  const isAlertActive = (alert: Alert) => {
    if (!alert.enabled || !isRunning) return false;

    switch (alert.id) {
      case 'end':
        return timeLeft <= 0;
      case 'before':
        return timeLeft <= alert.timeOffset;
      case 'after':
        return timeLeft < 0 && Math.abs(timeLeft) >= alert.timeOffset;
      default:
        return false;
    }
  };

  return (
    <>
      <View style={styles.alertsContainer}>
        {alerts.map((alert) => (
          <AlertIcon
            key={alert.id}
            alert={alert}
            isActive={isAlertActive(alert)}
            onPress={() => setEditingAlert(alert)}
            onToggle={(enabled) => {
              const updatedAlert = { ...alert, enabled };
              updateAlert(updatedAlert);
            }}
            timeColor={getAlertTimeColor(alert)}
          />
        ))}
      </View>

      {editingAlert && (
        <View>
          <AlertEditor
            alert={editingAlert}
            isVisible={true}
            onClose={() => setEditingAlert(null)}
            onSave={(updatedAlert) => {
              updateAlert(updatedAlert);
              setEditingAlert(null);
            }}
          />
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  alertsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
