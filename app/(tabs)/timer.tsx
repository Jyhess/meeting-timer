import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { AlertEditor } from '../../src/components/Timer/AlertEditor';
import { AlertIcon } from '../../src/components/Timer/AlertIcon';
import { Icon } from '../../src/components/Timer/Icon';
import { Alert } from '../../src/types/alerts';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../src/styles/Timer.styles';
import { theme } from '../../src/theme';
import { TimeInput } from '../../src/components/Timer/TimeInput';
import { TimerOutput } from '../../src/components/Timer/TimerOutput';
import { FlashView, FlashViewRef } from '../../src/components/Timer/FlashView';
import { useTimer } from '../../src/hooks/useTimer';
import { CircularProgress } from '@/src/components/Timer/CircularProgress';
import { useIsFocused } from '@react-navigation/native';
import { SavePresetDialog } from '../../src/components/Timer/SavePresetDialog';
import { formatTimeFromSeconds } from '@/src/utils/time';

export default function TimerScreen() {
  const params = useLocalSearchParams<{ presetId?: string }>();
  const flashViewRef = useRef<FlashViewRef>(null);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [addingTime, setAddingTime] = useState(false);
  const [saveDialogVisible, setSaveDialogVisible] = useState(false);

  const {
    duration,
    timeLeft,
    isRunning,
    state,
    beforeAlert,
    endAlert,
    afterAlert,
    shouldFlash,
    hasActiveAlert,
    actions,
    presetName,
    presetColor,
  } = useTimer();

  // Calculer isValidTime
  const [validInput, setValidInput] = useState(true);
  const isValidTime = validInput && timeLeft > 0 && (!beforeAlert.enabled || timeLeft > beforeAlert.timeOffset);
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('[TimerScreen] 🔔 useEffect [isFocused] :', isFocused);
    if(isFocused) {
      if (params.presetId) {
        actions.loadPreset(params.presetId);
      } else {
        actions.resetFromDefault();
      }
    }
    else {
      actions.stop();
      setAddingTime(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused, params.presetId]);

  useEffect(() => {
    if (shouldFlash) {
      flashViewRef.current?.startAnimation();
    }
    else {
      flashViewRef.current?.stopAnimation();
    }
  }, [shouldFlash]);

  const handleStop = () => {
    actions.stop();
    setAddingTime(false);

    if (state === 'idle') {
      actions.resetFromDefault();
    }
  };

  const handleReset = () => {
    actions.reset();
    setAddingTime(false);
  };

  const getAlertTimeColor = (alert: Alert) => {
    if (alert.id === 'before' && alert.enabled && state === 'idle' && 
        timeLeft <= alert.timeOffset) {
      return theme.colors.error;
    }
    return undefined;
  };

  const handleDurationChange = (duration: number, isValidTime: boolean) => {
    setValidInput(isValidTime);
    if (isValidTime) {
      actions.setDuration(duration);
    }
  };

  const [addTimeValue, setAddTimeValue] = useState<{ seconds: number; isValid: boolean }>({ seconds: 0, isValid: false });

  const handleAddTimeChange = (seconds: number, isValidTime: boolean) => {
    let newSeconds = seconds;
    if (!isValidTime) {
      newSeconds = addTimeValue.seconds;
    }
    setAddTimeValue({ seconds: newSeconds, isValid: isValidTime });
  };

  const handleAddTime = () => {
    if (addTimeValue.isValid) {
      actions.addTime(addTimeValue.seconds);
      setAddingTime(false);
    }
  };

  const handleAddTimeClose = () => {
    setAddingTime(false);
  };

  const handleSavePress = () => {
    console.log('[TimerScreen] 🔔 handleSavePress :', duration);
    if (duration > 0) {
      setSaveDialogVisible(true);
    }
  };

  const handleSave = async (name: string, color: string) => {
    actions.savePreset(name, color);
    setSaveDialogVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View 
        style={[styles.container, { backgroundColor: presetColor ? presetColor + '66' : theme.colors.background.primary }]}
      >
        
        {isRunning && (<CircularProgress 
            duration={duration}
            timeLeft={timeLeft-1}
            isRunning={state === 'running'}
            beforeAlertOffset={beforeAlert.enabled ? beforeAlert.timeOffset : undefined}
            afterAlertOffset={afterAlert.enabled ? afterAlert.timeOffset : undefined}
          />
        )}

        <FlashView 
          ref={flashViewRef}
        />

        <View style={styles.timerContainer}>
          <View style={styles.timerAndControlsContainer}>
            {!isRunning ? (
              <TimeInput
                initialSeconds={timeLeft}
                onTimeChange={handleDurationChange}
                timeColor={!validInput || (beforeAlert.enabled && timeLeft <= beforeAlert.timeOffset) ? theme.colors.error : theme.colors.white}
              />
            ) : (
              <TimerOutput
                timeLeft={timeLeft}
                beforeAlertOffset={beforeAlert.enabled ? beforeAlert.timeOffset : undefined}
              />
            )}
            {isRunning && hasActiveAlert && (
              <Pressable 
                style={[styles.controlButton, styles.alertStopButton]} 
                onPress={() => {
                  actions.stopAlerts();
                }}
              >
                <Icon name="volume_off" size={32} color={theme.colors.danger} />
              </Pressable>
            )}

            <View style={styles.controlsContainer}>
              {!isRunning ? (
                <>
                  <Pressable 
                    style={[
                      styles.controlButton,
                      !isValidTime && styles.controlButtonDisabled
                    ]} 
                    onPress={handleSavePress}
                    disabled={!isValidTime}
                  >
                    <Icon 
                      name="bookmark" 
                      size={40} 
                      color={isValidTime ? theme.colors.primary : theme.colors.black}
                    />
                  </Pressable>
                  <Pressable style={styles.controlButton} onPress={handleStop}>
                    <Icon name="restart" size={40} color={theme.colors.danger} />
                  </Pressable>
                  <Pressable 
                    style={[
                      styles.controlButton,
                      !isValidTime && styles.controlButtonDisabled
                    ]} 
                    onPress={() => actions.start()}
                    disabled={!isValidTime}
                  >
                    <Icon 
                      name="play_arrow" 
                      size={40} 
                      color={isValidTime ? theme.colors.primary : theme.colors.black}
                    />
                  </Pressable>
                </>
              ) : (
                <>
                  <Pressable style={styles.controlButton} onPress={state === 'paused' ? actions.resume : actions.pause}>
                    <Icon 
                      name={state === 'paused' ? "play_arrow" : "pause"} 
                      size={40} 
                      color={theme.colors.secondary}
                    />
                  </Pressable>
                  <Pressable style={styles.controlButton} onPress={handleStop}>
                    <Icon name="stop" size={40} color={theme.colors.danger} />
                  </Pressable>
                  <Pressable style={styles.controlButton} onPress={handleReset}>
                    <Icon name="restart" size={40} color={theme.colors.primary} />
                  </Pressable>
                  {!addingTime && (
                    <Pressable 
                      style={styles.controlButton} 
                      onPress={() => setAddingTime(true)}
                    >
                      <Icon name="add" size={40} color={theme.colors.primary} />
                    </Pressable>
                  )}
                </>
              )}
            </View>
          </View>
          {isRunning && addingTime && (
            <View style={styles.addTimeContainer}>
              <TimeInput
                initialSeconds={addTimeValue.seconds}
                onTimeChange={handleAddTimeChange}
                timeColor={theme.colors.white}
                prefix="+"
              />
              <View style={styles.controlsContainer}>
                <Pressable
                  style={styles.controlButton}
                  onPress={handleAddTimeClose}
                >
                  <Icon name="close" size={32} color={theme.colors.danger} />
                </Pressable>
                <Pressable
                  style={[
                    styles.controlButton,
                    !addTimeValue.isValid && styles.controlButtonDisabled
                  ]}
                  onPress={handleAddTime}
                  disabled={!addTimeValue.isValid}
                >
                  <Icon name="check" size={32} color={theme.colors.primary} />
                </Pressable>
              </View>
            </View>
          )}

          {!addingTime && (
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
          )}
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
      </View>
    </SafeAreaView>    
  );
}

