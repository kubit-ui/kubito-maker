import type { KubitoItem } from '@/types';

/**
 * Converts item transform properties to an SVG transform string.
 * @param item - Item with transform properties
 * @returns SVG transform attribute value
 */
export const transformToString = (item: KubitoItem): string => {
  const sx = item.flipX ? -item.scale : item.scale;
  const sy = item.flipY ? -item.scale : item.scale;
  return `translate(${item.x}, ${item.y}) rotate(${item.rotate}) scale(${sx}, ${sy})`;
};

/**
 * Generates CSS filter string from item effects (blur, brightness, contrast, saturation, etc.).
 * @param item - Item with visual effects
 * @returns CSS filter property value
 */
export const getFilterString = (item: KubitoItem): string => {
  const filters: string[] = [];

  if (item.effects.blur && item.effects.blur > 0) {
    filters.push(`blur(${item.effects.blur}px)`);
  }

  if (item.effects.brightness && item.effects.brightness !== 1) {
    filters.push(`brightness(${item.effects.brightness})`);
  }

  if (item.effects.contrast && item.effects.contrast !== 1) {
    filters.push(`contrast(${item.effects.contrast})`);
  }

  if (item.effects.saturate && item.effects.saturate !== 1) {
    filters.push(`saturate(${item.effects.saturate})`);
  }

  // New photographic filters
  if (item.effects.hueRotate && item.effects.hueRotate !== 0) {
    filters.push(`hue-rotate(${item.effects.hueRotate}deg)`);
  }

  if (item.effects.grayscale && item.effects.grayscale > 0) {
    filters.push(`grayscale(${item.effects.grayscale})`);
  }

  if (item.effects.sepia && item.effects.sepia > 0) {
    filters.push(`sepia(${item.effects.sepia})`);
  }

  if (item.effects.invert && item.effects.invert > 0) {
    filters.push(`invert(${item.effects.invert})`);
  }

  return filters.length > 0 ? filters.join(' ') : 'none';
};

/**
 * Generates CSS drop-shadow filter from item shadow effects.
 * @param item - Item with shadow effects
 * @returns CSS drop-shadow filter or empty string if no shadow
 */
export const getShadowFilter = (item: KubitoItem): string => {
  const {
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    shadowColor,
    shadowOpacity,
  } = item.effects;

  if (shadowBlur === 0 && shadowOffsetX === 0 && shadowOffsetY === 0) {
    return '';
  }

  const rgba = hexToRgba(shadowColor, shadowOpacity);
  return `drop-shadow(${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${rgba})`;
};

/**
 * Converts hex color to RGBA string with alpha channel.
 * @param hex - Hex color string (with or without #)
 * @param alpha - Alpha value from 0 to 1
 * @returns RGBA color string
 */
export const hexToRgba = (hex: string, alpha: number): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) {
    return `rgba(0, 0, 0, ${alpha})`;
  }

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/**
 * Clamps a value between minimum and maximum bounds.
 * @param value - Value to clamp
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Converts degrees to radians.
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
export const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Converts radians to degrees.
 * @param radians - Angle in radians
 * @returns Angle in degrees
 */
export const radiansToDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

/**
 * Rotates a point around a center point by a given angle.
 * @param x - Point X coordinate
 * @param y - Point Y coordinate
 * @param cx - Center X coordinate
 * @param cy - Center Y coordinate
 * @param angle - Rotation angle in degrees
 * @returns New coordinates after rotation
 */
export const rotatePoint = (
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number
): { x: number; y: number } => {
  const radians = degreesToRadians(angle);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  const nx = cos * (x - cx) + sin * (y - cy) + cx;
  const ny = cos * (y - cy) - sin * (x - cx) + cy;

  return { x: nx, y: ny };
};

/**
 * Calculates Euclidean distance between two points.
 * @param x1 - First point X coordinate
 * @param y1 - First point Y coordinate
 * @param x2 - Second point X coordinate
 * @param y2 - Second point Y coordinate
 * @returns Distance between the points
 */
export const distance = (
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number => {
  return Math.hypot(x2 - x1, y2 - y1);
};

/**
 * Generates a unique ID string using timestamp and random characters.
 * @returns Unique identifier string
 */
export const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
