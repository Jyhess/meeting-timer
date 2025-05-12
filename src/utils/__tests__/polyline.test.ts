import { getAngleFromProgress, polylinePath, polylinePathToEnd } from '../polyline';


describe('getAngleFromProgress', () => {
  it('should return PI/2 for 0%', () => {
    expect(getAngleFromProgress(0)).toBe( Math.PI/2);
  });

  it('should go to the right direction', () => {
    expect(getAngleFromProgress(0.1)).toBeLessThanOrEqual(Math.PI/2);
    expect(getAngleFromProgress(0.1)).toBeGreaterThanOrEqual(Math.PI/4);
  });

  it('should return 0 for 25%', () => {
    expect(getAngleFromProgress(0.25)).toBe(0);
  });

  it('should return 3*PI/2 for 50%', () => {
    expect(getAngleFromProgress(0.5)).toBe(3*Math.PI/2);
  });

  it('should return PI for 75%', () => {
    expect(getAngleFromProgress(0.75)).toBe(Math.PI);
  });

  it('should return PI/2 for 100%', () => {
    expect(getAngleFromProgress(1)).toBe(Math.PI/2);
  });

  it('should handle negative angles', () => {
    expect(getAngleFromProgress(-0.25)).toBe(Math.PI);
  });

  it('should handle angles > 2PI', () => {
    expect(getAngleFromProgress(1.5)).toBe(3*Math.PI/2);
  });
});


describe('polylinePath', () => {
  const size = { width: 100, height: 100 };

  it('Should have single line for 0% of progression', () => {
    const points = polylinePath(size, 0);
    expect(points).toEqual([
      { x: 50, y: 50 },
      { x: 50, y: 0 },
      { x: 50, y: 50 }
    ]);
  });

  it('Should properly handle 0-12.5% of progression', () => {
    const points = polylinePath(size, 0.08);
    expect(Array.isArray(points)).toBe(true);
    expect(points.length).toBeGreaterThan(3);
    const lastBorderPoint = points[points.length - 2];
    expect(points).toEqual([
      { x: 50, y: 50 },
      { x: 50, y: 0 },
      lastBorderPoint,
      { x: 50, y: 50 }
    ]);
    expect(lastBorderPoint.x).toBeGreaterThan(50);
    expect(lastBorderPoint.x).toBeLessThan(100);
    expect(lastBorderPoint.y).toEqual(0);
  });

  it('Should properly handle 12.5-25% of progression', () => {
    const points = polylinePath(size, 0.14);
    expect(Array.isArray(points)).toBe(true);
    expect(points.length).toBeGreaterThan(3);
    const lastBorderPoint = points[points.length - 2];
    expect(points).toEqual([
      { x: 50, y: 50 },
      { x: 50, y: 0 },
      { x: 100, y: 0 },
      lastBorderPoint,
      { x: 50, y: 50 }
    ]);
    expect(lastBorderPoint.x).toEqual(100);
    expect(lastBorderPoint.y).toBeGreaterThan(0);
    expect(lastBorderPoint.y).toBeLessThan(50);
  });

  it('Should properly handle 25-37.5% of progression', () => {
    const points = polylinePath(size, 0.35);
    expect(Array.isArray(points)).toBe(true);
    expect(points.length).toBeGreaterThan(3);
    const lastBorderPoint = points[points.length - 2];
    expect(points).toEqual([
      { x: 50, y: 50 },
      { x: 50, y: 0 },
      { x: 100, y: 0 },
      lastBorderPoint,
      { x: 50, y: 50 }
    ]);
    expect(lastBorderPoint.x).toEqual(100);
    expect(lastBorderPoint.y).toBeGreaterThan(50);
    expect(lastBorderPoint.y).toBeLessThan(100);
  });

  it('Should properly handle 37.5-65.5% of progression', () => {
    const points = polylinePath(size, 0.40);
    expect(Array.isArray(points)).toBe(true);
    expect(points.length).toBeGreaterThan(3);
    const lastBorderPoint = points[points.length - 2];
    expect(points).toEqual([
      { x: 50, y: 50 },
      { x: 50, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      lastBorderPoint,
      { x: 50, y: 50 }
    ]);
    expect(lastBorderPoint.x).toBeGreaterThan(0);
    expect(lastBorderPoint.x).toBeLessThan(100);
    expect(lastBorderPoint.y).toEqual(100);
  });


  it('Should properly handle 65.5-87.5% of progression', () => {
    const points = polylinePath(size, 0.65);
    expect(Array.isArray(points)).toBe(true);
    expect(points.length).toBeGreaterThan(3);
    const lastBorderPoint = points[points.length - 2];
    expect(points).toEqual([
      { x: 50, y: 50 },
      { x: 50, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
      lastBorderPoint,
      { x: 50, y: 50 }
    ]);
    expect(lastBorderPoint.x).toEqual(0);
    expect(lastBorderPoint.y).toBeGreaterThan(50);
    expect(lastBorderPoint.y).toBeLessThan(100);
  });

  it('Should properly handle 87.5-100% of progression', () => {
    const points = polylinePath(size, 0.90);
    expect(Array.isArray(points)).toBe(true);
    expect(points.length).toBeGreaterThan(3);
    const lastBorderPoint = points[points.length - 2];
    expect(points).toEqual([
      { x: 50, y: 50 },
      { x: 50, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
      { x: 0, y: 0 },
      lastBorderPoint,
      { x: 50, y: 50 }
    ]);
    expect(lastBorderPoint.x).toBeGreaterThan(0);
    expect(lastBorderPoint.x).toBeLessThan(50);
    expect(lastBorderPoint.y).toEqual(0);
  });


  it('Should handle different sizes', () => {
    const rectangleSize = { width: 200, height: 100 };
    const points = polylinePath(rectangleSize, 0.5);
    expect(points[0]).toEqual({ x: 100, y: 50 });
    expect(points[points.length - 1]).toEqual({ x: 100, y: 50 });
  });
});

describe('polylinePathToEnd', () => {
  const size = { width: 100, height: 100 };

  it('Should create a full rectangle for 0% start', () => {
    const points = polylinePathToEnd(size, 0);
    const firstBorderPoint = points[1];
    expect(points).toEqual([
      { x: 50, y: 50 },
      firstBorderPoint,
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
    ]);
    expect(firstBorderPoint).toEqual({ x: 50, y: 0 });
  });

  it('Should properly handle 0-12.5% start', () => {
    const points = polylinePathToEnd(size, 0.08);
    const firstBorderPoint = points[1];
    expect(points).toEqual([
      { x: 50, y: 50 },
      firstBorderPoint,
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
    ]);
    expect(firstBorderPoint.x).toBeGreaterThan(50);
    expect(firstBorderPoint.x).toBeLessThan(100);
    expect(firstBorderPoint.y).toEqual(0);
  });

  it('Should properly handle 12.5-25% start', () => {
    const points = polylinePathToEnd(size, 0.21);
    const firstBorderPoint = points[1];
    expect(points).toEqual([
      { x: 50, y: 50 },
      firstBorderPoint,
      { x: 100, y: 100 },
      { x: 0, y: 100 },
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
    ]);
    expect(firstBorderPoint.x).toEqual(100);
    expect(firstBorderPoint.y).toBeGreaterThan(0);
    expect(firstBorderPoint.y).toBeLessThan(100);
  });

  it('Should properly handle 25-37.5% start', () => {
    const points = polylinePathToEnd(size, 0.28);
    const firstBorderPoint = points[1];
    expect(points).toEqual([
      { x: 50, y: 50 },
      firstBorderPoint,
      { x: 100, y: 100 },
      { x: 0, y: 100 },
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
    ]);
    expect(firstBorderPoint.x).toEqual(100);
    expect(firstBorderPoint.y).toBeGreaterThan(50);
    expect(firstBorderPoint.y).toBeLessThan(100);
  });

  it('Should properly handle 37.5-65.5% start', () => {
    const points = polylinePathToEnd(size, 0.42);
    const firstBorderPoint = points[1];
    expect(points).toEqual([
      { x: 50, y: 50 },
      firstBorderPoint,
      { x: 0, y: 100 },
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
    ]);
    expect(firstBorderPoint.x).toBeGreaterThan(0);
    expect(firstBorderPoint.x).toBeLessThan(100);
    expect(firstBorderPoint.y).toEqual(100);
  });

  it('Should properly handle 65.5-87.5% start', () => {
    const points = polylinePathToEnd(size, 0.82);
    const firstBorderPoint = points[1];
    expect(points).toEqual([
      { x: 50, y: 50 },
      firstBorderPoint,
      { x: 0, y: 0 },
      { x: 50, y: 0 },
      { x: 50, y: 50 },
    ]);
    expect(firstBorderPoint.x).toEqual(0);
    expect(firstBorderPoint.y).toBeGreaterThan(0);
    expect(firstBorderPoint.y).toBeLessThan(100);
  });

  it('Should properly handle 87.5-100% start', () => {
    const points = polylinePathToEnd(size, 0.92);
    const firstBorderPoint = points[1];
    expect(points).toEqual([
      { x: 50, y: 50 },
      firstBorderPoint,
      { x: 50, y: 0 },
      { x: 50, y: 50 },
    ]);
    expect(firstBorderPoint.x).toBeGreaterThan(0);
    expect(firstBorderPoint.x).toBeLessThan(50);
    expect(firstBorderPoint.y).toEqual(0);
  });

  it('Should handle different sizes', () => {
    const rectangleSize = { width: 200, height: 150 };
    const points = polylinePathToEnd(rectangleSize, 0);
    expect(points).toEqual([
      { x: 100, y: 75 },
      { x: 100, y: 0 },
      { x: 200, y: 0 },
      { x: 200, y: 150 },
      { x: 0, y: 150 },
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 75 },
    ]);
  });

  it('Should handle edge cases', () => {
    // Test avec un pourcentage négatif
    const negativePoints = polylinePathToEnd(size, -0.1);
    expect(negativePoints[0]).toEqual({ x: 50, y: 50 });
    expect(negativePoints[negativePoints.length - 1]).toEqual({ x: 50, y: 50 });

    // Test avec un pourcentage > 1
    const overflowPoints = polylinePathToEnd(size, 1.1);
    expect(overflowPoints[0]).toEqual({ x: 50, y: 50 });
    expect(overflowPoints[overflowPoints.length - 1]).toEqual({ x: 50, y: 50 });
  });
}); 