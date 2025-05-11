import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const styles = StyleSheet.create({
  alertItemContainer: {
    alignItems: 'center',
    gap: theme.spacing.small,
    backgroundColor: theme.colors.background.tertiary,
    padding: theme.spacing.medium,
    borderRadius: theme.borders.radius.large,
    minWidth: 40,
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
  sliderContainer: {
    width: 50,
    alignItems: 'center',
    marginTop: theme.spacing.xs,
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