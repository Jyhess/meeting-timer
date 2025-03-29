import React, { useState } from 'react';
import { View } from 'react-native';
import { AlertIcon } from './AlertIcon';
import { AlertEditor } from './AlertEditor';
import { Alert } from '../../types/alerts';
import { styles } from '../../styles/AlertsSection.styles';
import { theme } from '../../theme';

interface AlertsSectionProps {
  beforeAlert: Alert;
  endAlert: Alert;
  afterAlert: Alert;
  isRunning: boolean;
  timeLeft: number;
  actions: {
    updateAlert: (alert: Alert) => void;
  };
}

export const AlertsSection: React.FC<AlertsSectionProps> = ({
  beforeAlert,
  endAlert,
  afterAlert,
  isRunning,
  timeLeft,
  actions,
}) => {
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  const getAlertTimeColor = (alert: Alert) => {
    if (alert.id === 'before' && alert.enabled && timeLeft <= alert.timeOffset) {
      return theme.colors.error;
    }
    return undefined;
  };

  return (
    <>
      <View style={styles.alertsContainer}>
        {[beforeAlert, endAlert, afterAlert].map((alert) => alert && (
          <AlertIcon
            key={alert.id}
            alert={alert}
            isActive={
              alert.enabled &&
              isRunning &&
              (alert.id === 'end'
                ? timeLeft <= 0
                : alert.id === 'before'
                ? timeLeft <= alert.timeOffset
                : timeLeft < 0 &&
                  Math.abs(timeLeft) >= alert.timeOffset)
            }
            onPress={() => setEditingAlert(alert)}
            onToggle={(enabled) => {
              const updatedAlert = { ...alert, enabled };
              actions.updateAlert(updatedAlert);
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
              actions.updateAlert(updatedAlert);
              setEditingAlert(null);
            }}
          />
        </View>
      )}
    </>
  );
}; 