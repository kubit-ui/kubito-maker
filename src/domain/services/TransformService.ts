import type { KubitoItem, Transform } from "@/types";
import { KubitoItemModel } from "@/domain/models";

/**
 * Service for handling item transformations.
 * Encapsulates all transformation logic (move, scale, rotate, flip).
 */
export class TransformService {
  /**
   * Moves an item by delta
   */
  static moveItemBy(item: KubitoItem, dx: number, dy: number): KubitoItem {
    const model = new KubitoItemModel(item);
    return model.moveBy(dx, dy).data;
  }

  /**
   * Moves an item to absolute position
   */
  static moveItemTo(item: KubitoItem, x: number, y: number): KubitoItem {
    const model = new KubitoItemModel(item);
    return model.moveTo(x, y).data;
  }

  /**
   * Moves multiple items by delta
   */
  static moveItemsBy(
    items: KubitoItem[],
    ids: string[],
    dx: number,
    dy: number,
  ): KubitoItem[] {
    return items.map((item) => {
      if (ids.includes(item.id)) {
        return this.moveItemBy(item, dx, dy);
      }
      return item;
    });
  }

  /**
   * Scales an item by factor
   */
  static scaleItemBy(item: KubitoItem, factor: number): KubitoItem {
    const model = new KubitoItemModel(item);
    return model.scaleBy(factor).data;
  }

  /**
   * Sets absolute scale
   */
  static scaleItemTo(item: KubitoItem, scale: number): KubitoItem {
    const model = new KubitoItemModel(item);
    return model.scaleTo(scale).data;
  }

  /**
   * Scales multiple items by factor
   */
  static scaleItemsBy(
    items: KubitoItem[],
    ids: string[],
    factor: number,
  ): KubitoItem[] {
    return items.map((item) => {
      if (ids.includes(item.id)) {
        return this.scaleItemBy(item, factor);
      }
      return item;
    });
  }

  /**
   * Rotates an item by delta degrees
   */
  static rotateItemBy(item: KubitoItem, degrees: number): KubitoItem {
    const model = new KubitoItemModel(item);
    return model.rotateBy(degrees).data;
  }

  /**
   * Sets absolute rotation
   */
  static rotateItemTo(item: KubitoItem, degrees: number): KubitoItem {
    const model = new KubitoItemModel(item);
    return model.rotateTo(degrees).data;
  }

  /**
   * Rotates multiple items by delta
   */
  static rotateItemsBy(
    items: KubitoItem[],
    ids: string[],
    degrees: number,
  ): KubitoItem[] {
    return items.map((item) => {
      if (ids.includes(item.id)) {
        return this.rotateItemBy(item, degrees);
      }
      return item;
    });
  }

  /**
   * Flips an item horizontally
   */
  static flipItemHorizontal(item: KubitoItem): KubitoItem {
    const model = new KubitoItemModel(item);
    return model.flipHorizontal().data;
  }

  /**
   * Flips an item vertically
   */
  static flipItemVertical(item: KubitoItem): KubitoItem {
    const model = new KubitoItemModel(item);
    return model.flipVertical().data;
  }

  /**
   * Flips multiple items horizontally
   */
  static flipItemsHorizontal(items: KubitoItem[], ids: string[]): KubitoItem[] {
    return items.map((item) => {
      if (ids.includes(item.id)) {
        return this.flipItemHorizontal(item);
      }
      return item;
    });
  }

  /**
   * Flips multiple items vertically
   */
  static flipItemsVertical(items: KubitoItem[], ids: string[]): KubitoItem[] {
    return items.map((item) => {
      if (ids.includes(item.id)) {
        return this.flipItemVertical(item);
      }
      return item;
    });
  }

  /**
   * Applies a complete transformation to an item
   */
  static applyTransform(
    item: KubitoItem,
    transform: Partial<Transform>,
  ): KubitoItem {
    const model = new KubitoItemModel(item);
    return model.applyTransform(transform).data;
  }

  /**
   * Applies transformation to multiple items
   */
  static applyTransformToItems(
    items: KubitoItem[],
    ids: string[],
    transform: Partial<Transform>,
  ): KubitoItem[] {
    return items.map((item) => {
      if (ids.includes(item.id)) {
        return this.applyTransform(item, transform);
      }
      return item;
    });
  }

  /**
   * Resets transformations to default
   */
  static resetTransform(item: KubitoItem): KubitoItem {
    return {
      ...item,
      scale: 1,
      rotate: 0,
      flipX: false,
      flipY: false,
    };
  }

  /**
   * Gets the center point of an item
   */
  static getItemCenter(item: KubitoItem): { x: number; y: number } {
    return { x: item.x, y: item.y };
  }

  /**
   * Gets the bounding box center of multiple items
   */
  static getItemsCenter(items: KubitoItem[]): { x: number; y: number } {
    if (items.length === 0) {
      return { x: 0, y: 0 };
    }

    const sumX = items.reduce((sum, item) => sum + item.x, 0);
    const sumY = items.reduce((sum, item) => sum + item.y, 0);

    return {
      x: sumX / items.length,
      y: sumY / items.length,
    };
  }

  /**
   * Gets the bounding box of multiple items
   */
  static getItemsBounds(items: KubitoItem[]): {
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

    const bounds = items.map((item) => {
      const model = new KubitoItemModel(item);
      return model.getBounds();
    });

    const minX = Math.min(...bounds.map((b) => b.x));
    const minY = Math.min(...bounds.map((b) => b.y));
    const maxX = Math.max(...bounds.map((b) => b.x + b.width));
    const maxY = Math.max(...bounds.map((b) => b.y + b.height));

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
   * Snaps value to grid
   */
  static snapToGrid(value: number, gridSize: number): number {
    return Math.round(value / gridSize) * gridSize;
  }

  /**
   * Snaps point to grid
   */
  static snapPointToGrid(
    x: number,
    y: number,
    gridSize: number,
  ): { x: number; y: number } {
    return {
      x: this.snapToGrid(x, gridSize),
      y: this.snapToGrid(y, gridSize),
    };
  }

  /**
   * Constrains item position within bounds
   */
  static constrainToBounds(
    item: KubitoItem,
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
  ): KubitoItem {
    return {
      ...item,
      x: Math.max(minX, Math.min(item.x, maxX)),
      y: Math.max(minY, Math.min(item.y, maxY)),
    };
  }
}
