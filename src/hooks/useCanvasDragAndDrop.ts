import { useCallback, RefObject } from "react";
import type { AssetCategory } from "@/types";

/**
 * Hook configuration for canvas drag and drop
 */
export interface UseCanvasDragAndDropConfig {
  svgRef: RefObject<SVGSVGElement | null>;
  onItemAdd: (item: {
    category: AssetCategory;
    assetId: string;
    name: string;
    x: number;
    y: number;
    scale: number;
    rotate: number;
    flipX: boolean;
    flipY: boolean;
  }) => void;
}

/**
 * Custom hook to handle drag and drop functionality for the canvas
 *
 * Provides:
 * - SVG coordinate conversion (screen to SVG space)
 * - Drag over handling
 * - Drop handling with asset creation
 *
 * @param config - Configuration object
 * @returns Object with drag and drop handlers and utilities
 *
 * @example
 * ```tsx
 * const { toSvgPoint, onCanvasDragOver, onCanvasDrop } = useCanvasDragAndDrop({
 *   svgRef,
 *   onItemAdd: (item) => addItem(item),
 * });
 * ```
 */
export const useCanvasDragAndDrop = (config: UseCanvasDragAndDropConfig) => {
  const { svgRef, onItemAdd } = config;

  /**
   * Convert screen coordinates to SVG coordinates
   */
  const toSvgPoint = useCallback(
    (evt: PointerEvent | MouseEvent): { x: number; y: number } => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };

      const pt = svg.createSVGPoint();
      pt.x = evt.clientX;
      pt.y = evt.clientY;
      const transformed = pt.matrixTransform(svg.getScreenCTM()?.inverse());
      return { x: transformed.x, y: transformed.y };
    },
    [svgRef],
  );

  /**
   * Handle drag over canvas
   */
  const onCanvasDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  /**
   * Handle drop on canvas
   */
  const onCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;

      try {
        const parsed = JSON.parse(data) as {
          category: AssetCategory;
          assetId: string;
          name?: string;
        };
        const { category, assetId, name } = parsed;
        const pt = toSvgPoint(e.nativeEvent);

        onItemAdd({
          category,
          assetId,
          name: name || assetId,
          x: pt.x,
          y: pt.y,
          scale: 1,
          rotate: 0,
          flipX: false,
          flipY: false,
        });
      } catch (err) {
        console.error("Drop error:", err);
      }
    },
    [toSvgPoint, onItemAdd],
  );

  return {
    toSvgPoint,
    onCanvasDragOver,
    onCanvasDrop,
  };
};
