import { Alert } from "./alerts";

export interface TimerPreset {
  id: string;
  name: string;
  seconds: number;
  alerts: any[];
  created_at: string;
  last_used: string;
}
