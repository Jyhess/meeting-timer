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
    width: Math.min(screenWidth - 20, 500),
    maxWidth: '100%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  timeInputContainer: {
    flex: 1,
    width: '100%',
    height: theme.layout.maxTimeInputHeight,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.small,
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
  noSoundsText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.gray.light,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
});