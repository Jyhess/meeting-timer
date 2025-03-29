import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { Icon } from './Icon';
import { Alert } from '../../../src/types/alerts';
import { styles } from '../../../src/styles/Timer.styles';
import { theme } from '../../../src/theme';
import { TimeInput } from './TimeInput';
import { TimerOutput } from './TimerOutput';
import { FlashView, FlashViewRef } from './FlashView';
import { CircularProgress } from '@/src/components/Timer/CircularProgress';
import { AlertsSection } from './AlertsSection';

interface TimerRunningProps {
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

export const TimerRunning: React.FC<TimerRunningProps> = ({
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
}) => {
  const flashViewRef = useRef<FlashViewRef>(null);
  const [addingTime, setAddingTime] = useState(false);
  const [addTimeValue, setAddTimeValue] = useState<{ seconds: number; isValid: boolean }>({ seconds: 0, isValid: false });

  useEffect(() => {
    console.log('[TimerRunning] 🔔 useEffect [isRunning] :', isRunning);
    if(!isRunning) {
      actions.stop();
      setAddingTime(false);
    }
  }, [isRunning]);

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
  };

  const handleReset = () => {
    actions.reset();
    setAddingTime(false);
  };

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

  return (
    <View style={styles.timerRunningContainer}>
      <CircularProgress 
          duration={duration}
          timeLeft={timeLeft-1}
          isRunning={state === 'running'}
          beforeAlertOffset={beforeAlert.enabled ? beforeAlert.timeOffset : undefined}
          afterAlertOffset={afterAlert.enabled ? afterAlert.timeOffset : undefined}
        />

      <FlashView 
        ref={flashViewRef}
      />

      <View style={styles.timerContainer}>
        <View style={styles.timerAndControlsContainer}>
          <TimerOutput
          timeLeft={timeLeft}
          beforeAlertOffset={beforeAlert.enabled ? beforeAlert.timeOffset : undefined}
          />
          {hasActiveAlert && (
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
          </View>
        </View>
        {addingTime && (
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
        <AlertsSection
            beforeAlert={beforeAlert}
            endAlert={endAlert}
            afterAlert={afterAlert}
            isRunning={isRunning}
            timeLeft={timeLeft}
            actions={actions}
          />

      </View>
    </View>
  );
}

