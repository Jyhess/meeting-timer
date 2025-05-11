import { alertBehaviors } from "./alert.behaviors";
import { Alert } from "./alert.types";


export function isAlertActive(alert: Alert, timeLeft: number): boolean {
  return alertBehaviors[alert.type].isActive(alert, timeLeft);
}

export function isAlertValid(alert: Alert, timeLeft: number): boolean {
  return alertBehaviors[alert.type].isValid(alert, timeLeft);
}

export function hasAlertTimeOffset(alert: Alert): boolean {
  return alertBehaviors[alert.type].hasTimeOffset(alert);
}

export function shouldAlertTrigger(alert: Alert, timeLeft: number): boolean {
  return alertBehaviors[alert.type].shouldTrigger(alert, timeLeft);
}

export function getAlertTimePrefix(alert: Alert): string {
  return alertBehaviors[alert.type].getTimePrefix();
}

export function getAlertTimeText(alert: Alert): string {
  return alertBehaviors[alert.type].getTimeText(alert);
}

export function getAlertTitle(alert: Alert): string {
  return alertBehaviors[alert.type].getTitle();
}

export const sortAlerts = (alerts: Alert[]): Alert[] => {
  return [...alerts].sort((a, b) => {
    if (a.type === 'before' && b.type !== 'before') return -1;
    if (a.type !== 'before' && b.type === 'before') return 1;

    if (a.type === 'end' && b.type !== 'end') return -1;
    if (a.type !== 'end' && b.type === 'end') return 1;

    // Les alertes de type 'before' sont ensuite, triées par timeOffset
    if (a.type === 'before' && b.type === 'before') {
      return b.timeOffset - a.timeOffset;
    }

    // Les alertes de type 'after' sont en dernier, triées par timeOffset
    return a.timeOffset - b.timeOffset;
  });
};
