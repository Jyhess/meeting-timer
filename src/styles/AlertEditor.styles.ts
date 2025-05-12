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
    borderRadius: theme.borders.radius.medium,
    padding: theme.spacing.medium,
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
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.small,
    justifyContent: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.medium,
  },
  noSoundsText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.gray.light,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.medium,
    justifyContent: 'center',
    marginTop: theme.spacing.medium,
  },
});