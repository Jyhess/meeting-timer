import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const styles = StyleSheet.create({
  alertItemContainer: {
    alignItems: 'center',
    gap: theme.spacing.small,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: theme.spacing.medium,
    borderRadius: theme.borders.radius.large,
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
    marginBottom: theme.spacing.xs,
  },
  alertIconActive: {
    opacity: 1,
  },
  alertIconDisabled: {
    opacity: theme.effects.opacity.disabled,
  },
  alertTime: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.gray.light,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  alertTimeActive: {
    color: theme.colors.white,
    fontWeight: theme.typography.fontWeight.bold,
  },
  alertTimeDisabled: {
    color: theme.colors.gray.dark,
  },
  sliderContainer: {
    width: 50,
    alignItems: 'center',
    marginTop: theme.spacing.xs,
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
    borderRadius: theme.borders.radius.round,
    backgroundColor: theme.colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  effectIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  effectIcon: {
    opacity: theme.effects.opacity.disabled,
  },
});