import type { KubitoItem, ExportOptions } from "@/types";

/**
 * Service for exporting canvas content.
 * Handles SVG, PNG, JPEG, and WebP exports.
 */
export class ExportService {
  /**
   * Creates default export options
   */
  static createDefaultOptions(
    canvasWidth: number,
    canvasHeight: number,
  ): ExportOptions {
    return {
      format: "png",
      quality: 100,
      width: canvasWidth,
      height: canvasHeight,
      transparentBackground: false,
      autoCrop: false,
    };
  }

  /**
   * Validates export options
   */
  static validateOptions(options: ExportOptions): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (options.width <= 0) {
      errors.push("Width must be positive");
    }
    if (options.height <= 0) {
      errors.push("Height must be positive");
    }
    if (options.quality < 0 || options.quality > 100) {
      errors.push("Quality must be between 0 and 100");
    }
    if (options.width > 10000 || options.height > 10000) {
      errors.push("Dimensions exceed maximum (10000px)");
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Gets the MIME type for a format
   */
  static getMimeType(format: ExportOptions["format"]): string {
    const mimeTypes: Record<string, string> = {
      svg: "image/svg+xml",
      png: "image/png",
      jpeg: "image/jpeg",
      webp: "image/webp",
    };
    return mimeTypes[format] || "image/png";
  }

  /**
   * Gets file extension for a format
   */
  static getFileExtension(format: ExportOptions["format"]): string {
    return format === "svg" ? "svg" : format;
  }

  /**
   * Generates a filename with timestamp
   */
  static generateFilename(
    baseName: string,
    format: ExportOptions["format"],
  ): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const extension = this.getFileExtension(format);
    return `${baseName}_${timestamp}.${extension}`;
  }

  /**
   * Calculates export scale factor
   */
  static calculateScaleFactor(
    sourceWidth: number,
    sourceHeight: number,
    targetWidth: number,
    targetHeight: number,
  ): { scaleX: number; scaleY: number } {
    return {
      scaleX: targetWidth / sourceWidth,
      scaleY: targetHeight / sourceHeight,
    };
  }

  /**
   * Gets visible items only
   */
  static getVisibleItems(items: KubitoItem[]): KubitoItem[] {
    return items.filter((item) => item.visible);
  }

  /**
   * Sorts items by z-index for correct rendering order
   */
  static sortItemsForExport(items: KubitoItem[]): KubitoItem[] {
    return [...items].sort((a, b) => a.z - b.z);
  }

  /**
   * Calculates bounding box of all items
   */
  static calculateBoundingBox(items: KubitoItem[]): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  } {
    if (items.length === 0) {
      return {
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0,
        width: 0,
        height: 0,
      };
    }

    // Approximate bounds (100px base size per item)
    const bounds = items.map((item) => {
      const size = 100 * item.scale;
      return {
        minX: item.x - size / 2,
        minY: item.y - size / 2,
        maxX: item.x + size / 2,
        maxY: item.y + size / 2,
      };
    });

    const minX = Math.min(...bounds.map((b) => b.minX));
    const minY = Math.min(...bounds.map((b) => b.minY));
    const maxX = Math.max(...bounds.map((b) => b.maxX));
    const maxY = Math.max(...bounds.map((b) => b.maxY));

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  /**
   * Prepares items for export (visibility, sorting)
   */
  static prepareItemsForExport(items: KubitoItem[]): KubitoItem[] {
    const visibleItems = this.getVisibleItems(items);
    return this.sortItemsForExport(visibleItems);
  }

  /**
   * Gets export metadata
   */
  static getExportMetadata(options: ExportOptions): {
    mimeType: string;
    extension: string;
    filename: string;
  } {
    return {
      mimeType: this.getMimeType(options.format),
      extension: this.getFileExtension(options.format),
      filename: this.generateFilename("kubito", options.format),
    };
  }

  /**
   * Converts quality (0-100) to canvas quality (0-1)
   */
  static normalizeQuality(quality: number): number {
    return Math.max(0, Math.min(100, quality)) / 100;
  }

  /**
   * Gets recommended quality for format
   */
  static getRecommendedQuality(format: ExportOptions["format"]): number {
    const recommendations: Record<string, number> = {
      svg: 100,
      png: 100,
      jpeg: 90,
      webp: 90,
    };
    return recommendations[format] || 90;
  }

  /**
   * Estimates file size (rough approximation)
   */
  static estimateFileSize(
    width: number,
    height: number,
    format: ExportOptions["format"],
    quality: number,
  ): {
    bytes: number;
    kilobytes: number;
    megabytes: number;
    formatted: string;
  } {
    let bytes = 0;

    switch (format) {
      case "svg":
        // SVG is text-based, roughly estimate
        bytes = width * height * 0.05;
        break;
      case "png":
        // PNG is lossless, roughly 4 bytes per pixel
        bytes = width * height * 4;
        break;
      case "jpeg":
        // JPEG is lossy, depends on quality
        bytes = width * height * (quality / 100) * 3;
        break;
      case "webp":
        // WebP is efficient
        bytes = width * height * (quality / 100) * 2;
        break;
    }

    const kilobytes = bytes / 1024;
    const megabytes = kilobytes / 1024;

    let formatted: string;
    if (megabytes >= 1) {
      formatted = `${megabytes.toFixed(2)} MB`;
    } else if (kilobytes >= 1) {
      formatted = `${kilobytes.toFixed(2)} KB`;
    } else {
      formatted = `${bytes.toFixed(0)} bytes`;
    }

    return {
      bytes,
      kilobytes,
      megabytes,
      formatted,
    };
  }
}
