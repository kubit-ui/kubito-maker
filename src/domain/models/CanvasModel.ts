import type { EditorConfig } from "@/types";

/**
 * Domain model for Canvas configuration and state.
 * Encapsulates canvas-specific business logic.
 */
export class CanvasModel {
  private config: EditorConfig;

  constructor(config: EditorConfig) {
    this.config = config;
  }

  /**
   * Gets the raw config data
   */
  get data(): EditorConfig {
    return { ...this.config };
  }

  /**
   * Gets canvas dimensions
   */
  get dimensions(): { width: number; height: number } {
    return {
      width: this.config.canvasWidth,
      height: this.config.canvasHeight,
    };
  }

  /**
   * Gets canvas center point
   */
  get center(): { x: number; y: number } {
    return {
      x: this.config.canvasWidth / 2,
      y: this.config.canvasHeight / 2,
    };
  }

  /**
   * Gets aspect ratio
   */
  get aspectRatio(): number {
    return this.config.canvasWidth / this.config.canvasHeight;
  }

  /**
   * Checks if canvas is square
   */
  get isSquare(): boolean {
    return this.config.canvasWidth === this.config.canvasHeight;
  }

  /**
   * Checks if canvas is landscape
   */
  get isLandscape(): boolean {
    return this.config.canvasWidth > this.config.canvasHeight;
  }

  /**
   * Checks if canvas is portrait
   */
  get isPortrait(): boolean {
    return this.config.canvasWidth < this.config.canvasHeight;
  }

  /**
   * Updates canvas configuration
   */
  update(updates: Partial<EditorConfig>): CanvasModel {
    return new CanvasModel({
      ...this.config,
      ...updates,
    });
  }

  /**
   * Sets canvas size
   */
  setSize(width: number, height: number, presetId?: string): CanvasModel {
    return new CanvasModel({
      ...this.config,
      canvasWidth: width,
      canvasHeight: height,
      canvasPreset: presetId,
    });
  }

  /**
   * Sets background color
   */
  setBackgroundColor(color: string): CanvasModel {
    return new CanvasModel({
      ...this.config,
      backgroundColor: color,
    });
  }

  /**
   * Toggles grid visibility
   */
  toggleGrid(): CanvasModel {
    return new CanvasModel({
      ...this.config,
      gridEnabled: !this.config.gridEnabled,
    });
  }

  /**
   * Toggles snap to grid
   */
  toggleSnapToGrid(): CanvasModel {
    return new CanvasModel({
      ...this.config,
      snapToGrid: !this.config.snapToGrid,
    });
  }

  /**
   * Sets grid size
   */
  setGridSize(size: number): CanvasModel {
    if (size <= 0) {
      throw new Error("Grid size must be positive");
    }
    return new CanvasModel({
      ...this.config,
      gridSize: size,
    });
  }

  /**
   * Snaps a coordinate to grid
   */
  snapToGrid(value: number): number {
    if (!this.config.snapToGrid) return value;
    return Math.round(value / this.config.gridSize) * this.config.gridSize;
  }

  /**
   * Snaps a point to grid
   */
  snapPointToGrid(x: number, y: number): { x: number; y: number } {
    return {
      x: this.snapToGrid(x),
      y: this.snapToGrid(y),
    };
  }

  /**
   * Checks if a point is within canvas bounds
   */
  isPointInBounds(x: number, y: number): boolean {
    return (
      x >= 0 &&
      x <= this.config.canvasWidth &&
      y >= 0 &&
      y <= this.config.canvasHeight
    );
  }

  /**
   * Clamps a point to canvas bounds
   */
  clampPointToBounds(x: number, y: number): { x: number; y: number } {
    return {
      x: Math.max(0, Math.min(x, this.config.canvasWidth)),
      y: Math.max(0, Math.min(y, this.config.canvasHeight)),
    };
  }

  /**
   * Validates canvas configuration
   */
  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (this.config.canvasWidth <= 0) {
      errors.push("Canvas width must be positive");
    }
    if (this.config.canvasHeight <= 0) {
      errors.push("Canvas height must be positive");
    }
    if (this.config.gridSize <= 0) {
      errors.push("Grid size must be positive");
    }
    if (this.config.canvasWidth > 10000) {
      errors.push("Canvas width exceeds maximum (10000px)");
    }
    if (this.config.canvasHeight > 10000) {
      errors.push("Canvas height exceeds maximum (10000px)");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Gets canvas area in pixels
   */
  get area(): number {
    return this.config.canvasWidth * this.config.canvasHeight;
  }

  /**
   * Serializes config to JSON
   */
  toJSON(): EditorConfig {
    return this.data;
  }

  /**
   * Creates model from JSON
   */
  static fromJSON(json: EditorConfig): CanvasModel {
    return new CanvasModel(json);
  }

  /**
   * Creates default canvas model
   */
  static createDefault(): CanvasModel {
    return new CanvasModel({
      canvasWidth: 720,
      canvasHeight: 720,
      gridEnabled: false,
      snapToGrid: false,
      gridSize: 20,
      backgroundColor: "#ffffff",
    });
  }
}
