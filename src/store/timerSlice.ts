import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alert, DEFAULT_ALERTS } from '../types/alerts';

interface TimerState {
  duration: number;
  timeLeft: number;
  timeLeftMS: number;
  endTime: number | null;
  isRunning: boolean;
  state: 'idle' | 'running' | 'paused';
  alerts: Alert[];
  effectDuration: number;
  presetName: string;
  presetColor: string;
  shouldFlash: boolean;
  hasActiveAlert: boolean;
}

const initialState: TimerState = {
  duration: 0,
  timeLeft: 0,
  timeLeftMS: 0,
  endTime: null,
  isRunning: false,
  state: 'idle',
  alerts: DEFAULT_ALERTS,
  effectDuration: 3,
  presetName: '',
  presetColor: '',
  shouldFlash: false,
  hasActiveAlert: false
};

const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
      state.timeLeft = action.payload;
      state.endTime = null;
    },
    start: (state) => {
      state.isRunning = true;
      state.state = 'running';
      state.endTime = Date.now() + state.duration * 1000;
      state.timeLeft = state.duration;
      state.timeLeftMS = state.duration * 1000;
    },
    pause: (state) => {
      state.isRunning = true;
      state.state = 'paused';
    },
    resume: (state) => {
      state.isRunning = true;
      state.state = 'running';
      state.endTime = Date.now() + state.timeLeft * 1000;
    },
    stop: (state) => {
      state.timeLeft = state.duration;
      state.timeLeftMS = state.duration * 1000;
      state.endTime = null;
      state.isRunning = false;
      state.state = 'idle';
    },
    reset: (state) => {
      state.timeLeft = state.duration;
      state.timeLeftMS = state.duration * 1000;
      state.endTime = Date.now() + state.duration * 1000;
      state.isRunning = true;
      state.state = 'running';
    },
    resetFromDefault: (state, action: PayloadAction<TimerState>) => {
      return { ...action.payload };
    },
    loadPreset: (state, action: PayloadAction<{ alerts: Alert[], seconds: number, name: string, color: string }>) => {
      state.duration = action.payload.seconds;
      state.timeLeft = action.payload.seconds;
      state.timeLeftMS = action.payload.seconds * 1000;
      state.endTime = null;
      state.alerts = action.payload.alerts;
      state.isRunning = false;
      state.state = 'idle';
      state.presetName = action.payload.name;
      state.presetColor = action.payload.color;
    },
    updateAlert: (state, action: PayloadAction<Alert>) => {
      const index = state.alerts.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.alerts[index] = { ...action.payload };
      }
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.push(action.payload);
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(a => a.id !== action.payload);
    },
    addTime: (state, action: PayloadAction<number>) => {
      if (state.endTime) {
        if( state.state === 'running') {
          state.endTime = state.endTime + action.payload * 1000;
          state.timeLeftMS = state.endTime - Date.now();
          state.timeLeft = Math.floor(state.timeLeftMS / 1000);
        }
        else {
          state.timeLeftMS = state.timeLeftMS + action.payload * 1000;
          state.timeLeft = Math.floor(state.timeLeftMS / 1000);
          state.endTime = Date.now() + state.timeLeftMS;
        }
      }
    },
    tick: (state) => {
      if (state.state === 'running' && state.endTime) {
        state.timeLeftMS = state.endTime - Date.now();
        state.timeLeft = Math.floor(state.timeLeftMS / 1000);
      }
    },
    setShouldFlash: (state, action: PayloadAction<boolean>) => {
      state.shouldFlash = action.payload;
    },
    setHasActiveAlert: (state, action: PayloadAction<boolean>) => {
      state.hasActiveAlert = action.payload;
    }
  }
});

export const actions = timerSlice.actions;

export default timerSlice.reducer; 