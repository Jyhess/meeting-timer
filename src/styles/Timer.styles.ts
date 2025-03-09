import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timerContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    zIndex: 2,
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
    color: '#888',
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
    color: '#eee',
    fontWeight: '500',
  },
  keypadButtonTextActive: {
    color: '#4CAF50',
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
  controlButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  controlButtonDisabled: {
    opacity: 0.5,
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
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  alertsList: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
});