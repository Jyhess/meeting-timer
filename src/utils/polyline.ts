interface Size {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

/**
 * Calcule l'angle en radians à partir d'un pourcentage de progression
 * @param percentage - Le pourcentage de progression (0 à 1)
 * @returns L'angle en radians
 */
export const getAngleFromProgress = (percentage: number): number => {
  const progressAngle = percentage * Math.PI * 2;
  let angle = (Math.PI * 2 - progressAngle) + Math.PI/2;
  while (angle < 0) {
    angle += Math.PI * 2;
  }
  while (angle >= (Math.PI * 2)) {
    angle -= Math.PI * 2;
  }
  return angle;
}

/**
 * Calcule les points d'un polyline pour représenter une progression circulaire
 * @param size - Les dimensions du conteneur
 * @param percentage - Le pourcentage de progression (0 à 1)
 * @returns Un tableau de points définissant le polyline
 */
export const polylinePath = (size: Size, percentage: number): Point[] => {
  if (percentage === 0) {
    return [{x: size.width/2, y: size.height/2}, {x: size.width/2, y: 0}, {x: size.width/2, y: size.height/2}];
  }

  const angle = getAngleFromProgress(percentage);
  const angle1 = Math.atan2(size.height, size.width);
  const angle2 = Math.atan2(size.height, -size.width);
  const angle3 = angle1 + Math.PI;
  const angle4 = angle2 + Math.PI;

  const center = {x: size.width/2, y: size.height/2};
  let points: Point[] = [
    {x: center.x, y: center.y},
    {x: center.x, y: 0},
  ];

  if (angle < angle1) {
    points.push({x: size.width, y: 0});
    points.push({x: size.width, y: center.y - (size.width/2) * Math.tan(angle)});
  }
  else if (angle < Math.PI/2) {
    points.push({x: center.x + (size.height/2) / Math.tan(angle), y: 0});
  }
  else if (angle < angle2) {
    points.push({x: size.width, y: 0});
    points.push({x: size.width, y: size.height});
    points.push({x: 0, y: size.height});
    points.push({x: 0, y: 0});
    points.push({x: center.x + (size.height/2) / Math.tan(angle), y: 0});
  }
  else if (angle < angle3) {
    points.push({x: size.width, y: 0});
    points.push({x: size.width, y: size.height});
    points.push({x: 0, y: size.height});
    points.push({x: 0, y: center.y + (size.width/2) * Math.tan(angle)});
  }
  else if (angle < angle4) {
    points.push({x: size.width, y: 0});
    points.push({x: size.width, y: size.height});
    points.push({x: center.x - (size.height/2) / Math.tan(angle), y: size.height});
  }
  else {
    points.push({x: size.width, y: 0});
    points.push({x: center.x - (size.height/2) / Math.tan(angle), y: size.height});
  }
  points.push({x: center.x, y: center.y});
  return points;
}; 