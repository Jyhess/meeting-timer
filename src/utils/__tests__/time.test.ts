import { formatTime, formatTimeFromSeconds } from '../time';

describe('formatTime', () => {
  it('should format time with hours', () => {
    expect(formatTime('', 1, 23, 45)).toBe('1:23:45');
    expect(formatTime('', 2, 5, 9)).toBe('2:05:09');
  });

  it('should format time without hours', () => {
    expect(formatTime('', 0, 23, 45)).toBe('23:45');
    expect(formatTime('', 0, 5, 9)).toBe('05:09');
    expect(formatTime('', 0, 0, 0)).toBe('00:00');
  });

  it('should format time without hours and display zero hours', () => {
    expect(formatTime('', 0, 23, 45, true)).toBe('0:23:45');
    expect(formatTime('', 0, 5, 9, true)).toBe('0:05:09');
    expect(formatTime('', 0, 0, 0, true)).toBe('0:00:00');
  });

  it('should handle prefix correctly', () => {
    expect(formatTime('-', 1, 23, 45)).toBe('-1:23:45');
    expect(formatTime('+', 0, 5, 9)).toBe('+05:09');
  });
});

describe('formatTimeFromSeconds', () => {
  it('should format positive seconds correctly', () => {
    expect(formatTimeFromSeconds(3665)).toBe('1:01:05'); // 1h 1m 5s
    expect(formatTimeFromSeconds(65)).toBe('01:05'); // 1m 5s
    expect(formatTimeFromSeconds(5)).toBe('00:05'); // 5s
    expect(formatTimeFromSeconds(5, true)).toBe('0:00:05'); // 5s
    expect(formatTimeFromSeconds(0)).toBe('00:00');
    expect(formatTimeFromSeconds(0, true)).toBe('0:00:00');
  });

  it('should format negative seconds correctly', () => {
    expect(formatTimeFromSeconds(-3665)).toBe('-1:01:05'); // -1h 1m 5s
    expect(formatTimeFromSeconds(-65)).toBe('-01:05'); // -1m 5s
    expect(formatTimeFromSeconds(-5)).toBe('-00:05'); // -5s
    expect(formatTimeFromSeconds(-5, true)).toBe('-0:00:05'); // -5s
  });

  it('should handle edge cases', () => {
    expect(formatTimeFromSeconds(3600)).toBe('1:00:00'); // exactly 1 hour
    expect(formatTimeFromSeconds(60)).toBe('01:00'); // exactly 1 minute
    expect(formatTimeFromSeconds(86400)).toBe('24:00:00'); // exactly 24 hours
  });
}); 