import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const styles = StyleSheet.create({
  sliderTrack: {
    width: 56,
    height: 28,
    borderRadius: theme.borders.radius.round,
    justifyContent: 'center',
    padding: theme.spacing.xs,
  },
  sliderThumb: {
    width: 24,
    height: 24,
    borderRadius: theme.borders.radius.round,
    backgroundColor: theme.colors.white,
    position: 'absolute',
    left: theme.spacing.xs,
  },
  touchArea: {
    ...StyleSheet.absoluteFillObject,
  },
});