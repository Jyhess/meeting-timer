import React, { createContext, useContext } from 'react';
import { useTimerRedux } from '../hooks/useTimerRedux';

type TimerContextType = ReturnType<typeof useTimerRedux>;

const TimerContext = createContext<TimerContextType | null>(null);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const timer = useTimerRedux();

  return (
    <TimerContext.Provider value={timer}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer doit être utilisé à l\'intérieur d\'un TimerProvider');
  }
  return context;
}; 