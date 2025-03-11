export const formatTime = (prefix:string, mins:number, secs:number) => {
  return `${prefix}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const formatTimeFromSeconds = (seconds: number): string => {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  const prefix = seconds < 0 ? '-' : '';
  return formatTime(prefix, mins, secs);
};
