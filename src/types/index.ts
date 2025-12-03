import { ReactElement } from 'react';

/**
 * Available asset categories for organizing and filtering Kubito editor elements.
 *
 * @remarks
 * Categories have been consolidated for better UX:
 * - Eyebrows and Moustache are now part of Hairs
 * - Decorations are now part of Accessories
 *
 * @public
 *
 * @example
 * ```typescript
 * const category: AssetCategory = 'Eyes';
 * const assets = ASSETS_LIBRARY[category];
 * ```
 */
export type AssetCategory =
  | 'Eyes'
  | 'Mouths'
  | 'Noses'
  | 'Hairs'
  | 'Accessories'
  | 'Backgrounds'
  | 'Bodies';

/**
 * Represents a pre-made design that can be loaded from the gallery.
 *
 * @public
 *
 * @example
 * ```typescript
 * const item: GalleryItem = {
 *   id: 'example-1',
 *   name: 'Happy Kubito',
 *   description: 'A cheerful character design',
 *   folder: 'example-1',
 *   thumbnail: 'example.png',
 *   kubito: 'example.kubito'
 * };
 * ```
 */
export interface GalleryItem {
  /** Unique identifier for the gallery item */
  id: string;
  /** Display name shown in the gallery */
  name: string;
  /** Brief description of the design */
  description: string;
  /** Folder name in `public/kubito-gallery` */
  folder: string;
  /** Filename of the thumbnail image (PNG/JPEG) */
  thumbnail: string;
  /** Filename of the .kubito design file (JSON) */
  kubito: string;
}

/**
 * File format for saving and loading Kubito designs.
 *
 * @remarks
 * The `.kubito` format is a JSON-based file that stores the complete editor state,
 * including canvas configuration and all items with their properties.
 *
 * @public
 *
 * @example
 * ```typescript
 * const file: KubitoFile = {
 *   version: '1.0.0',
 *   name: 'My Design',
 *   canvas: {
 *     width: 720,
 *     height: 720,
 *     background: '#ffffff'
 *   },
 *   items: [...]
 * };
 * ```
 */
export interface KubitoFile {
  /** File format version for compatibility checking */
  version: string;
  /** Optional name of the design */
  name?: string;
  /** Canvas configuration settings */
  canvas?: {
    /** Canvas width in pixels */
    width: number;
    /** Canvas height in pixels */
    height: number;
    /** Background color (CSS color string) */
    background: string;
  };
  /** Array of canvas items (KubitoItem objects) */
  items: unknown[];
}

/**
 * Represents a reusable SVG asset that can be placed on the canvas.
 *
 * @remarks
 * Assets can be provided as React SVG elements (legacy) or as file paths.
 * The file path method is preferred for better performance and flexibility.
 *
 * @public
 *
 * @example
 * ```typescript
 * const asset: Asset = {
 *   id: 'eye-sparkle',
 *   name: 'Sparkle Eyes',
 *   category: 'Eyes',
 *   svgPath: '/assets/svg/eyes/eye-sparkle.svg',
 *   tags: ['happy', 'excited', 'sparkle']
 * };
 * ```
 */
export interface Asset {
  /** Unique identifier for the asset */
  id: string;
  /** Display name shown in the asset panel */
  name: string;
  /** Legacy: React SVG element to render (deprecated) */
  svg?: ReactElement;
  /** Preferred: Path to SVG file in public folder */
  svgPath?: string;
  /** Category for organization and filtering */
  category: AssetCategory;
  /** Optional search tags for filtering */
  tags?: string[];
}

/**
 * Transformation properties for positioning and orienting canvas items.
 *
 * @remarks
 * All transformations are applied in the following order:
 * 1. Flip (if enabled)
 * 2. Scale
 * 3. Rotate
 * 4. Translate (x, y position)
 *
 * @public
 *
 * @example
 * ```typescript
 * const transform: Transform = {
 *   x: 360,
 *   y: 280,
 *   scale: 1.5,
 *   rotate: 45,
 *   flipX: false,
 *   flipY: true
 * };
 * ```
 */
export interface Transform {
  /** Horizontal position in pixels from canvas left */
  x: number;
  /** Vertical position in pixels from canvas top */
  y: number;
  /** Scale factor (1.0 = 100%, 2.0 = 200%, etc.) */
  scale: number;
  /** Rotation angle in degrees (0-360) */
  rotate: number;
  /** Whether to flip horizontally (mirror) */
  flipX: boolean;
  /** Whether to flip vertically */
  flipY: boolean;
}

/**
 * Visual effects that can be applied to canvas items.
 *
 * @remarks
 * Effects are applied using CSS filters and SVG filters.
 * Multiple effects can be combined for creative results.
 *
 * @public
 *
 * @example
 * ```typescript
 * const effects: VisualEffects = {
 *   opacity: 0.9,
 *   color: '#ff6b6b',
 *   shadowBlur: 10,
 *   shadowOffsetX: 2,
 *   shadowOffsetY: 2,
 *   shadowColor: '#000000',
 *   shadowOpacity: 0.5,
 *   blur: 0,
 *   brightness: 1.2,
 *   contrast: 1.1,
 *   saturate: 1.3,
 *   hueRotate: 30,
 *   grayscale: 0,
 *   sepia: 0,
 *   invert: 0
 * };
 * ```
 */
export interface VisualEffects {
  /** Overall opacity (0 = transparent, 1 = opaque) */
  opacity: number;
  /** Tint color applied to the item (CSS color string) */
  color: string;
  /** Shadow blur radius in pixels (0 = sharp shadow) */
  shadowBlur: number;
  /** Shadow horizontal offset in pixels */
  shadowOffsetX: number;
  /** Shadow vertical offset in pixels */
  shadowOffsetY: number;
  /** Shadow color (CSS color string) */
  shadowColor: string;
  /** Shadow opacity (0 = transparent, 1 = opaque) */
  shadowOpacity: number;
  /** Blur amount in pixels (0 = no blur) */
  blur: number;
  /** Brightness multiplier (1.0 = 100%, 2.0 = 200%) */
  brightness: number;
  /** Contrast multiplier (1.0 = 100%, 1.5 = 150%) */
  contrast: number;
  /** Saturation multiplier (1.0 = 100%, 0 = grayscale) */
  saturate: number;
  /** Hue rotation in degrees (0-360) */
  hueRotate?: number;
  /** Grayscale amount (0 = full color, 1 = full grayscale) */
  grayscale?: number;
  /** Sepia tone amount (0 = no sepia, 1 = full sepia) */
  sepia?: number;
  /** Color inversion amount (0 = normal, 1 = inverted) */
  invert?: number;
  /** Name of a predefined filter preset */
  filterPreset?: string;
}

/**
 * A complete canvas item combining an asset with transforms, effects, and metadata.
 *
 * @remarks
 * KubitoItem extends Transform, inheriting all transformation properties.
 * Each item on the canvas is represented by a unique KubitoItem instance.
 *
 * @public
 *
 * @example
 * ```typescript
 * const item: KubitoItem = {
 *   id: 'item-1',
 *   category: 'Eyes',
 *   assetId: 'eye-sparkle',
 *   name: 'Sparkle Eyes',
 *   x: 360,
 *   y: 280,
 *   z: 5,
 *   scale: 1.0,
 *   rotate: 0,
 *   flipX: false,
 *   flipY: false,
 *   locked: false,
 *   visible: true,
 *   effects: { ... }
 * };
 * ```
 */
export interface KubitoItem extends Transform {
  /** Unique identifier for this item instance (UUID) */
  id: string;
  /** Category of the source asset */
  category: AssetCategory;
  /** Reference to the source asset ID */
  assetId: string;
  /** Display name for the item (shown in layers panel) */
  name: string;
  /** Z-index for layer ordering (higher = on top) */
  z: number;
  /** When true, item cannot be edited or moved */
  locked: boolean;
  /** Controls visibility on canvas */
  visible: boolean;
  /** Visual effects applied to this item */
  effects: VisualEffects;
}

/**
 * Predefined canvas size configuration.
 *
 * @remarks
 * Presets provide quick access to common canvas sizes.
 * Custom sizes can also be set manually.
 *
 * @public
 *
 * @example
 * ```typescript
 * const preset: CanvasPreset = {
 *   id: 'square-large',
 *   name: 'Square (720x720)',
 *   width: 720,
 *   height: 720,
 *   icon: 'square',
 *   description: 'Perfect for social media'
 * };
 * ```
 */
export interface CanvasPreset {
  /** Unique identifier for the preset */
  id: string;
  /** Display name shown in the preset selector */
  name: string;
  /** Canvas width in pixels */
  width: number;
  /** Canvas height in pixels */
  height: number;
  /** Icon identifier for UI display (Lucide icon name) */
  icon: string;
  /** Optional description text */
  description?: string;
}

/**
 * Global editor configuration settings.
 *
 * @remarks
 * These settings control the canvas appearance and behavior.
 * Configuration is persisted in localStorage.
 *
 * @public
 *
 * @example
 * ```typescript
 * const config: EditorConfig = {
 *   canvasWidth: 720,
 *   canvasHeight: 720,
 *   canvasPreset: 'square-large',
 *   gridEnabled: true,
 *   snapToGrid: true,
 *   gridSize: 10,
 *   backgroundColor: '#ffffff'
 * };
 * ```
 */
export interface EditorConfig {
  /** Canvas width in pixels */
  canvasWidth: number;
  /** Canvas height in pixels */
  canvasHeight: number;
  /** ID of the selected preset (if any) */
  canvasPreset?: string;
  /** Whether to show the grid overlay */
  gridEnabled: boolean;
  /** Whether to snap elements to grid */
  snapToGrid: boolean;
  /** Grid cell size in pixels */
  gridSize: number;
  /** Background color of the canvas (CSS color string) */
  backgroundColor: string;
}

/**
 * UI theme configuration.
 * @interface EditorTheme
 * @property {string} id - Unique theme identifier
 * @property {string} name - Display name for the theme
 * @property {string} primaryColor - Primary accent color
 * @property {string} secondaryColor - Secondary accent color
 * @property {string} backgroundColor - Background color
 * @property {string} textColor - Text color
 * @property {boolean} isDark - Indicates if theme is dark mode
 */
export interface EditorTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  isDark: boolean;
}

/**
 * A collection of colors for quick access.
 * @interface ColorPalette
 * @property {string} id - Unique palette identifier
 * @property {string} name - Display name for the palette
 * @property {string[]} colors - Array of CSS color strings
 */
export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

/**
 * Complete project data structure for save/load operations.
 * @interface ProjectData
 * @property {string} version - File format version
 * @property {string} name - Project name
 * @property {KubitoItem[]} items - All canvas items
 * @property {EditorConfig} config - Editor configuration
 * @property {number} createdAt - Creation timestamp
 * @property {number} updatedAt - Last update timestamp
 */
export interface ProjectData {
  version: string;
  name: string;
  items: KubitoItem[];
  config: EditorConfig;
  createdAt: number;
  updatedAt: number;
}

/**
 * Snapshot of editor state for undo/redo functionality.
 * @interface HistoryState
 * @property {KubitoItem[]} items - Snapshot of all items
 * @property {number} timestamp - Time when snapshot was taken
 */
export interface HistoryState {
  items: KubitoItem[];
  timestamp: number;
}

/**
 * Current transformation mode for selected items.
 * - `none`: No active transformation
 * - `move`: Move items
 * - `scale`: Scale items
 * - `rotate`: Rotate items
 */
export type TransformMode = 'none' | 'move' | 'scale' | 'rotate';

/**
 * Supported export file formats.
 */
export type ExportFormat = 'svg' | 'png' | 'jpeg' | 'webp';

/**
 * Options for exporting canvas content.
 * @interface ExportOptions
 * @property {ExportFormat} format - Output file format
 * @property {number} quality - Quality setting (0-100) for lossy formats
 * @property {number} width - Output width in pixels
 * @property {number} height - Output height in pixels
 * @property {boolean} transparentBackground - Removes background if true
 * @property {boolean} autoCrop - Auto-crops to content bounds if true
 */
export interface ExportOptions {
  format: ExportFormat;
  quality: number;
  width: number;
  height: number;
  transparentBackground: boolean;
  autoCrop: boolean;
}

/**
 * Default visual effects applied to new items.
 * All effects are set to neutral/identity values.
 */
export const DEFAULT_EFFECTS: VisualEffects = {
  opacity: 1,
  color: '#000000',
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowColor: '#000000',
  shadowOpacity: 0.3,
  blur: 0,
  brightness: 1,
  contrast: 1,
  saturate: 1,
};

/**
 * Default transformation applied to new items.
 * Items are centered at (360, 360) with no transformations.
 */
export const DEFAULT_TRANSFORM: Transform = {
  x: 360,
  y: 360,
  scale: 1,
  rotate: 0,
  flipX: false,
  flipY: false,
};

// ==================== BRUSH SYSTEM ====================

/**
 * Brush type: Only pencil round is available
 */
export type BrushType = 'round';

/**
 * Drawing tool modes.
 * - `brush`: Standard drawing mode
 * - `eraser`: Erases existing strokes
 * - `none`: No drawing tool active
 */
export type BrushMode = 'brush' | 'eraser' | 'select' | 'none';

/**
 * A single point in a brush stroke.
 */
export interface BrushPoint {
  /** X coordinate relative to canvas */
  x: number;
  /** Y coordinate relative to canvas */
  y: number;
}

/**
 * Configuration for brush drawing tool.
 */
export interface BrushSettings {
  /** Type of brush tip */
  type: BrushType;
  /** Brush size/thickness in pixels */
  size: number;
  /** Brush color (CSS color string) */
  color: string;
  /** Opacity (0 = transparent, 1 = opaque) */
  opacity: number;
  /** Smoothing factor for stroke rendering (0 = no smoothing, 1 = maximum) */
  smoothing: number;
}

/**
 * A complete brush stroke drawn on the canvas.
 */
export interface BrushStroke {
  /** Unique identifier for the stroke */
  id: string;
  /** Array of points forming the stroke path */
  points: BrushPoint[];
  /** Settings used when drawing this stroke */
  settings: BrushSettings;
  /** Z-index for layer ordering */
  z: number;
  /** When true, stroke cannot be edited or deleted */
  locked: boolean;
  /** Controls visibility on canvas */
  visible: boolean;
  /** Timestamp when stroke was created */
  createdAt: number;
  /** X offset for positioning the stroke */
  offsetX: number;
  /** Y offset for positioning the stroke */
  offsetY: number;
  /** Scale factor (1.0 = 100%, 2.0 = 200%, etc.) */
  scale: number;
  /** Rotation angle in degrees (0-360) */
  rotate: number;
}

/**
 * Default brush settings for new strokes.
 */
export const DEFAULT_BRUSH_SETTINGS: BrushSettings = {
  type: 'round',
  size: 5,
  color: '#000000',
  opacity: 1,
  smoothing: 0.5,
};

// ==================== TEXT SYSTEM ====================

/**
 * Available font families for text elements.
 */
export type FontFamily =
  | 'Inter'
  | 'Roboto'
  | 'Open Sans'
  | 'Lato'
  | 'Montserrat'
  | 'Poppins'
  | 'Raleway'
  | 'Playfair Display'
  | 'Merriweather'
  | 'Bebas Neue'
  | 'Pacifico'
  | 'Lobster'
  | 'Dancing Script'
  | 'Caveat'
  | 'Permanent Marker'
  | 'Indie Flower'
  | 'Comic Neue'
  | 'Courier Prime';

/**
 * Text alignment options.
 */
export type TextAlign = 'left' | 'center' | 'right';

/**
 * Font weight options.
 */
export type FontWeight = 300 | 400 | 500 | 600 | 700 | 800 | 900;

/**
 * Text decoration options.
 */
export type TextDecoration = 'none' | 'underline' | 'line-through';

/**
 * Configuration for text styling.
 */
export interface TextSettings {
  /** Font family */
  fontFamily: FontFamily;
  /** Font size in pixels */
  fontSize: number;
  /** Font weight */
  fontWeight: FontWeight;
  /** Text color */
  color: string;
  /** Text alignment */
  textAlign: TextAlign;
  /** Text decoration */
  textDecoration: TextDecoration;
  /** Line height multiplier */
  lineHeight: number;
  /** Letter spacing in pixels */
  letterSpacing: number;
  /** Text opacity (0-1) */
  opacity: number;
  /** Italic style */
  italic: boolean;
}

/**
 * A text element on the canvas.
 */
export interface TextItem extends Transform {
  /** Unique identifier */
  id: string;
  /** Type identifier for text items */
  type: 'text';
  /** The text content */
  content: string;
  /** Text styling settings */
  settings: TextSettings;
  /** Width of the text box (for wrapping) */
  width: number;
  /** Z-index for layer ordering */
  z: number;
  /** When true, item cannot be edited or moved */
  locked: boolean;
  /** Controls visibility on canvas */
  visible: boolean;
  /** Whether the text is being edited */
  isEditing?: boolean;

  // Optional KubitoItem properties for compatibility
  category?: never;
  assetId?: never;
  name?: string;
  effects?: never;
}

/**
 * Default text settings.
 */
export const DEFAULT_TEXT_SETTINGS: TextSettings = {
  fontFamily: 'Inter',
  fontSize: 24,
  fontWeight: 400,
  color: '#000000',
  textAlign: 'left',
  textDecoration: 'none',
  lineHeight: 1.5,
  letterSpacing: 0,
  opacity: 1,
  italic: false,
};
