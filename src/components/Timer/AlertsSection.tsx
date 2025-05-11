import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AlertIcon } from './AlertIcon';
import { AlertEditor } from './AlertEditor';
import { theme } from '../../theme';
import { useTimer } from '@/src/contexts/TimerContext';
import { Alert, isAlertActive, isAlertValid } from '@/src/types/alerts';
import { Icon } from './Icon';

export function AlertsSection() {
  const {
    alerts,
    isRunning,
    timeLeft,
    updateAlert,
    addAlert,
    removeAlert,
  } = useTimer();

  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  const getAlertTimeColor = (alert: Alert) => {
    if (!isAlertValid(alert, timeLeft)) {
      return theme.colors.error;
    }
    return undefined;
  };

  const handleAddAlert = () => {
    const newAlert: Alert = {
      id: `alert_${Date.now()}`,
      type: 'before',
      name: '',
      enabled: true,
      timeOffset: 30,
      sound: 'bell',
      effects: ['flash'],
    };
    addAlert(newAlert);
    setEditingAlert(newAlert);
  };

  const handleDeleteAlert = (alert: Alert) => {
    removeAlert(alert.id);
    setEditingAlert(null);
  };

  return (
    <>
      <View style={styles.alertsContainer}>
        {alerts.map((alert) => (
          <AlertIcon
            key={alert.id}
            alert={alert}
            isActive={isRunning && isAlertActive(alert, timeLeft)}
            onPress={() => setEditingAlert(alert)}
            onToggle={(enabled) => {
              const updatedAlert = { ...alert, enabled };
              updateAlert(updatedAlert);
            }}
            timeColor={getAlertTimeColor(alert)}
          />
        ))}
        {!isRunning && (
          <Pressable
            style={styles.addButton}
            onPress={handleAddAlert}
            disabled={isRunning}
          >
            <Icon 
              name="add_alert" 
              size={24} 
              color={theme.colors.primary} 
            />
          </Pressable>
        )}
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
            onDelete={() => handleDeleteAlert(editingAlert)}
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
    alignItems: 'center',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.small,
  },
});
