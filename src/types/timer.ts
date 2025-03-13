import { Alert } from "./alerts";

export type TimerPreset = {
  id: string;
  name: string;
  seconds: number;
  alerts: Alert[];
  created_at: string;
  last_used?: string;
};
