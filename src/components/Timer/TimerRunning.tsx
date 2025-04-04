import React, { useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { Alert } from '../../../src/types/alerts';
import { styles } from '../../styles/TimerRunning.styles';
import { theme } from '../../../src/theme';
import { TimeInput } from './TimeInput';
import { TimeDisplay } from './TimeDisplay';
import { FlashView, FlashViewRef } from './FlashView';
import { CircularProgress } from '@/src/components/Timer/CircularProgress';
import { AlertsSection } from './AlertsSection';
import { ControlButton } from './ControlButton';
import { formatTimeFromSeconds } from '@/src/utils/time';

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

  const getTimeColor = () => {
    if (timeLeft < 0) {
      return theme.colors.error;
    }
    if (beforeAlert.enabled && timeLeft <= beforeAlert.timeOffset) {
      return theme.colors.secondary;
    }
    return theme.colors.white;
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

      <FlashView ref={flashViewRef} />

      <View style={styles.timerRunningAndControlsContainer}>
        <View style={styles.timerContainer}>
          <TimeDisplay
            timeBuffer={formatTimeFromSeconds(timeLeft)}
            timeColor={getTimeColor()}
            />
          </View>

          <View style={styles.controlsContainer}>
            <View style={styles.controlsButtonsContainer}>
              {state === 'paused' ? (
                <ControlButton
                  icon="play_arrow"
                  onPress={() => actions.resume()}
                  color={theme.colors.secondary}
                />
              ) : (
                <ControlButton
                  icon="pause"
                  onPress={() => actions.pause()}
                  color={theme.colors.secondary}
                />
              )}
              <ControlButton
                icon="stop"
                onPress={() => handleStop()}
                color={theme.colors.danger}
              />
              <ControlButton
                icon="restart"
                onPress={() => handleReset()}
                color={theme.colors.danger}
              />
              <ControlButton
                icon="add"
                onPress={() => setAddingTime(true)}
                color={theme.colors.primary}
                disabled={addingTime}
              />
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
            <View style={styles.addTimeControlsContainer}>
              <View style={styles.controlsButtonsContainer}>
                <ControlButton
                  icon="close"
                  onPress={handleAddTimeClose}
                  color={theme.colors.danger}
                />
                <ControlButton
                  icon="check"
                  onPress={handleAddTime}
                  disabled={!addTimeValue.isValid}
                  color={theme.colors.primary}
                />
              </View>
            </View>
          </View>
        )}
        {!addingTime && (
          <AlertsSection
            beforeAlert={beforeAlert}
            endAlert={endAlert}
            afterAlert={afterAlert}
            isRunning={isRunning}
            timeLeft={timeLeft}
            actions={actions}
          />
        )}
      </View>
        {hasActiveAlert && (
          <ControlButton 
            icon="volume_off"
            onPress={() => {
              actions.stopAlerts();
            }}
            color={theme.colors.danger}
            size={32}
            style={{...styles.alertStopButton, zIndex: 3}}
          />
        )}
    </View>
  );
}

