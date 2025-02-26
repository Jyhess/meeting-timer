import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  alertItemContainer: {
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    borderRadius: 16,
    minWidth: 100,
  },
  alertIconContainer: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
  },
  alertIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  alertIconActive: {
    opacity: 1,
  },
  alertIconDisabled: {
    opacity: 0.5,
  },
  alertTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  alertTimeActive: {
    color: '#fff',
    fontWeight: '700',
  },
  alertTimeDisabled: {
    color: '#555',
  },
  sliderContainer: {
    width: 50,
    alignItems: 'center',
    marginTop: 4,
  },
  stopSoundButtonContainer: {
    position: 'absolute',
    top: -12,
    right: 0,
    zIndex: 1,
  },
  stopSoundButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
  },
});