import React, { useState } from 'react';
import { View } from 'react-native';
import { Alert } from '../../../src/types/alerts';
import { styles } from '../../../src/styles/TimerEditing.styles';
import { theme } from '../../../src/theme';
import { TimeInput } from './TimeInput';
import { SavePresetDialog } from './SavePresetDialog';
import { formatTimeFromSeconds } from '@/src/utils/time';
import { AlertsSection } from './AlertsSection';
import { ControlButton } from './ControlButton';

interface TimerEditingProps {
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  state: 'idle' | 'running' | 'paused';
  beforeAlert: Alert;
  endAlert: Alert;
  afterAlert: Alert;
  effectDuration: number;
  presetName: string;
  presetColor: string;
  shouldFlash: boolean;
  hasActiveAlert: boolean;
  actions: any,
}

export const TimerEditing: React.FC<TimerEditingProps> = ({
    duration,
    timeLeft,
    isRunning,
    beforeAlert,
    endAlert,
    afterAlert,
    presetName,
    presetColor,
    actions,
}) => {
  const [saveDialogVisible, setSaveDialogVisible] = useState(false);
  const [validInput, setValidInput] = useState(true);
  const isValidTime = validInput && timeLeft > 0 && (!beforeAlert.enabled || timeLeft > beforeAlert.timeOffset);

  const handleReset = () => {
    actions.resetFromDefault();
  };

  const handleDurationChange = (duration: number, isValidTime: boolean) => {
    setValidInput(isValidTime);
    if (isValidTime) {
      actions.setDuration(duration);
    }
  };

  const handleSavePress = () => {
    console.log('[TimerEditing] 🔔 handleSavePress :', duration);
    if (duration > 0) {
      setSaveDialogVisible(true);
    }
  };

  const handleSave = async (name: string, color: string) => {
    actions.savePreset(name, color);
    setSaveDialogVisible(false);
  };

  return (       
    <View style={styles.timerEditingContainer}>
        <View style={styles.timerInputAndControlsContainer}>
          <View style={styles.timerInputContainer}>
              <TimeInput
                  initialSeconds={timeLeft}
                  onTimeChange={handleDurationChange}
                  timeColor={!validInput || (beforeAlert.enabled && timeLeft <= beforeAlert.timeOffset) ? theme.colors.error : theme.colors.white}
              />
          </View>
          <View style={styles.controlsContainer}>
            <View style={styles.controlsButtonsContainer}>
              <ControlButton
                icon="bookmark"
                onPress={handleSavePress}
                disabled={!isValidTime}
                color={isValidTime ? theme.colors.primary : theme.colors.black}
              />
              <ControlButton
                icon="restart"
                onPress={handleReset}
                color={theme.colors.danger}
              />
              <ControlButton
                icon="play_arrow"
                onPress={() => actions.start()}
                disabled={!isValidTime}
                color={isValidTime ? theme.colors.primary : theme.colors.black}
              />
            </View>
          </View>
        </View>
        <View style={styles.alertsContainer}>
          <AlertsSection
            beforeAlert={beforeAlert}
            endAlert={endAlert}
            afterAlert={afterAlert}
            isRunning={isRunning}
            timeLeft={timeLeft}
            actions={actions}
          />
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
}

