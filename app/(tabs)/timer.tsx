import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertEditor } from '../../src/components/Timer/AlertEditor';
import { AlertIcon } from '../../src/components/Timer/AlertIcon';
import { Icon } from '../../src/components/Timer/Icon';
import { useTimer } from '../../src/hooks/useTimer';
import { Alert } from '../../src/types/timer';
import { useLocalSearchParams, router } from 'expo-router';

export default function TimerScreen() {
  const params = useLocalSearchParams<{ presetId?: string }>();
  const {
    minutes,
    seconds,
    isRunning,
    isPaused,
    timeLeft,
    alerts,
    setAlerts,
    activeSound,
    stopActiveSound,
    presets,
    loadPreset,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    handleNumberPress,
    handleBackspace,
    handleColonPress,
    inputMode,
  } = useTimer(30);

  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  React.useEffect(() => {
    if (params.presetId) {
      const preset = presets.find((p) => p.id === params.presetId);
      if (preset) {
        loadPreset(preset);
      }
    }
  }, [params.presetId, presets]);

  const handleStop = () => {
    stopTimer();
    router.replace('/');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(Math.abs(seconds) / 60);
    const secs = Math.abs(seconds) % 60;
    const prefix = seconds < 0 ? '-' : '';
    return `${prefix}${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const beforeAlert = alerts.find((a) => a.id === 'before' && a.enabled);
    if (timeLeft < 0) return '#f44336';
    if (beforeAlert && timeLeft <= beforeAlert.timeOffset * 60)
      return '#FF9800';
    return '#fff';
  };

  const renderKeypadButton = (num: number) => (
    <Pressable
      style={styles.keypadButton}
      onPress={() => handleNumberPress(num)}
    >
      <Text style={styles.keypadButtonText}>{num}</Text>
    </Pressable>
  );

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={styles.container}>
      <BlurView intensity={50} style={styles.timerContainer}>
        <View style={styles.timeDisplayContainer}>
          <View style={styles.timeDisplay}>
            <Text style={[styles.timeText, { color: getTimeColor() }]}>
              {!isRunning
                ? `${minutes.toString().padStart(2, '0')}:${seconds
                    .toString()
                    .padStart(2, '0')}`
                : formatTime(timeLeft)}
            </Text>
            {!isRunning && (
              <Text style={styles.inputModeText}>
                {inputMode === 'minutes' ? 'Minutes' : 'Secondes'}
              </Text>
            )}
          </View>
          {activeSound && (
            <Pressable style={styles.stopSoundButton} onPress={stopActiveSound}>
              <Icon name="no-sound" size={24} color="#fff" />
            </Pressable>
          )}
        </View>

        {!isRunning && (
          <View style={styles.keypad}>
            <View style={styles.keypadRow}>
              {renderKeypadButton(1)}
              {renderKeypadButton(2)}
              {renderKeypadButton(3)}
            </View>
            <View style={styles.keypadRow}>
              {renderKeypadButton(4)}
              {renderKeypadButton(5)}
              {renderKeypadButton(6)}
            </View>
            <View style={styles.keypadRow}>
              {renderKeypadButton(7)}
              {renderKeypadButton(8)}
              {renderKeypadButton(9)}
            </View>
            <View style={styles.keypadRow}>
              <Pressable
                style={[styles.keypadButton, styles.specialButton]}
                onPress={handleBackspace}
              >
                <Icon name="backspace" size={24} color="#fff" />
              </Pressable>
              {renderKeypadButton(0)}
              <Pressable
                style={[styles.keypadButton, styles.specialButton]}
                onPress={handleColonPress}
              >
                <Text style={[styles.keypadButtonText, { fontSize: 32 }]}>
                  :
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.controls}>
          {!isRunning ? (
            <Pressable
              style={[styles.button, styles.startButton]}
              onPress={startTimer}
            >
              <Icon name="play-arrow" size={24} color="#fff" />
            </Pressable>
          ) : (
            <>
              <Pressable
                style={[styles.button, styles.stopButton]}
                onPress={handleStop}
              >
                <Icon name="stop" size={24} color="#fff" />
              </Pressable>
              <Pressable
                style={[styles.button, styles.pauseButton]}
                onPress={isPaused ? resumeTimer : pauseTimer}
              >
                <Icon
                  name={isPaused ? 'resume' : 'pause'}
                  size={24}
                  color="#fff"
                />
              </Pressable>
            </>
          )}
        </View>

        <View style={styles.alertsContainer}>
          <View style={styles.alertsList}>
            {alerts.map((alert) => (
              <AlertIcon
                key={alert.id}
                alert={alert}
                isActive={
                  alert.enabled &&
                  (alert.id === 'end'
                    ? timeLeft === 0
                    : alert.id === 'before'
                    ? timeLeft <= alert.timeOffset * 60 && timeLeft > 0
                    : timeLeft < 0 &&
                      Math.abs(timeLeft) >= alert.timeOffset * 60)
                }
                onPress={() => setEditingAlert(alert)}
                onToggle={(enabled) => {
                  setAlerts((prev) =>
                    prev.map((a) => (a.id === alert.id ? { ...a, enabled } : a))
                  );
                }}
              />
            ))}
          </View>
        </View>
      </BlurView>

      {editingAlert && (
        <AlertEditor
          alert={editingAlert}
          isVisible={true}
          onClose={() => setEditingAlert(null)}
          onSave={(updatedAlert) => {
            setAlerts((prev) =>
              prev.map((alert) =>
                alert.id === updatedAlert.id ? updatedAlert : alert
              )
            );
            setEditingAlert(null);
          }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  timeDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 20,
  },
  timeDisplay: {
    alignItems: 'center',
  },
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  inputModeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  stopSoundButton: {
    position: 'absolute',
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keypad: {
    marginBottom: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  keypadButton: {
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadButtonText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '500',
  },
  specialButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
  },
  stopButton: {
    backgroundColor: '#f44336',
  },
  pauseButton: {
    backgroundColor: '#FF9800',
  },
  alertsContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 20,
  },
  alertsList: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
});
