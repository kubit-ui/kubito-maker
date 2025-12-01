import { useState, useCallback } from "react";
import type { KubitoItem } from "@/types";
import { calculateSmartGuides as calculateSmartGuidesUtil } from "@/utils/smartGuides";

/**
 * Smart guide definition
 */
export interface SmartGuide {
  type: string;
  position: number;
}

/**
 * Custom hook to manage smart guides for canvas items
 *
 * Provides:
 * - Active guides state
 * - Calculate and update guides based on item movement
 * - Clear guides
 *
 * @returns Object with guides state and control functions
 *
 * @example
 * ```tsx
 * const { activeGuides, calculateGuides, clearGuides } = useSmartGuides();
 *
 * // When moving an item
 * const result = calculateGuides(item, newX, newY, otherItems);
 * updateItem(item.id, { x: result.x, y: result.y });
 * ```
 */
export const useSmartGuides = () => {
  const [activeGuides, setActiveGuides] = useState<SmartGuide[]>([]);

  /**
   * Calculate smart guides and snapped position for an item
   */
  const calculateGuides = useCallback(
    (
      item: KubitoItem,
      newX: number,
      newY: number,
      otherItems: KubitoItem[],
    ) => {
      const result = calculateSmartGuidesUtil(item, newX, newY, otherItems);
      setActiveGuides(result.guides);
      return result;
    },
    [],
  );

  /**
   * Clear all active guides
   */
  const clearGuides = useCallback(() => {
    setActiveGuides([]);
  }, []);

  /**
   * Set guides manually (for external control)
   */
  const setGuides = useCallback((guides: SmartGuide[]) => {
    setActiveGuides(guides);
  }, []);

  return {
    activeGuides,
    calculateGuides,
    clearGuides,
    setGuides,
  };
};
