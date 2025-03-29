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
        marginBottom: theme.spacing.medium,
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: theme.borders.radius.large,
    },
    controlsButtonsContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    alertsContainer: {
        width: '100%',
        flexDirection: 'row',
    },
});