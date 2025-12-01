import type { KubitoItem } from "@/types";

export interface Guide {
  type: "vertical" | "horizontal" | "distance" | "angle" | "spacing";
  position: number;
  alignedItems: string[]; // IDs of items aligned to this guide
  // Additional metadata for different guide types
  metadata?: {
    distance?: number; // For distance guides
    angle?: number; // For angle guides
    spacing?: number; // For spacing guides
    label?: string; // Display label
    startPoint?: { x: number; y: number }; // For distance/angle lines
    endPoint?: { x: number; y: number }; // For distance/angle lines
  };
}

export interface SnapResult {
  x: number;
  y: number;
  rotation?: number; // For angle snapping
  guides: Guide[];
  snapped: boolean;
}

export interface SnapConfig {
  enabled: boolean;
  snapToEdges: boolean;
  snapToCenters: boolean;
  snapToAngles: boolean;
  snapToSpacing: boolean;
  snapThreshold: number;
  angleSnapThreshold: number; // in degrees
  magneticAngles: number[]; // angles that snap (e.g., [0, 15, 30, 45, 90])
  showDistanceMeasurements: boolean;
  showAngleMeasurements: boolean;
}

const SNAP_THRESHOLD = 5; // pixels
const DEFAULT_MAGNETIC_ANGLES = [0, 15, 30, 45, 60, 90, 120, 135, 150, 180];
const ANGLE_SNAP_THRESHOLD = 5; // degrees

export const DEFAULT_SNAP_CONFIG: SnapConfig = {
  enabled: true,
  snapToEdges: true,
  snapToCenters: true,
  snapToAngles: true,
  snapToSpacing: false,
  snapThreshold: SNAP_THRESHOLD,
  angleSnapThreshold: ANGLE_SNAP_THRESHOLD,
  magneticAngles: DEFAULT_MAGNETIC_ANGLES,
  showDistanceMeasurements: false,
  showAngleMeasurements: false,
};

/**
 * Get item bounds
 */
export const getItemBounds = (item: KubitoItem) => {
  const baseSize = 80;
  const width = baseSize * item.scale;
  const height = baseSize * item.scale;

  return {
    left: item.x - width / 2,
    right: item.x + width / 2,
    top: item.y - height / 2,
    bottom: item.y + height / 2,
    centerX: item.x,
    centerY: item.y,
    width,
    height,
  };
};

/**
 * Check if two values are within snap threshold
 */
const isNear = (a: number, b: number, threshold = SNAP_THRESHOLD): boolean => {
  return Math.abs(a - b) <= threshold;
};

/**
 * Calculate smart guides and snap position
 * Now includes alignment guides with kubito-base (body) for centering
 * Enhanced with distance measurements and smart spacing
 */
export const calculateSmartGuides = (
  movingItem: KubitoItem,
  newX: number,
  newY: number,
  otherItems: KubitoItem[],
  config: SnapConfig = DEFAULT_SNAP_CONFIG,
): SnapResult => {
  const guides: Guide[] = [];
  let snappedX = newX;
  let snappedY = newY;
  let snappedToX = false;
  let snappedToY = false;

  if (!config.enabled) {
    return { x: newX, y: newY, guides: [], snapped: false };
  }

  const movingBounds = {
    ...getItemBounds(movingItem),
    centerX: newX,
    centerY: newY,
    left: newX - getItemBounds(movingItem).width / 2,
    right: newX + getItemBounds(movingItem).width / 2,
    top: newY - getItemBounds(movingItem).height / 2,
    bottom: newY + getItemBounds(movingItem).height / 2,
  };

  // Find kubito-base (body) if exists
  const kubitoBase = otherItems.find((item) => item.id === "kubito-base");

  // First, check alignment with kubito-base (higher priority)
  if (
    kubitoBase &&
    kubitoBase.visible &&
    movingItem.id !== "kubito-base" &&
    (config.snapToEdges || config.snapToCenters)
  ) {
    const baseBounds = getItemBounds(kubitoBase);

    // Vertical guides (X alignment) with kubito-base
    if (!snappedToX) {
      // Center to center with base
      if (
        config.snapToCenters &&
        isNear(movingBounds.centerX, baseBounds.centerX)
      ) {
        snappedX = baseBounds.centerX;
        snappedToX = true;
        guides.push({
          type: "vertical",
          position: baseBounds.centerX,
          alignedItems: [movingItem.id, kubitoBase.id],
        });
      }
      // Left to center of base
      else if (
        config.snapToEdges &&
        isNear(movingBounds.left, baseBounds.centerX)
      ) {
        snappedX = baseBounds.centerX + movingBounds.width / 2;
        snappedToX = true;
        guides.push({
          type: "vertical",
          position: baseBounds.centerX,
          alignedItems: [movingItem.id, kubitoBase.id],
        });
      }
      // Right to center of base
      else if (
        config.snapToEdges &&
        isNear(movingBounds.right, baseBounds.centerX)
      ) {
        snappedX = baseBounds.centerX - movingBounds.width / 2;
        snappedToX = true;
        guides.push({
          type: "vertical",
          position: baseBounds.centerX,
          alignedItems: [movingItem.id, kubitoBase.id],
        });
      }
    }

    // Horizontal guides (Y alignment) with kubito-base
    if (!snappedToY) {
      // Center to center with base
      if (
        config.snapToCenters &&
        isNear(movingBounds.centerY, baseBounds.centerY)
      ) {
        snappedY = baseBounds.centerY;
        snappedToY = true;
        guides.push({
          type: "horizontal",
          position: baseBounds.centerY,
          alignedItems: [movingItem.id, kubitoBase.id],
        });
      }
      // Top to center of base
      else if (
        config.snapToEdges &&
        isNear(movingBounds.top, baseBounds.centerY)
      ) {
        snappedY = baseBounds.centerY + movingBounds.height / 2;
        snappedToY = true;
        guides.push({
          type: "horizontal",
          position: baseBounds.centerY,
          alignedItems: [movingItem.id, kubitoBase.id],
        });
      }
      // Bottom to center of base
      else if (
        config.snapToEdges &&
        isNear(movingBounds.bottom, baseBounds.centerY)
      ) {
        snappedY = baseBounds.centerY - movingBounds.height / 2;
        snappedToY = true;
        guides.push({
          type: "horizontal",
          position: baseBounds.centerY,
          alignedItems: [movingItem.id, kubitoBase.id],
        });
      }
    }
  }

  // Check alignment with each other item (excluding kubito-base as it was already checked)
  otherItems.forEach((other) => {
    if (
      other.id === movingItem.id ||
      !other.visible ||
      other.id === "kubito-base" ||
      !(config.snapToEdges || config.snapToCenters)
    )
      return;

    const otherBounds = getItemBounds(other);

    // Vertical guides (X alignment)
    if (!snappedToX) {
      // Center to center
      if (
        config.snapToCenters &&
        isNear(movingBounds.centerX, otherBounds.centerX)
      ) {
        snappedX = otherBounds.centerX;
        snappedToX = true;
        guides.push({
          type: "vertical",
          position: otherBounds.centerX,
          alignedItems: [movingItem.id, other.id],
        });
      }
      // Left to left
      else if (
        config.snapToEdges &&
        isNear(movingBounds.left, otherBounds.left)
      ) {
        snappedX = otherBounds.left + movingBounds.width / 2;
        snappedToX = true;
        guides.push({
          type: "vertical",
          position: otherBounds.left,
          alignedItems: [movingItem.id, other.id],
        });
      }
      // Right to right
      else if (
        config.snapToEdges &&
        isNear(movingBounds.right, otherBounds.right)
      ) {
        snappedX = otherBounds.right - movingBounds.width / 2;
        snappedToX = true;
        guides.push({
          type: "vertical",
          position: otherBounds.right,
          alignedItems: [movingItem.id, other.id],
        });
      }
      // Left to right
      else if (
        config.snapToEdges &&
        isNear(movingBounds.left, otherBounds.right)
      ) {
        snappedX = otherBounds.right + movingBounds.width / 2;
        snappedToX = true;
        guides.push({
          type: "vertical",
          position: otherBounds.right,
          alignedItems: [movingItem.id, other.id],
        });
      }
      // Right to left
      else if (
        config.snapToEdges &&
        isNear(movingBounds.right, otherBounds.left)
      ) {
        snappedX = otherBounds.left - movingBounds.width / 2;
        snappedToX = true;
        guides.push({
          type: "vertical",
          position: otherBounds.left,
          alignedItems: [movingItem.id, other.id],
        });
      }
    }

    // Horizontal guides (Y alignment)
    if (!snappedToY) {
      // Center to center
      if (
        config.snapToCenters &&
        isNear(movingBounds.centerY, otherBounds.centerY)
      ) {
        snappedY = otherBounds.centerY;
        snappedToY = true;
        guides.push({
          type: "horizontal",
          position: otherBounds.centerY,
          alignedItems: [movingItem.id, other.id],
        });
      }
      // Top to top
      else if (
        config.snapToEdges &&
        isNear(movingBounds.top, otherBounds.top)
      ) {
        snappedY = otherBounds.top + movingBounds.height / 2;
        snappedToY = true;
        guides.push({
          type: "horizontal",
          position: otherBounds.top,
          alignedItems: [movingItem.id, other.id],
        });
      }
      // Bottom to bottom
      else if (
        config.snapToEdges &&
        isNear(movingBounds.bottom, otherBounds.bottom)
      ) {
        snappedY = otherBounds.bottom - movingBounds.height / 2;
        snappedToY = true;
        guides.push({
          type: "horizontal",
          position: otherBounds.bottom,
          alignedItems: [movingItem.id, other.id],
        });
      }
      // Top to bottom
      else if (
        config.snapToEdges &&
        isNear(movingBounds.top, otherBounds.bottom)
      ) {
        snappedY = otherBounds.bottom + movingBounds.height / 2;
        snappedToY = true;
        guides.push({
          type: "horizontal",
          position: otherBounds.bottom,
          alignedItems: [movingItem.id, other.id],
        });
      }
      // Bottom to top
      else if (
        config.snapToEdges &&
        isNear(movingBounds.bottom, otherBounds.top)
      ) {
        snappedY = otherBounds.top - movingBounds.height / 2;
        snappedToY = true;
        guides.push({
          type: "horizontal",
          position: otherBounds.top,
          alignedItems: [movingItem.id, other.id],
        });
      }
    }
  });

  // Add distance measurements if enabled
  if (config.showDistanceMeasurements) {
    const distanceGuides = createDistanceGuides(
      movingItem,
      snappedX,
      snappedY,
      otherItems,
      config,
    );
    guides.push(...distanceGuides);
  }

  // Add smart spacing detection if enabled
  if (config.snapToSpacing) {
    const spacingGuides = detectSmartSpacing(
      [...otherItems, movingItem],
      config,
    );
    guides.push(...spacingGuides);
  }

  return {
    x: snappedX,
    y: snappedY,
    guides,
    snapped: snappedToX || snappedToY,
  };
};

/**
 * Calculate spacing guides (equal spacing between 3+ items)
 */
export const calculateSpacingGuides = (items: KubitoItem[]): Guide[] => {
  if (items.length < 3) return [];

  const guides: Guide[] = [];
  const sortedByX = [...items].sort((a, b) => a.x - b.x);
  const sortedByY = [...items].sort((a, b) => a.y - b.y);

  // Check horizontal spacing
  if (sortedByX.length >= 3) {
    const gaps: number[] = [];
    for (let i = 0; i < sortedByX.length - 1; i++) {
      const current = sortedByX[i];
      const next = sortedByX[i + 1];
      if (current && next) {
        gaps.push(next.x - current.x);
      }
    }

    // If all gaps are similar, show spacing guides
    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const maxDiff = Math.max(...gaps.map((g) => Math.abs(g - avgGap)));

    if (maxDiff < SNAP_THRESHOLD * 2) {
      // Add guides between items
      for (let i = 0; i < sortedByX.length - 1; i++) {
        const current = sortedByX[i];
        const next = sortedByX[i + 1];
        if (current && next) {
          const midPoint = (current.x + next.x) / 2;
          guides.push({
            type: "vertical",
            position: midPoint,
            alignedItems: [current.id, next.id],
          });
        }
      }
    }
  }

  // Check vertical spacing
  if (sortedByY.length >= 3) {
    const gaps: number[] = [];
    for (let i = 0; i < sortedByY.length - 1; i++) {
      const current = sortedByY[i];
      const next = sortedByY[i + 1];
      if (current && next) {
        gaps.push(next.y - current.y);
      }
    }

    const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const maxDiff = Math.max(...gaps.map((g) => Math.abs(g - avgGap)));

    if (maxDiff < SNAP_THRESHOLD * 2) {
      for (let i = 0; i < sortedByY.length - 1; i++) {
        const current = sortedByY[i];
        const next = sortedByY[i + 1];
        if (current && next) {
          const midPoint = (current.y + next.y) / 2;
          guides.push({
            type: "horizontal",
            position: midPoint,
            alignedItems: [current.id, next.id],
          });
        }
      }
    }
  }

  return guides;
};

/**
 * Snap rotation angle to magnetic angles
 */
export const snapToMagneticAngle = (
  angle: number,
  config: SnapConfig = DEFAULT_SNAP_CONFIG,
): { angle: number; snapped: boolean; guide?: Guide } => {
  if (!config.snapToAngles) {
    return { angle, snapped: false };
  }

  // Normalize angle to 0-360
  const normalized = ((angle % 360) + 360) % 360;

  for (const magneticAngle of config.magneticAngles) {
    const diff = Math.abs(normalized - magneticAngle);
    const diffAlt = Math.abs(normalized - (magneticAngle + 360));

    if (
      diff <= config.angleSnapThreshold ||
      diffAlt <= config.angleSnapThreshold
    ) {
      return {
        angle: magneticAngle,
        snapped: true,
        guide: {
          type: "angle",
          position: magneticAngle,
          alignedItems: [],
          metadata: {
            angle: magneticAngle,
            label: `${magneticAngle}°`,
          },
        },
      };
    }
  }

  return { angle: normalized, snapped: false };
};

/**
 * Calculate distance between two items
 */
export const calculateDistance = (
  item1: KubitoItem,
  item2: KubitoItem,
): {
  horizontal: number;
  vertical: number;
  diagonal: number;
} => {
  const bounds1 = getItemBounds(item1);
  const bounds2 = getItemBounds(item2);

  // Calculate edge-to-edge distances
  let horizontal = 0;
  let vertical = 0;

  // Horizontal distance
  if (bounds1.right < bounds2.left) {
    horizontal = bounds2.left - bounds1.right;
  } else if (bounds2.right < bounds1.left) {
    horizontal = bounds1.left - bounds2.right;
  }

  // Vertical distance
  if (bounds1.bottom < bounds2.top) {
    vertical = bounds2.top - bounds1.bottom;
  } else if (bounds2.bottom < bounds1.top) {
    vertical = bounds1.top - bounds2.bottom;
  }

  // Center-to-center diagonal distance
  const dx = bounds2.centerX - bounds1.centerX;
  const dy = bounds2.centerY - bounds1.centerY;
  const diagonal = Math.sqrt(dx * dx + dy * dy);

  return { horizontal, vertical, diagonal };
};

/**
 * Create distance guides between moving item and nearby items
 */
export const createDistanceGuides = (
  movingItem: KubitoItem,
  newX: number,
  newY: number,
  otherItems: KubitoItem[],
  config: SnapConfig = DEFAULT_SNAP_CONFIG,
): Guide[] => {
  if (!config.showDistanceMeasurements) {
    return [];
  }

  const guides: Guide[] = [];
  const movingBounds = {
    ...getItemBounds(movingItem),
    centerX: newX,
    centerY: newY,
    left: newX - getItemBounds(movingItem).width / 2,
    right: newX + getItemBounds(movingItem).width / 2,
    top: newY - getItemBounds(movingItem).height / 2,
    bottom: newY + getItemBounds(movingItem).height / 2,
  };

  const tempMovingItem = { ...movingItem, x: newX, y: newY };

  otherItems.forEach((other) => {
    if (other.id === movingItem.id || !other.visible) return;

    const otherBounds = getItemBounds(other);
    const distances = calculateDistance(tempMovingItem, other);

    // Show horizontal distance if items are side by side
    if (distances.horizontal > 0 && distances.horizontal < 200) {
      const yPos = (movingBounds.centerY + otherBounds.centerY) / 2;
      const xStart = Math.min(movingBounds.right, otherBounds.right);
      const xEnd = Math.max(movingBounds.left, otherBounds.left);

      guides.push({
        type: "distance",
        position: yPos,
        alignedItems: [movingItem.id, other.id],
        metadata: {
          distance: Math.round(distances.horizontal),
          label: `${Math.round(distances.horizontal)}px`,
          startPoint: { x: xStart, y: yPos },
          endPoint: { x: xEnd, y: yPos },
        },
      });
    }

    // Show vertical distance if items are stacked
    if (distances.vertical > 0 && distances.vertical < 200) {
      const xPos = (movingBounds.centerX + otherBounds.centerX) / 2;
      const yStart = Math.min(movingBounds.bottom, otherBounds.bottom);
      const yEnd = Math.max(movingBounds.top, otherBounds.top);

      guides.push({
        type: "distance",
        position: xPos,
        alignedItems: [movingItem.id, other.id],
        metadata: {
          distance: Math.round(distances.vertical),
          label: `${Math.round(distances.vertical)}px`,
          startPoint: { x: xPos, y: yStart },
          endPoint: { x: xPos, y: yEnd },
        },
      });
    }
  });

  return guides;
};

/**
 * Detect and suggest consistent spacing between items
 */
export const detectSmartSpacing = (
  items: KubitoItem[],
  config: SnapConfig = DEFAULT_SNAP_CONFIG,
): Guide[] => {
  if (!config.snapToSpacing || items.length < 2) {
    return [];
  }

  const guides: Guide[] = [];
  const visibleItems = items.filter((item) => item.visible);

  // Group items by approximate horizontal alignment
  const horizontalGroups = new Map<number, KubitoItem[]>();
  visibleItems.forEach((item) => {
    const yKey = Math.round(item.y / 50) * 50; // Group by 50px bands
    if (!horizontalGroups.has(yKey)) {
      horizontalGroups.set(yKey, []);
    }
    const group = horizontalGroups.get(yKey);
    if (group) {
      group.push(item);
    }
  });

  // Check each group for consistent spacing
  horizontalGroups.forEach((group) => {
    if (group.length < 2) return;

    const sorted = [...group].sort((a, b) => a.x - b.x);
    const spacings: number[] = [];

    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];
      if (current && next) {
        const currentBounds = getItemBounds(current);
        const nextBounds = getItemBounds(next);
        const spacing = nextBounds.left - currentBounds.right;
        spacings.push(spacing);
      }
    }

    // Check if spacings are consistent
    if (spacings.length > 0) {
      const avgSpacing = spacings.reduce((a, b) => a + b, 0) / spacings.length;
      const maxDiff = Math.max(
        ...spacings.map((s) => Math.abs(s - avgSpacing)),
      );

      if (maxDiff < config.snapThreshold * 2 && avgSpacing > 5) {
        // Add spacing guides
        for (let i = 0; i < sorted.length - 1; i++) {
          const current = sorted[i];
          const next = sorted[i + 1];
          if (current && next) {
            const currentBounds = getItemBounds(current);
            const nextBounds = getItemBounds(next);
            const midX = (currentBounds.right + nextBounds.left) / 2;

            guides.push({
              type: "spacing",
              position: midX,
              alignedItems: [current.id, next.id],
              metadata: {
                spacing: Math.round(avgSpacing),
                label: `${Math.round(avgSpacing)}px`,
                startPoint: { x: currentBounds.right, y: current.y },
                endPoint: { x: nextBounds.left, y: next.y },
              },
            });
          }
        }
      }
    }
  });

  return guides;
};

/**
 * Distribute items evenly with guides
 */
export const distributeItems = (
  items: KubitoItem[],
  direction: "horizontal" | "vertical",
): {
  updatedItems: KubitoItem[];
  guides: Guide[];
} => {
  if (items.length < 3) {
    return { updatedItems: items, guides: [] };
  }

  const guides: Guide[] = [];
  const sorted =
    direction === "horizontal"
      ? [...items].sort((a, b) => a.x - b.x)
      : [...items].sort((a, b) => a.y - b.y);

  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (!first || !last) {
    return { updatedItems: items, guides: [] };
  }

  const firstBounds = getItemBounds(first);
  const lastBounds = getItemBounds(last);

  if (direction === "horizontal") {
    const totalSpace = lastBounds.left - firstBounds.right;
    const totalItemsWidth = sorted
      .slice(1, -1)
      .reduce((sum, item) => sum + getItemBounds(item).width, 0);
    const spacing = (totalSpace - totalItemsWidth) / (sorted.length - 1);

    let currentX = firstBounds.right + spacing;
    const updatedItems = sorted.map((item, index) => {
      if (index === 0 || index === sorted.length - 1) {
        return item;
      }

      const bounds = getItemBounds(item);
      const newX = currentX + bounds.width / 2;
      currentX += bounds.width + spacing;

      guides.push({
        type: "spacing",
        position: newX,
        alignedItems: [item.id],
        metadata: {
          spacing: Math.round(spacing),
          label: `${Math.round(spacing)}px`,
        },
      });

      return { ...item, x: newX };
    });

    return { updatedItems, guides };
  } else {
    const totalSpace = lastBounds.top - firstBounds.bottom;
    const totalItemsHeight = sorted
      .slice(1, -1)
      .reduce((sum, item) => sum + getItemBounds(item).height, 0);
    const spacing = (totalSpace - totalItemsHeight) / (sorted.length - 1);

    let currentY = firstBounds.bottom + spacing;
    const updatedItems = sorted.map((item, index) => {
      if (index === 0 || index === sorted.length - 1) {
        return item;
      }

      const bounds = getItemBounds(item);
      const newY = currentY + bounds.height / 2;
      currentY += bounds.height + spacing;

      guides.push({
        type: "spacing",
        position: newY,
        alignedItems: [item.id],
        metadata: {
          spacing: Math.round(spacing),
          label: `${Math.round(spacing)}px`,
        },
      });

      return { ...item, y: newY };
    });

    return { updatedItems, guides };
  }
};
