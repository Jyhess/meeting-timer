import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../theme';

const { width: screenWidth } = Dimensions.get('window');

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    width: Math.min(screenWidth - 40, 500),
    maxWidth: '95%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  timeOffsetControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  timeButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 8,
  },
  timeOffsetText: {
    fontSize: 20,
    color: '#fff',
    minWidth: 30,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  optionButtonActive: {
    backgroundColor: '#666',
  },
  optionText: {
    color: '#666',
    marginTop: 8,
    fontSize: 14,
  },
  optionTextActive: {
    color: '#fff',
  },
  effectNote: {
    fontSize: 12,
    color: '#999',
  },
  effectIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  modalButtonDisabled: {
    backgroundColor: theme.colors.disabled,
    opacity: 0.5,
  },
  modalButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalButtonTextDisabled: {
    color: theme.colors.gray.light,
  },
  stopSoundButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 8,
  },
  playButton: {
    marginTop: 5,
    padding: 5,
  },
  infoMessage: {
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(255, 152, 0, 0.2)',
    borderRadius: 8,
    marginTop: 8,
  },
  infoMessageText: {
    color: '#FF9800',
    fontSize: 12,
    textAlign: 'center',
  },
});