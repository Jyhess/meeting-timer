
export const effects = {
    flash: {
        icon: 'flash',
    },
    shake: {
        icon: 'vibration',
    },
} as const;

export type EffectId = keyof typeof effects;
  