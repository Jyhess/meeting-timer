/**
 * Calcule la luminosité relative d'une couleur hexadécimale
 * @param hex Couleur au format hexadécimal (#RRGGBB)
 * @returns Luminosité relative entre 0 et 1
 */
const getLuminance = (hex: string): number => {
  // Convertir le hex en RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Convertir en valeurs relatives
  const [rs, gs, bs] = [r, g, b].map(c => {
    const sRGB = c / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });

  // Calculer la luminosité relative
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

/**
 * Détermine la meilleure couleur de contraste (noir ou blanc) pour un fond donné
 * @param hex Couleur de fond au format hexadécimal (#RRGGBB)
 * @returns 'black' ou 'white'
 */
export const getContrastColor = (hex: string): 'black' | 'white' => {
  const luminance = getLuminance(hex);
  // Utiliser un seuil de 0.5 pour déterminer si on utilise du noir ou du blanc
  return luminance > 0.5 ? 'black' : 'white';
}; 