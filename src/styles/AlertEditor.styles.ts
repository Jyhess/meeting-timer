import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(40, 40, 40, 0.95)',
    borderRadius: 20,
    padding: 20,
    maxHeight: Platform.OS === 'android' ? '90%' : '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#eee',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 10,
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
    gap: 15,
  },
  timeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeOffsetText: {
    fontSize: 20,
    color: '#eee',
    width: 40,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  optionButton: {
    width: '48%',
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  optionButtonActive: {
    backgroundColor: '#4CAF50',
  },
  optionText: {
    color: '#888',
    marginTop: 5,
    textAlign: 'center',
    fontSize: 14,
  },
  optionTextActive: {
    color: '#eee',
  },
  effectNote: {
    fontSize: 10,
    fontStyle: 'italic',
  },
  effectIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    flex: 1,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#eee',
    fontWeight: 'bold',
  },
  stopSoundButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f44336',
    alignItems: 'center',
    justifyContent: 'center',
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