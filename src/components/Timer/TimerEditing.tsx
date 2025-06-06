import React, { useState } from 'react';
import { View } from 'react-native';
import { styles } from '../../../src/styles/TimerEditing.styles';
import { theme } from '../../../src/theme';
import { TimeInput } from './TimeInput';
import { SavePresetDialog } from './SavePresetDialog';
import { formatTimeFromSeconds } from '@/src/utils/time';
import { AlertsSection } from './AlertsSection';
import { ControlButton } from '../common/ControlButton';
import { useRouter } from 'expo-router';
import { useTimer } from '@/src/contexts/TimerContext';
import { isAlertValid } from '@/src/types/alerts';

export function TimerEditing() {
   const {
     duration,
     timeLeft,
     alerts,
     presetName,
     presetColor,
     resetNewTimer,
     setDuration,
     startTimer,
     savePreset,
  } = useTimer();

  const [saveDialogVisible, setSaveDialogVisible] = useState(false);
  const [validInput, setValidInput] = useState(true);
  const isValidTime = validInput && timeLeft > 0 && alerts.every(alert => isAlertValid(alert, timeLeft));
  const router = useRouter();

  const handleReset = () => {
    resetNewTimer();
    router.setParams({ presetId: null });
  };

  const handleDurationChange = (duration: number, isValidTime: boolean) => {
    setValidInput(isValidTime);
    if (isValidTime) {
      setDuration(duration);
    }
  };

  const handleSavePress = () => {
    console.log('[TimerEditing] 🔔 handleSavePress :', duration);
    if (duration > 0) {
      setSaveDialogVisible(true);
    }
  };

  const handleSave = async (name: string, color: string) => {
    savePreset(name, color);
    setSaveDialogVisible(false);
  };

  const getTimeColor = () => {
    if (!validInput) return theme.colors.error;
    const activeAlert = alerts.find(alert => alert.enabled && timeLeft <= alert.timeOffset);
    return activeAlert ? theme.colors.error : theme.colors.white;
  };

  return (
    <View style={styles.timerEditingContainer}>
      <View style={styles.timerInputAndControlsContainer}>
        <View style={styles.timerInputContainer}>
          <TimeInput
            initialSeconds={timeLeft}
            onTimeChange={handleDurationChange}
            timeColor={getTimeColor()}
          />
        </View>
        <View style={styles.controlsContainer}>
          <View style={styles.controlsButtonsContainer}>
            <ControlButton
              icon="bookmark_add"
              onPress={handleSavePress}
              disabled={!isValidTime}
              color={isValidTime ? theme.colors.primary : theme.colors.black}
            />
            <ControlButton
              icon="delete_history"
              onPress={handleReset}
              color={theme.colors.danger}
            />
            <ControlButton
              icon="play_arrow"
              onPress={() => startTimer()}
              disabled={!isValidTime}
              color={isValidTime ? theme.colors.primary : theme.colors.black}
            />
          </View>
        </View>
      </View>
      <View style={styles.alertsContainer}>
        <AlertsSection />
      </View>
      <View>
        <SavePresetDialog
          isVisible={saveDialogVisible}
          defaultName={presetName || `Timer ${formatTimeFromSeconds(duration)}`}
          defaultColor={presetColor}
          onClose={() => setSaveDialogVisible(false)}
          onSave={handleSave}
        />
      </View>
    </View>
  );
};

