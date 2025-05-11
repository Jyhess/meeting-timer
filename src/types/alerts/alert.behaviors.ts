import { formatTimeFromSeconds } from "@/src/utils/time";
import { Alert, AlertType } from "./alert.types";


type AlertBehavior = {
  isActive: (alert: Alert, timeLeft: number) => boolean;
  isValid: (alert: Alert, timeLeft: number) => boolean;
  hasTimeOffset: (alert: Alert) => boolean;
  shouldTrigger: (alert: Alert, timeLeft: number) => boolean;
  getTimePrefix: () => string;
  getTimeText: (alert: Alert) => string;
  getTitle: () => string;
};

export const alertBehaviors: Record<AlertType, AlertBehavior> = {
  end: {
    isActive: (a, timeLeft) => a.enabled && timeLeft <= 0,
    isValid: (_, __) => true,
    hasTimeOffset: () => false,
    shouldTrigger: (a, timeLeft) => a.enabled && timeLeft === 0,
    getTimePrefix: () => '',
    getTimeText: () => 'End',
    getTitle: () => 'alerts.end',
  },
  before: {
    isActive: (a, timeLeft) => a.enabled && timeLeft <= a.timeOffset,
    isValid: (a, timeLeft) => !a.enabled || a.timeOffset < timeLeft,
    hasTimeOffset: () => true,
    shouldTrigger: (a, timeLeft) => a.enabled && timeLeft === a.timeOffset,
    getTimePrefix: () => '-',
    getTimeText: (a) => `-${formatTimeFromSeconds(a.timeOffset)}`,
    getTitle: () => 'alerts.preEnd',
  },
  after: {
    isActive: (a, timeLeft) => a.enabled && timeLeft < 0 && Math.abs(timeLeft) >= a.timeOffset,
    isValid: (_, __) => true,
    hasTimeOffset: () => true,
    shouldTrigger: (a, timeLeft) => a.enabled && timeLeft === -a.timeOffset,
    getTimePrefix: () => '+',
    getTimeText: (a) => `+${formatTimeFromSeconds(a.timeOffset)}`,
    getTitle: () => 'alerts.postEnd',
  },
};
