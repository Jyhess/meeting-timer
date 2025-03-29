import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const styles = StyleSheet.create({
    timerEditingContainer: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: theme.spacing.large,
        borderRadius: theme.borders.radius.large,
        flex: 1,
        minWidth: theme.layout.minWidth,
    },
    timerInputAndControlsContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: theme.borders.radius.large,
        marginBottom: theme.spacing.medium,
        flex: 1,
        maxHeight: theme.layout.maxTimerHeight,
    },
    timerInputContainer: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    controlsContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        gap: theme.spacing.large,
        padding: theme.spacing.medium,
    },
    controlButton: {
        aspectRatio: 1,
        height: '100%',
        maxWidth: '100%',
        maxHeight: theme.layout.maxButtonSize,
        padding: theme.spacing.small,
        borderRadius: theme.borders.radius.medium,
        backgroundColor: theme.colors.gray.light,
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlButtonDisabled: {
        opacity: theme.effects.opacity.disabled,
    },    
});