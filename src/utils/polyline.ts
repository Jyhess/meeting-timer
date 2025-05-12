interface Size {
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

/**
 * Calculate the angle in radians from a progress percentage.
 * Ensure angle is between 0 and 2*PI
 * @param percentage - The progress percentage (0 to 1)
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
 * Calculate points for a polyline to represent circular progress
 * @param size - The dimensions of the container
 * @param percentage - The progress percentage (0 to 1)
 * @returns An array of points defining the polyline
 */
export const polylinePath = (size: Size, percentage: number): Point[] => {
  const center = {x: size.width/2, y: size.height/2};
  if (percentage === 0) {
    return [{x: center.x, y: center.y}, {x: center.x, y: 0}, {x: center.x, y: center.y}];
  }

  const angle = getAngleFromProgress(percentage);
  const angle1 = Math.atan2(size.height, size.width);  // [0;PI/2[
  const angle2 = Math.atan2(size.height, -size.width); // [PI/2;PI[
  const angle3 = angle1 + Math.PI; // [PI;3PI/2[
  const angle4 = angle2 + Math.PI; // [3PI/2;2PI[

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
    points.push({x: size.width, y: center.y - (size.width/2) * Math.tan(angle)});
  }
  points.push({x: center.x, y: center.y});
  return points;
};

/**
 * Calculate points for a polyline from a starting percentage to the end (100%)
 * @param size - The dimensions of the container
 * @param startPercentage - The starting progress percentage (0 to 1)
 * @returns An array of points defining the polyline from start to end
 */
export const polylinePathToEnd = (size: Size, startPercentage: number): Point[] => {
  const center = {x: size.width/2, y: size.height/2};
  if(startPercentage === 1) {
    return [
      {x: center.x, y: center.y},
      {x: center.x, y: 0},
      {x: center.x, y: center.y}
      ];
  }

  const angle = getAngleFromProgress(startPercentage);
  const angleTopRight = Math.atan2(size.height, size.width);
  const angleTopLeft = Math.atan2(size.height, -size.width);
  const angleBottomLeft = angleTopRight + Math.PI;
  const angleBottomRight = angleTopLeft + Math.PI;
  
  let points: Point[] = [
    {x: center.x, y: center.y},
  ];

  if (angle < angleTopRight) {
    points.push({x: size.width, y: center.y - (size.width/2) * Math.tan(angle)});
    points.push({x: size.width, y: size.height});
    points.push({x: 0, y: size.height});
    points.push({x: 0, y: 0});
  } else if (angle <= Math.PI/2) {
    points.push({x: center.x + (size.height/2) / Math.tan(angle), y: 0});
    points.push({x: size.width, y: 0});
    points.push({x: size.width, y: size.height});
    points.push({x: 0, y: size.height});
    points.push({x: 0, y: 0});
  } else if (angle < angleTopLeft) {
    points.push({x: center.x + (size.height/2) / Math.tan(angle), y: 0});
  } else if (angle < angleBottomLeft) {
    points.push({x: 0, y: center.y + (size.width/2) * Math.tan(angle)});
    points.push({x: 0, y: 0});
  } else if (angle < angleBottomRight) {
    points.push({x: center.x - (size.height/2) / Math.tan(angle), y: size.height});
    points.push({x: 0, y: size.height});
    points.push({x: 0, y: 0});
  } else {
    points.push({x: size.width, y: center.y - (size.width/2) * Math.tan(angle)});
    points.push({x: size.width, y: size.height});
    points.push({x: 0, y: size.height});
    points.push({x: 0, y: 0});
  }

  // Ajouter le point final
  points.push({x: center.x, y: 0});
  points.push({x: center.x, y: center.y});

  return points;
}; 

