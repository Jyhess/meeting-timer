import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Alert, DEFAULT_ALERTS } from '../types/alerts';

interface TimerState {
  duration: number;
  timeLeft: number;
  endTime: number | null;
  isRunning: boolean;
  state: 'idle' | 'running' | 'paused';
  beforeAlert: Alert;
  endAlert: Alert;
  afterAlert: Alert;
  effectDuration: number;
  presetName: string;
  presetColor: string;
  shouldFlash: boolean;
  hasActiveAlert: boolean;
}

const initialState: TimerState = {
  duration: 0,
  timeLeft: 0,
  endTime: null,
  isRunning: false,
  state: 'idle',
  beforeAlert: DEFAULT_ALERTS[0],
  endAlert: DEFAULT_ALERTS[1],
  afterAlert: DEFAULT_ALERTS[2],
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
    },
    pause: (state) => {
      state.isRunning = true;
      state.state = 'paused';
    },
    resume: (state) => {
      state.isRunning = true;
      state.state = 'running';
      state.endTime = Date.now() + state.duration * 1000;
    },
    stop: (state) => {
      state.timeLeft = state.duration;
      state.endTime = null;
      state.isRunning = false;
      state.state = 'idle';
    },
    reset: (state) => {
      state.timeLeft = state.duration;
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
      state.endTime = null;
      state.beforeAlert = action.payload.alerts.find(a => a.id === 'before') || state.beforeAlert;
      state.endAlert = action.payload.alerts.find(a => a.id === 'end') || state.endAlert;
      state.afterAlert = action.payload.alerts.find(a => a.id === 'after') || state.afterAlert;
      state.isRunning = false;
      state.state = 'idle';
      state.presetName = action.payload.name;
      state.presetColor = action.payload.color;
    },
    updateAlert: (state, action: PayloadAction<Alert>) => {
      switch (action.payload.id) {
        case 'before':
          state.beforeAlert = { ...action.payload };
          break;
        case 'end':
          state.endAlert = { ...action.payload };
          break;
        case 'after':
          state.afterAlert = { ...action.payload };
          break;
      }
    },
    addTime: (state, action: PayloadAction<number>) => {
      if (state.endTime) {
        state.endTime = state.endTime + action.payload * 1000;
        state.timeLeft = Math.floor((state.endTime - Date.now()) / 1000);
      }
    },
    tick: (state) => {
      if (state.state === 'running' && state.endTime) {
        state.timeLeft = Math.floor((state.endTime - Date.now()) / 1000);
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

export const {
  setDuration,
  start,
  pause,
  resume,
  stop,
  reset,
  resetFromDefault,
  loadPreset,
  updateAlert,
  addTime,
  tick,
  setShouldFlash,
  setHasActiveAlert
} = timerSlice.actions;

export default timerSlice.reducer; 