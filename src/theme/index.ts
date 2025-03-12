// Couleurs
export const colors = {
  // Couleurs principales
  primary: '#4CAF50',    // Vert pour le bouton play
  secondary: '#FF9800',  // Orange pour les alertes et le bouton pause
  danger: '#f44336',     // Rouge pour les erreurs et le bouton stop
  white: '#eee',
  black: '#000',
  
  // Nuances de gris
  gray: {
    light: '#666',
    medium: '#2d2d2d',
    dark: '#1a1a1a',
  },

  // États
  disabled: '#666',
  invalid: '#FF9800',
  error: '#f44336',

  // Arrière-plan
  background: {
    primary: '#1a1a1a',
    secondary: '#2d2d2d',
  },
} as const;

// Typographie
export const typography = {
  fontSize: {
    small: 14,
    medium: 16,
    large: 24,
    xlarge: 32,
    timer: 72,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    bold: '700',
  },
} as const;

// Espacement
export const spacing = {
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xlarge: 32,
} as const;

// Bordures
export const borders = {
  radius: {
    small: 4,
    medium: 8,
    large: 16,
    round: 9999,
  },
} as const;

// Effets
export const effects = {
  blur: {
    intensity: 50,
  },
  opacity: {
    disabled: 0.5,
    overlay: 0.7,
  },
} as const;

// Layout
export const layout = {
  keypad: {
    buttonSize: 70,
    gap: 16,
  },
  controls: {
    buttonSize: 64,
  },
} as const;

// Animations
export const animations = {
  duration: {
    short: 250,
    medium: 500,
    long: 1000,
  },
} as const;

// Export un objet theme qui contient tout
export const theme = {
  colors,
  typography,
  spacing,
  borders,
  effects,
  layout,
  animations,
} as const; 