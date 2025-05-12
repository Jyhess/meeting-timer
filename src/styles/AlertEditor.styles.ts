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
    backgroundColor: theme.colors.background.primary,
    borderRadius: 12,
    padding: 20,
    width: Math.min(screenWidth - 20, 500),
    maxWidth: '100%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
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
  noSoundsText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.gray.light,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  nameInput: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: 8,
    padding: 12,
    color: theme.colors.white,
    fontSize: 16,
    marginTop: 8,
  },
  modalButtonDanger: {
    backgroundColor: theme.colors.danger,
  },
  modalButtonTextDanger: {
    color: theme.colors.white,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
    marginTop: 12,
  },
});