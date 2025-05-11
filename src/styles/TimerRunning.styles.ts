import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const styles = StyleSheet.create({
    timerRunningContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerRunningAndControlsContainer: {
        minWidth: theme.layout.minWidth,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: theme.spacing.large,
        flex: 1,
        zIndex: 2,
    },
    timerContainer: {
        width: '100%',
        marginBottom: theme.spacing.medium,
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: theme.borders.radius.large,
        overflow: 'hidden',
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
        padding: theme.spacing.medium,
    },
    alertStopButton: {
        position: 'absolute',
        right: 8,
        top: 8,
        backgroundColor: theme.colors.gray.medium,
        borderRadius: 24,
        padding: 8,
        elevation: 4,
        shadowColor: theme.colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    addTimeContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background.tertiary,
        borderRadius: theme.borders.radius.large,
        maxHeight: theme.layout.maxTimerHeight,
    },
    addTimeControlsContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    alertText: {
        fontSize: theme.typography.fontSize.large,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.white,
        textAlign: 'center',
    },
});
