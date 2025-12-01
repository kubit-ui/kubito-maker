/**
 * ConfigManager
 * Service responsible for managing editor configuration and canvas settings
 * Framework-agnostic - pure TypeScript business logic
 */

import type { EditorConfig, EditorTheme, KubitoItem } from "@/types";
import { CanvasModel } from "../models";

/**
 * Validation result for configuration changes
 */
export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Result of canvas size change operation
 */
export interface CanvasSizeChangeResult {
  config: EditorConfig;
  validation: ConfigValidationResult;
  bodyUpdates?: {
    x: number;
    y: number;
    scale: number;
  };
}

/**
 * ConfigManager class
 * Handles all configuration-related business logic without framework dependencies
 */
export class ConfigManager {
  /**
   * Updates editor configuration with validation
   * @param currentConfig - Current configuration
   * @param updates - Partial updates to apply
   * @returns Validation result and new config (if valid)
   */
  static updateConfig(
    currentConfig: EditorConfig,
    updates: Partial<EditorConfig>,
  ): {
    valid: boolean;
    config: EditorConfig;
    validation: ConfigValidationResult;
  } {
    const currentCanvas = new CanvasModel(currentConfig);
    const updatedCanvas = currentCanvas.update(updates);
    const validation = updatedCanvas.validate();

    return {
      valid: validation.valid,
      config: validation.valid ? updatedCanvas.toJSON() : currentConfig,
      validation,
    };
  }

  /**
   * Sets canvas size with validation
   * @param currentConfig - Current configuration
   * @param width - New canvas width
   * @param height - New canvas height
   * @param presetId - Optional preset ID
   * @returns New configuration and body updates if valid
   */
  static setCanvasSize(
    currentConfig: EditorConfig,
    width: number,
    height: number,
    presetId?: string,
  ): CanvasSizeChangeResult {
    const currentCanvas = new CanvasModel(currentConfig);
    const updatedCanvas = currentCanvas.setSize(width, height, presetId);
    const validation = updatedCanvas.validate();

    if (!validation.valid) {
      return {
        config: currentConfig,
        validation,
      };
    }

    // Calculate kubito-base position and scale adjustments
    const targetBodySize = Math.min(width, height) * 0.8;
    const baseAssetSize = 80;
    const newScale = targetBodySize / baseAssetSize;

    return {
      config: updatedCanvas.toJSON(),
      validation,
      bodyUpdates: {
        x: width / 2,
        y: height / 2,
        scale: newScale,
      },
    };
  }

  /**
   * Sets the editor theme
   * @param theme - New theme configuration
   * @returns New theme
   */
  static setTheme(theme: EditorTheme): EditorTheme {
    return theme;
  }

  /**
   * Gets default configuration
   * @returns Default editor config
   */
  static getDefaultConfig(): EditorConfig {
    return {
      canvasWidth: 720,
      canvasHeight: 720,
      gridEnabled: false,
      snapToGrid: false,
      gridSize: 20,
      backgroundColor: "#ffffff",
    };
  }

  /**
   * Gets default theme
   * @returns Default editor theme
   */
  static getDefaultTheme(): EditorTheme {
    return {
      id: "light",
      name: "Light",
      primaryColor: "#1f6feb",
      secondaryColor: "#0969da",
      backgroundColor: "#ffffff",
      textColor: "#24292f",
      isDark: false,
    };
  }

  /**
   * Creates initial body item based on canvas configuration
   * @param config - Current canvas configuration
   * @param bodyId - Body asset ID to use
   * @returns Initial body item
   */
  static createInitialBodyItem(
    config: EditorConfig,
    bodyId: string = "body1",
  ): KubitoItem {
    const canvasWidth = config.canvasWidth;
    const canvasHeight = config.canvasHeight;
    const targetBodySize = Math.min(canvasWidth, canvasHeight) * 0.8;
    const baseAssetSize = 80;
    const bodyScale = targetBodySize / baseAssetSize;

    return {
      id: "kubito-base",
      category: "Bodies",
      assetId: bodyId,
      name: "Kubito Base",
      x: canvasWidth / 2,
      y: canvasHeight / 2,
      scale: bodyScale,
      rotate: 0,
      flipX: false,
      flipY: false,
      z: 0,
      locked: false,
      visible: true,
      effects: {
        opacity: 1,
        color: "#000000",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        shadowColor: "#000000",
        shadowOpacity: 0,
        blur: 0,
        brightness: 1,
        contrast: 1,
        saturate: 1,
      },
    };
  }

  /**
   * Validates configuration
   * @param config - Configuration to validate
   * @returns Validation result
   */
  static validateConfig(config: EditorConfig): ConfigValidationResult {
    const canvas = new CanvasModel(config);
    return canvas.validate();
  }
}
