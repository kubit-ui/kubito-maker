/**
 * Filter Presets for Photographic Effects
 * Provides preset configurations for various filter styles
 */

import type React from 'react';
import {
  Circle,
  Moon,
  Camera,
  Palette,
  Snowflake,
  Flame,
  CircleDot,
  Rainbow,
  Cloud,
  Zap,
  Film,
  Paintbrush,
  Lightbulb,
  RotateCcw as Rotate,
  Sparkles,
  Clapperboard,
  CircuitBoard,
  Sunrise,
  Droplets,
  Sunset,
} from 'lucide-react';

export interface FilterPreset {
  id: string;
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  category: 'photographic' | 'artistic' | 'color' | 'special';
  effects: {
    brightness?: number;
    contrast?: number;
    saturate?: number;
    hueRotate?: number;
    grayscale?: number;
    sepia?: number;
    invert?: number;
    blur?: number;
  };
}

/**
 * Photographic Filter Presets
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const FILTER_PRESETS: FilterPreset[] = [
  // None/Reset
  {
    id: 'none',
    name: 'None',
    description: 'No filter applied',
    icon: Circle,
    category: 'photographic',
    effects: {
      brightness: 1,
      contrast: 1,
      saturate: 1,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
      invert: 0,
      blur: 0,
    },
  },

  // Black & White
  {
    id: 'blackwhite',
    name: 'Black & White',
    description: 'Classic monochrome',
    icon: Moon,
    category: 'photographic',
    effects: {
      grayscale: 1,
      contrast: 1.1,
      brightness: 1.05,
    },
  },

  // Vintage
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Old photo aesthetic',
    icon: Camera,
    category: 'photographic',
    effects: {
      sepia: 0.5,
      contrast: 1.1,
      brightness: 1.1,
      saturate: 0.8,
    },
  },

  // Sepia
  {
    id: 'sepia',
    name: 'Sepia',
    description: 'Warm brownish tone',
    icon: Palette,
    category: 'photographic',
    effects: {
      sepia: 1,
      brightness: 1.1,
    },
  },

  // Cold/Cool
  {
    id: 'cold',
    name: 'Cold',
    description: 'Cool blue tones',
    icon: Snowflake,
    category: 'color',
    effects: {
      hueRotate: 180,
      saturate: 1.2,
      brightness: 1.05,
    },
  },

  // Warm
  {
    id: 'warm',
    name: 'Warm',
    description: 'Warm orange/red tones',
    icon: Flame,
    category: 'color',
    effects: {
      hueRotate: -20,
      saturate: 1.3,
      brightness: 1.1,
      contrast: 1.05,
    },
  },

  // High Contrast
  {
    id: 'highcontrast',
    name: 'High Contrast',
    description: 'Enhanced contrast',
    icon: CircleDot,
    category: 'photographic',
    effects: {
      contrast: 1.5,
      brightness: 1.1,
      saturate: 1.2,
    },
  },

  // Vibrant
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Boosted saturation',
    icon: Rainbow,
    category: 'color',
    effects: {
      saturate: 1.8,
      contrast: 1.2,
      brightness: 1.05,
    },
  },

  // Fade
  {
    id: 'fade',
    name: 'Fade',
    description: 'Washed out look',
    icon: Cloud,
    category: 'photographic',
    effects: {
      contrast: 0.7,
      saturate: 0.6,
      brightness: 1.2,
    },
  },

  // Dramatic
  {
    id: 'dramatic',
    name: 'Dramatic',
    description: 'High contrast & saturation',
    icon: Zap,
    category: 'artistic',
    effects: {
      contrast: 1.6,
      saturate: 1.4,
      brightness: 0.95,
    },
  },

  // Noir
  {
    id: 'noir',
    name: 'Noir',
    description: 'Dark high-contrast B&W',
    icon: Film,
    category: 'artistic',
    effects: {
      grayscale: 1,
      contrast: 1.8,
      brightness: 0.9,
    },
  },

  // Pastel
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Soft pastel colors',
    icon: Paintbrush,
    category: 'artistic',
    effects: {
      saturate: 0.5,
      brightness: 1.3,
      contrast: 0.8,
    },
  },

  // Neon
  {
    id: 'neon',
    name: 'Neon',
    description: 'Electric bright colors',
    icon: Lightbulb,
    category: 'special',
    effects: {
      saturate: 2.5,
      contrast: 1.8,
      brightness: 1.2,
    },
  },

  // Invert
  {
    id: 'invert',
    name: 'Invert',
    description: 'Negative colors',
    icon: Rotate,
    category: 'special',
    effects: {
      invert: 1,
    },
  },

  // Dream
  {
    id: 'dream',
    name: 'Dream',
    description: 'Soft dreamy blur',
    icon: Sparkles,
    category: 'artistic',
    effects: {
      blur: 2,
      brightness: 1.2,
      saturate: 0.8,
      contrast: 0.9,
    },
  },

  // Retro
  {
    id: 'retro',
    name: 'Retro',
    description: '80s/90s aesthetic',
    icon: Clapperboard,
    category: 'photographic',
    effects: {
      hueRotate: 15,
      saturate: 1.4,
      contrast: 1.2,
      brightness: 1.1,
    },
  },

  // Cyberpunk
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic neon',
    icon: CircuitBoard,
    category: 'special',
    effects: {
      hueRotate: 270,
      saturate: 2,
      contrast: 1.5,
      brightness: 1.1,
    },
  },

  // Golden Hour
  {
    id: 'goldenhour',
    name: 'Golden Hour',
    description: 'Warm sunset tones',
    icon: Sunrise,
    category: 'color',
    effects: {
      hueRotate: -10,
      saturate: 1.3,
      brightness: 1.15,
      contrast: 1.1,
    },
  },

  // Arctic
  {
    id: 'arctic',
    name: 'Arctic',
    description: 'Cool icy tones',
    icon: Droplets,
    category: 'color',
    effects: {
      hueRotate: 200,
      saturate: 0.7,
      brightness: 1.2,
      contrast: 1.1,
    },
  },

  // Sunset
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm evening colors',
    icon: Sunset,
    category: 'color',
    effects: {
      hueRotate: -25,
      saturate: 1.5,
      brightness: 1.05,
      contrast: 1.15,
    },
  },
];
/* eslint-enable @typescript-eslint/no-unsafe-assignment */

/**
 * Get a filter preset by ID
 */
export const getFilterPreset = (id: string): FilterPreset | undefined => {
  return FILTER_PRESETS.find((preset) => preset.id === id);
};

/**
 * Get filter presets by category
 */
export const getFiltersByCategory = (
  category: FilterPreset['category']
): FilterPreset[] => {
  return FILTER_PRESETS.filter((preset) => preset.category === category);
};

/**
 * Apply a filter preset to an effects object
 */
export const applyFilterPreset = (
  currentEffects: Partial<FilterPreset['effects']>,
  presetId: string
): Partial<FilterPreset['effects']> => {
  const preset = getFilterPreset(presetId);
  if (!preset) return currentEffects;

  return {
    ...currentEffects,
    ...preset.effects,
  };
};
