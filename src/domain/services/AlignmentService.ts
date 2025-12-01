import type { KubitoItem } from "@/types";

/**
 * Alignment position types
 */
export type AlignmentType =
  | "left"
  | "center"
  | "right"
  | "top"
  | "middle"
  | "bottom";

/**
 * Distribution types
 */
export type DistributionType = "horizontal" | "vertical";

/**
 * Service for aligning and distributing items on canvas.
 */
export class AlignmentService {
  /**
   * Aligns items to the left
   */
  static alignLeft(
    items: KubitoItem[],
    ids: string[],
    canvasWidth?: number,
  ): KubitoItem[] {
    const itemsToAlign = items.filter((item) => ids.includes(item.id));
    if (itemsToAlign.length === 0) return items;

    // Find leftmost position or use canvas edge
    const minX =
      canvasWidth !== undefined
        ? 0
        : Math.min(...itemsToAlign.map((item) => item.x));

    return items.map((item) => {
      if (ids.includes(item.id)) {
        return { ...item, x: minX };
      }
      return item;
    });
  }

  /**
   * Aligns items to the center horizontally
   */
  static alignCenter(
    items: KubitoItem[],
    ids: string[],
    canvasWidth?: number,
  ): KubitoItem[] {
    const itemsToAlign = items.filter((item) => ids.includes(item.id));
    if (itemsToAlign.length === 0) return items;

    // Calculate center position
    const centerX =
      canvasWidth !== undefined
        ? canvasWidth / 2
        : itemsToAlign.reduce((sum, item) => sum + item.x, 0) /
          itemsToAlign.length;

    return items.map((item) => {
      if (ids.includes(item.id)) {
        return { ...item, x: centerX };
      }
      return item;
    });
  }

  /**
   * Aligns items to the right
   */
  static alignRight(
    items: KubitoItem[],
    ids: string[],
    canvasWidth?: number,
  ): KubitoItem[] {
    const itemsToAlign = items.filter((item) => ids.includes(item.id));
    if (itemsToAlign.length === 0) return items;

    // Find rightmost position or use canvas edge
    const maxX =
      canvasWidth !== undefined
        ? canvasWidth
        : Math.max(...itemsToAlign.map((item) => item.x));

    return items.map((item) => {
      if (ids.includes(item.id)) {
        return { ...item, x: maxX };
      }
      return item;
    });
  }

  /**
   * Aligns items to the top
   */
  static alignTop(
    items: KubitoItem[],
    ids: string[],
    canvasHeight?: number,
  ): KubitoItem[] {
    const itemsToAlign = items.filter((item) => ids.includes(item.id));
    if (itemsToAlign.length === 0) return items;

    // Find topmost position or use canvas edge
    const minY =
      canvasHeight !== undefined
        ? 0
        : Math.min(...itemsToAlign.map((item) => item.y));

    return items.map((item) => {
      if (ids.includes(item.id)) {
        return { ...item, y: minY };
      }
      return item;
    });
  }

  /**
   * Aligns items to the middle vertically
   */
  static alignMiddle(
    items: KubitoItem[],
    ids: string[],
    canvasHeight?: number,
  ): KubitoItem[] {
    const itemsToAlign = items.filter((item) => ids.includes(item.id));
    if (itemsToAlign.length === 0) return items;

    // Calculate middle position
    const middleY =
      canvasHeight !== undefined
        ? canvasHeight / 2
        : itemsToAlign.reduce((sum, item) => sum + item.y, 0) /
          itemsToAlign.length;

    return items.map((item) => {
      if (ids.includes(item.id)) {
        return { ...item, y: middleY };
      }
      return item;
    });
  }

  /**
   * Aligns items to the bottom
   */
  static alignBottom(
    items: KubitoItem[],
    ids: string[],
    canvasHeight?: number,
  ): KubitoItem[] {
    const itemsToAlign = items.filter((item) => ids.includes(item.id));
    if (itemsToAlign.length === 0) return items;

    // Find bottommost position or use canvas edge
    const maxY =
      canvasHeight !== undefined
        ? canvasHeight
        : Math.max(...itemsToAlign.map((item) => item.y));

    return items.map((item) => {
      if (ids.includes(item.id)) {
        return { ...item, y: maxY };
      }
      return item;
    });
  }

  /**
   * Aligns items based on type
   */
  static align(
    items: KubitoItem[],
    ids: string[],
    alignmentType: AlignmentType,
    canvasWidth?: number,
    canvasHeight?: number,
  ): KubitoItem[] {
    switch (alignmentType) {
      case "left":
        return this.alignLeft(items, ids, canvasWidth);
      case "center":
        return this.alignCenter(items, ids, canvasWidth);
      case "right":
        return this.alignRight(items, ids, canvasWidth);
      case "top":
        return this.alignTop(items, ids, canvasHeight);
      case "middle":
        return this.alignMiddle(items, ids, canvasHeight);
      case "bottom":
        return this.alignBottom(items, ids, canvasHeight);
      default:
        return items;
    }
  }

  /**
   * Distributes items horizontally with equal spacing
   */
  static distributeHorizontally(
    items: KubitoItem[],
    ids: string[],
  ): KubitoItem[] {
    const itemsToDistribute = items
      .filter((item) => ids.includes(item.id))
      .sort((a, b) => a.x - b.x);

    if (itemsToDistribute.length < 3) return items;

    const firstItem = itemsToDistribute[0];
    const lastItem = itemsToDistribute[itemsToDistribute.length - 1];
    if (!firstItem || !lastItem) return items;

    const minX = firstItem.x;
    const maxX = lastItem.x;
    const spacing = (maxX - minX) / (itemsToDistribute.length - 1);

    const updatedPositions = new Map<string, number>();
    itemsToDistribute.forEach((item, index) => {
      updatedPositions.set(item.id, minX + spacing * index);
    });

    return items.map((item) => {
      const newX = updatedPositions.get(item.id);
      if (newX !== undefined) {
        return { ...item, x: newX };
      }
      return item;
    });
  }

  /**
   * Distributes items vertically with equal spacing
   */
  static distributeVertically(
    items: KubitoItem[],
    ids: string[],
  ): KubitoItem[] {
    const itemsToDistribute = items
      .filter((item) => ids.includes(item.id))
      .sort((a, b) => a.y - b.y);

    if (itemsToDistribute.length < 3) return items;

    const firstItem = itemsToDistribute[0];
    const lastItem = itemsToDistribute[itemsToDistribute.length - 1];
    if (!firstItem || !lastItem) return items;

    const minY = firstItem.y;
    const maxY = lastItem.y;
    const spacing = (maxY - minY) / (itemsToDistribute.length - 1);

    const updatedPositions = new Map<string, number>();
    itemsToDistribute.forEach((item, index) => {
      updatedPositions.set(item.id, minY + spacing * index);
    });

    return items.map((item) => {
      const newY = updatedPositions.get(item.id);
      if (newY !== undefined) {
        return { ...item, y: newY };
      }
      return item;
    });
  }

  /**
   * Distributes items based on type
   */
  static distribute(
    items: KubitoItem[],
    ids: string[],
    distributionType: DistributionType,
  ): KubitoItem[] {
    switch (distributionType) {
      case "horizontal":
        return this.distributeHorizontally(items, ids);
      case "vertical":
        return this.distributeVertically(items, ids);
      default:
        return items;
    }
  }

  /**
   * Centers items on canvas
   */
  static centerOnCanvas(
    items: KubitoItem[],
    ids: string[],
    canvasWidth: number,
    canvasHeight: number,
  ): KubitoItem[] {
    const centered = this.alignCenter(items, ids, canvasWidth);
    return this.alignMiddle(centered, ids, canvasHeight);
  }

  /**
   * Gets the bounds of selected items
   */
  static getSelectionBounds(
    items: KubitoItem[],
    ids: string[],
  ): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
    centerX: number;
    centerY: number;
  } {
    const selectedItems = items.filter((item) => ids.includes(item.id));

    if (selectedItems.length === 0) {
      return {
        minX: 0,
        minY: 0,
        maxX: 0,
        maxY: 0,
        width: 0,
        height: 0,
        centerX: 0,
        centerY: 0,
      };
    }

    const minX = Math.min(...selectedItems.map((item) => item.x));
    const minY = Math.min(...selectedItems.map((item) => item.y));
    const maxX = Math.max(...selectedItems.map((item) => item.x));
    const maxY = Math.max(...selectedItems.map((item) => item.y));

    return {
      minX,
      minY,
      maxX,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
      centerX: (minX + maxX) / 2,
      centerY: (minY + maxY) / 2,
    };
  }
}
