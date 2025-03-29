import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const styles = StyleSheet.create({
  keypadContainer: {
    width: '100%',
    flex: 1,
    marginBottom: theme.spacing.small,
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: theme.layout.maxButtonSize*4 + theme.spacing.medium*3,
  },
  keypadRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing.medium,
    marginBottom: theme.spacing.small,
    aspectRatio: 3,
  },
  keypadButton: {
    aspectRatio: 1,
    height: '100%',
    maxHeight: theme.layout.maxButtonSize,
    borderRadius: theme.borders.radius.round,
    backgroundColor: theme.colors.gray.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadButtonText: {
    fontSize: theme.typography.fontSize.large,
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
  },
}); 