import { StyleSheet } from "react-native";
import { theme } from "../theme";

export const styles = StyleSheet.create({
  alertItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.tertiary,
    padding: theme.spacing.small,
    borderRadius: theme.borders.radius.large,
    gap: theme.spacing.xs,
    width: theme.layout.minWidth,
  },
  timeContainer: {
    minWidth: 50,
  },
  nameContainer: {
    flex: 1,
    marginLeft: theme.spacing.xs,
  },
  alertTime: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  alertName: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.medium,
  },
  colorDot: {
    width: theme.layout.smallIconSize,
    height: theme.layout.smallIconSize,
    borderRadius: theme.borders.radius.round,
  },
  soundIcon: {
    marginHorizontal: theme.spacing.xs,
  },
  sliderContainer: {
    width: 50,
  },
});