export const formatTime = (prefix: string, hours: number, mins: number, secs: number) => {
  if (hours > 0) {
    return `${prefix}${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${prefix}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const formatTimeFromSeconds = (seconds: number): string => {
  const hours = Math.floor(Math.abs(seconds) / 3600);
  const mins = Math.floor((Math.abs(seconds) % 3600) / 60);
  const secs = Math.abs(seconds) % 60;
  const prefix = seconds < 0 ? '-' : '';
  return formatTime(prefix, hours, mins, secs);
};
