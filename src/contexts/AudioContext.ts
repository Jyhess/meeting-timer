import { SoundName } from "../types/sounds";
import { createContext, useContext } from "react";

export type AudioContextType = {
    isPlaying: boolean;
    playSound: (sound: SoundName) => Promise<void>;
    stopSound: () => void;
    soundDuration: number | null;
    playingSound: SoundName | null;
  };
  
export const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
      throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
  };
