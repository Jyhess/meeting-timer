import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertEditor } from '../../src/components/Timer/AlertEditor';
import { AlertIcon } from '../../src/components/Timer/AlertIcon';
import { Icon } from '../../src/components/Timer/Icon';
import { Alert } from '../../src/types/alerts';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../../src/styles/Timer.styles';
import { theme } from '../../src/theme';
import { TimeInput } from '../../src/components/Timer/TimeInput';
import { TimerOutput } from '../../src/components/Timer/TimerOutput';
import { FlashView, FlashViewRef } from '../../src/components/Timer/FlashView';
import { ProgressBar } from '../../src/components/Timer/ProgressBar';
import { useTimer } from '../../src/hooks/useTimer';
import { CircularProgress } from '@/src/components/Timer/CircularProgress';
import { useIsFocused } from '@react-navigation/native';

export default function TimerScreen() {
  const params = useLocalSearchParams<{ presetId?: string, seed?: string }>();
  const [lastSeed, setLastSeed] = useState<string | null>(null);
  const flashViewRef = useRef<FlashViewRef>(null);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [addingTime, setAddingTime] = useState(false);

  const {
    duration,
    timeLeft,
    isRunning,
    state,
    beforeAlert,
    endAlert,
    afterAlert,
    effectDuration,
    shouldFlash,
    hasActiveAlert,
    actions,
  } = useTimer();

  // Calculer isValidTime
  const [validInput, setValidInput] = useState(true);
  const isValidTime = validInput && timeLeft > 0 && (!beforeAlert.enabled || timeLeft > beforeAlert.timeOffset);
 const isFocused = useIsFocused();

 useEffect(() => {
  console.log('[TimerScreen] 🔔 useEffect [isFocused] :', isFocused);
  if (! isFocused) {
    actions.stop();
    setAddingTime(false);
  }
 }, [isFocused]);

  // Réinitialiser le timer quand le seed change
  useEffect(() => {
    if (params.seed && params.seed !== lastSeed) {
      setLastSeed(params.seed || null);
      console.log('[TimerScreen] 🔔 useEffect [params.seed] :', params.seed, lastSeed);
      if (params.presetId) {
        actions.loadPreset(params.presetId);
      } else {
        actions.resetFromDefault();
      }
    }
  }, [params.seed, params.presetId, lastSeed, actions]);

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
      router.replace('/');
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

  const progressBar = false;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <LinearGradient 
        colors={[theme.colors.background.primary, theme.colors.background.secondary]} 
        style={styles.container}
      >
        
        {isRunning && (
          <>
          {progressBar ? (
            <ProgressBar
              duration={duration}
              timeLeft={timeLeft-1}
              isRunning={state === 'running'}
              beforeAlertOffset={beforeAlert.enabled ? beforeAlert.timeOffset : undefined}
            />
          ) : (<CircularProgress 
              duration={duration}
              timeLeft={timeLeft-1}
              isRunning={state === 'running'}
              beforeAlertOffset={beforeAlert.enabled ? beforeAlert.timeOffset : undefined}
              afterAlertOffset={afterAlert.enabled ? afterAlert.timeOffset : undefined}
            />
          )}
          </>
        )}

        <FlashView 
          ref={flashViewRef}
          effectDuration={effectDuration}
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
                  <Pressable style={styles.controlButton} onPress={handleStop}>
                    <Icon name="close" size={40} color={theme.colors.danger} />
                  </Pressable>
                  <Pressable 
                    style={[
                      styles.controlButton,
                      !isValidTime && styles.controlButtonDisabled
                    ]} 
                    onPress={actions.start}
                    disabled={!isValidTime}
                  >
                    <Icon 
                      name="play_arrow" 
                      size={40} 
                      color={isValidTime ? theme.colors.primary : theme.colors.disabled}
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
      </LinearGradient>
    </SafeAreaView>    
  );
}

