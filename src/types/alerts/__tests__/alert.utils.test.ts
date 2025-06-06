import { Alert } from '../alert.types';
import { isAlertActive, isAlertValid, shouldAlertTrigger, getAlertTimePrefix, getAlertTitle, getAlertTimeText, sortAlerts } from '../alert.utils';

describe('Alert Utils', () => {
  const mockAlerts: Alert[] = [
    {
      id: 'before',
      type: 'before',
      name: 'Bientôt fini',
      enabled: true,
      timeOffset: 30,
      sound: 'bell',
      effects: ['flash'],
    },
    {
      id: 'end',
      type: 'end',
      name: 'Temps écoulé',
      enabled: true,
      timeOffset: 0,
      sound: 'gong',
      effects: ['shake'],
    },
    {
      id: 'after',
      type: 'after',
      name: 'Temps dépassé',
      enabled: true,
      timeOffset: 60,
      sound: 'chime',
      effects: ['flash', 'shake'],
    },
  ];

  describe('isAlertActive', () => {
    it('should return true for active before alert', () => {
      const alert = mockAlerts[0];
      expect(isAlertActive(alert, 20)).toBe(true);
    });

    it('should return false for inactive before alert', () => {
      const alert = mockAlerts[0];
      expect(isAlertActive(alert, 40)).toBe(false);
    });

    it('should return true for active end alert', () => {
      const alert = mockAlerts[1];
      expect(isAlertActive(alert, 0)).toBe(true);
    });

    it('should return true for active after alert', () => {
      const alert = mockAlerts[2];
      expect(isAlertActive(alert, -70)).toBe(true);
    });

    it('should return false for disabled alert', () => {
      const alert = { ...mockAlerts[0], enabled: false };
      expect(isAlertActive(alert, 20)).toBe(false);
    });
  });

  describe('isAlertValid', () => {
    it('should return true for valid before alert', () => {
      const alert = mockAlerts[0];
      expect(isAlertValid(alert, 40)).toBe(true);
    });

    it('should return false for invalid before alert', () => {
      const alert = mockAlerts[0];
      expect(isAlertValid(alert, 20)).toBe(false);
    });

    it('should always return true for end alert', () => {
      const alert = mockAlerts[1];
      expect(isAlertValid(alert, 0)).toBe(true);
    });

    it('should always return true for after alert', () => {
      const alert = mockAlerts[2];
      expect(isAlertValid(alert, -70)).toBe(true);
    });
  });

  describe('shouldAlertTrigger', () => {
    it('should trigger before alert at exact time', () => {
      const alert = mockAlerts[0];
      expect(shouldAlertTrigger(alert, 30)).toBe(true);
    });

    it('should trigger end alert at zero', () => {
      const alert = mockAlerts[1];
      expect(shouldAlertTrigger(alert, 0)).toBe(true);
    });

    it('should trigger after alert at exact time', () => {
      const alert = mockAlerts[2];
      expect(shouldAlertTrigger(alert, -60)).toBe(true);
    });

    it('should not trigger disabled alert', () => {
      const alert = { ...mockAlerts[0], enabled: false };
      expect(shouldAlertTrigger(alert, 30)).toBe(false);
    });
  });

  describe('getAlertTimePrefix', () => {
    it('should return - for before alert', () => {
      const alert = mockAlerts[0];
      expect(getAlertTimePrefix(alert)).toBe('-');
    });

    it('should return empty string for end alert', () => {
      const alert = mockAlerts[1];
      expect(getAlertTimePrefix(alert)).toBe('');
    });

    it('should return + for after alert', () => {
      const alert = mockAlerts[2];
      expect(getAlertTimePrefix(alert)).toBe('+');
    });
  });

  describe('getAlertTitle', () => {
    it('should return correct title for before alert', () => {
      const alert = mockAlerts[0];
      expect(getAlertTitle(alert)).toBe('alerts.preEnd');
    });

    it('should return correct title for end alert', () => {
      const alert = mockAlerts[1];
      expect(getAlertTitle(alert)).toBe('alerts.end');
    });

    it('should return correct title for after alert', () => {
      const alert = mockAlerts[2];
      expect(getAlertTitle(alert)).toBe('alerts.postEnd');
    });
  });

  describe('getAlertTimeText', () => {
    it('should return End for end alert', () => {
      const alert = mockAlerts[1];
      expect(getAlertTimeText(alert)).toBe('End');
    });

    it('should return formatted time with minus for before alert', () => {
      const alert = mockAlerts[0];
      expect(getAlertTimeText(alert)).toBe('-00:30');
    });

    it('should return formatted time with plus for after alert', () => {
      const alert = mockAlerts[2];
      expect(getAlertTimeText(alert)).toBe('+01:00');
    });
  });

  describe('sortAlerts', () => {
    it('should put end alert between before and end alerts', () => {
      const alerts = [
        { ...mockAlerts[2] },
        { ...mockAlerts[0] },
        { ...mockAlerts[1] }
      ];
      const sorted = sortAlerts(alerts);
      expect(sorted[0].type).toBe('before');
      expect(sorted[1].type).toBe('end');
      expect(sorted[2].type).toBe('after');
    });

    it('should sort before alerts by timeOffset in descending order', () => {
      const alerts = [
        { ...mockAlerts[0], timeOffset: 30 },
        { ...mockAlerts[0], timeOffset: 60 },
        { ...mockAlerts[0], timeOffset: 15 }
      ];
      const sorted = sortAlerts(alerts);
      expect(sorted[0].timeOffset).toBe(60);
      expect(sorted[1].timeOffset).toBe(30);
      expect(sorted[2].timeOffset).toBe(15);
    });

    it('should sort after alerts by timeOffset in ascending order', () => {
      const alerts = [
        { ...mockAlerts[2], timeOffset: 60 },
        { ...mockAlerts[2], timeOffset: 30 },
        { ...mockAlerts[2], timeOffset: 90 }
      ];
      const sorted = sortAlerts(alerts);
      expect(sorted[0].timeOffset).toBe(30);
      expect(sorted[1].timeOffset).toBe(60);
      expect(sorted[2].timeOffset).toBe(90);
    });

    it('should maintain correct order: end -> before -> after', () => {
      const alerts = [
        { ...mockAlerts[2], timeOffset: 30 }, // after
        { ...mockAlerts[0], timeOffset: 60 }, // before
        { ...mockAlerts[1] }, // end
        { ...mockAlerts[0], timeOffset: 30 }, // before
        { ...mockAlerts[2], timeOffset: 60 }  // after
      ];
      const sorted = sortAlerts(alerts);
      expect(sorted[0].type).toBe('before');
      expect(sorted[1].type).toBe('before');
      expect(sorted[2].type).toBe('end');
      expect(sorted[3].type).toBe('after');
      expect(sorted[4].type).toBe('after');
      expect(sorted[0].timeOffset).toBe(60);
      expect(sorted[1].timeOffset).toBe(30);
      expect(sorted[3].timeOffset).toBe(30);
      expect(sorted[4].timeOffset).toBe(60);
    });
  });
}); 