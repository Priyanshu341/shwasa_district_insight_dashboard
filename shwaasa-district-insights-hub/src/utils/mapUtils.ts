import { MapConfiguration, MapTheme, mapThemes } from '../config/mapConfig';

export class MapUtils {
  static getTheme(themeName: string): MapTheme {
    return mapThemes[themeName] || mapThemes.default;
  }

  static interpolateColor(color1: string, color2: string, factor: number): string {
    if (factor <= 0) return color1;
    if (factor >= 1) return color2;

    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return color1;

    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);

    return `rgb(${r}, ${g}, ${b})`;
  }

  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  static calculateDataRange(data: any[], field: string): { min: number; max: number } {
    const values = data.map(d => d[field]).filter(v => typeof v === 'number');
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }

  static normalizeValue(value: number, min: number, max: number): number {
    if (max === min) return 0;
    return (value - min) / (max - min);
  }

  static getColorForValue(
    value: number,
    range: { min: number; max: number },
    colorGradient: string[]
  ): string {
    const normalized = this.normalizeValue(value, range.min, range.max);
    const segmentCount = colorGradient.length - 1;
    const segment = Math.floor(normalized * segmentCount);
    const segmentFactor = (normalized * segmentCount) - segment;

    const color1 = colorGradient[Math.min(segment, segmentCount - 1)];
    const color2 = colorGradient[Math.min(segment + 1, segmentCount)];

    return this.interpolateColor(color1, color2, segmentFactor);
  }

  static debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }

  static throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        func.apply(null, args);
      }
    };
  }

  static calculateCentroid(coordinates: number[][]): { x: number; y: number } {
    const sum = coordinates.reduce(
      (acc, coord) => ({ x: acc.x + coord[0], y: acc.y + coord[1] }),
      { x: 0, y: 0 }
    );
    return {
      x: sum.x / coordinates.length,
      y: sum.y / coordinates.length,
    };
  }
}