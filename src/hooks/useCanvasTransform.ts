import { useEffect, useRef, RefObject, useState } from 'react';
import type { KubitoItem, TransformMode } from '@/types';
import { calculateSmartGuides } from '@/utils/smartGuides';
import type { Guide } from '@/utils/smartGuides';
import { useSnapConfig } from '@/store/editorStore';

/**
 * Transform handle state
 */
export interface TransformHandle {
  type?: string;
  id?: string;
  start?: { x: number; y: number };
  startState?: KubitoItem;
  startDist?: number;
  startAngle?: number;
  center?: { x: number; y: number };
}

/**
 * Hook configuration for canvas transformations
 */
export interface UseCanvasTransformConfig {
  svgRef: RefObject<SVGSVGElement | null>;
  items: KubitoItem[];
  selectedId: string | null;
  selectedIds: string[];
  toSvgPoint: (evt: PointerEvent | MouseEvent) => { x: number; y: number };
  onSetSelectedId: (id: string | null) => void;
  onToggleSelection: (id: string) => void;
  onDeselectAll: () => void;
  onUpdateItem: (id: string, updates: Partial<KubitoItem>) => void;
  onSetMode: (mode: TransformMode) => void;
  onSetActiveGuides: (guides: Guide[]) => void;
  brushMode?: string; // Añadido para desactivar transformaciones cuando se está dibujando
}

/**
 * Custom hook to handle canvas transformations (move, scale, rotate)
 *
 * Provides:
 * - Item selection (single and multi-select with Shift)
 * - Move with smart guides and snapping
 * - Scale with handles
 * - Rotate with handles
 * - Zoom with mouse wheel
 *
 * @param config - Configuration object
 *
 * @example
 * ```tsx
 * useCanvasTransform({
 *   svgRef,
 *   items,
 *   selectedId,
 *   selectedIds,
 *   toSvgPoint,
 *   onSetSelectedId: setSelectedId,
 *   onUpdateItem: updateItem,
 *   // ... other callbacks
 * });
 * ```
 */
export const useCanvasTransform = (config: UseCanvasTransformConfig) => {
  const {
    svgRef,
    items,
    selectedId,
    selectedIds,
    toSvgPoint,
    onSetSelectedId,
    onToggleSelection,
    onDeselectAll,
    onUpdateItem,
    onSetMode,
    onSetActiveGuides,
    brushMode = 'none',
  } = config;

  const snapConfig = useSnapConfig();

  const handleRef = useRef<TransformHandle>({});

  // Marquee selection state
  const [marqueeStart, setMarqueeStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [marqueeEnd, setMarqueeEnd] = useState<{ x: number; y: number } | null>(
    null
  );

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Si está en modo pincel, NO registrar listeners de transformación
    if (brushMode !== 'none') {
      return;
    }

    svg.style.touchAction = 'none';

    const onPointerDown = (e: PointerEvent) => {
      let node: EventTarget | null = e.target;
      let handle: Element | null = null;

      // Find handle element
      while (node && node !== svg) {
        if (
          (node as Element).getAttribute &&
          (node as Element).getAttribute('data-handle')
        ) {
          handle = node as Element;
          break;
        }
        node = (node as Element).parentNode;
      }

      // Find item element
      node = e.target;
      let itemEl: Element | null = null;
      while (node && node !== svg) {
        if (
          (node as Element).getAttribute &&
          (node as Element).getAttribute('data-item-id')
        ) {
          itemEl = node as Element;
          break;
        }
        node = (node as Element).parentNode;
      }

      // Handle interaction with transform handles
      if (handle) {
        const id = handle.getAttribute('data-item-id');
        const htype = handle.getAttribute('data-handle');
        if (!htype || !id) return;

        const item = items.find((it) => it.id === id);
        if (!item || item.locked) return;

        const startPt = toSvgPoint(e);

        // Calculate center for multiple selection or single item
        let cx: number, cy: number;
        if (selectedIds.length > 1 && selectedIds.includes(id)) {
          // For multiple selection, calculate center of all selected items
          const selectedItems = items.filter((it) =>
            selectedIds.includes(it.id)
          );
          const sumX = selectedItems.reduce((sum, it) => sum + it.x, 0);
          const sumY = selectedItems.reduce((sum, it) => sum + it.y, 0);
          cx = sumX / selectedItems.length;
          cy = sumY / selectedItems.length;
          // Don't change selection when using multi-select handle
        } else {
          // Single item - use its center
          onSetSelectedId(id);
          cx = item.x;
          cy = item.y;
        }

        const startDist = Math.hypot(startPt.x - cx, startPt.y - cy) || 1;
        const startAngle = Math.atan2(startPt.y - cy, startPt.x - cx);

        handleRef.current = {
          type: htype,
          id,
          start: startPt,
          startState: { ...item },
          startDist,
          startAngle,
          center: { x: cx, y: cy },
        };

        onSetMode(htype === 'rotate' ? 'rotate' : 'scale');
        e.preventDefault();
        e.stopPropagation();

        try {
          (e.target as Element).setPointerCapture?.(e.pointerId);
        } catch {
          // Ignore
        }
        return;
      }

      // Handle interaction with item (move)
      if (itemEl) {
        const id = itemEl.getAttribute('data-item-id');
        if (!id) return;

        const item = items.find((it) => it.id === id);
        if (!item || item.locked) return;

        // Shift+Click: Toggle selection
        if (e.shiftKey) {
          onToggleSelection(id);
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        // If clicking on already selected item, just keep it selected
        // Only prepare for move, don't set mode yet
        if (selectedId === id || selectedIds.includes(id)) {
          const startPt = toSvgPoint(e);
          handleRef.current = {
            type: 'pending-move',
            id,
            start: startPt,
            startState: { ...item },
          };
        } else {
          // New selection
          onSetSelectedId(id);
          const startPt = toSvgPoint(e);
          handleRef.current = {
            type: 'pending-move',
            id,
            start: startPt,
            startState: { ...item },
          };
        }

        e.preventDefault();
        e.stopPropagation();

        try {
          (e.target as Element).setPointerCapture?.(e.pointerId);
        } catch {
          // Ignore
        }
        return;
      }

      // Click on empty area - start marquee selection
      const pt = toSvgPoint(e);
      setMarqueeStart({ x: pt.x, y: pt.y });
      setMarqueeEnd({ x: pt.x, y: pt.y });

      e.preventDefault();
      try {
        (e.target as Element).setPointerCapture?.(e.pointerId);
      } catch {
        // Ignore
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      // Handle marquee selection
      if (marqueeStart) {
        const pt = toSvgPoint(e);
        setMarqueeEnd({ x: pt.x, y: pt.y });
        return;
      }

      const active = handleRef.current;
      if (!active.type || !active.id) return;

      const pt = toSvgPoint(e);
      const id = active.id;

      // Convert pending-move to move when actually moved
      if (active.type === 'pending-move' && active.start) {
        const dx = pt.x - active.start.x;
        const dy = pt.y - active.start.y;
        const dist = Math.hypot(dx, dy);

        // Only activate move mode if moved more than 3 pixels
        if (dist > 3) {
          handleRef.current.type = 'move';
          onSetMode('move');
        } else {
          return; // Don't move yet
        }
      }

      if (active.type === 'move' && active.start && active.startState) {
        const dx = pt.x - active.start.x;
        const dy = pt.y - active.start.y;
        const newX = active.startState.x + dx;
        const newY = active.startState.y + dy;

        // Move multiple selected items together
        if (selectedIds.length > 1 && selectedIds.includes(id)) {
          // Move all selected items by the same delta
          selectedIds.forEach((itemId) => {
            const itemToMove = items.find((it) => it.id === itemId);
            if (itemToMove && !itemToMove.locked) {
              onUpdateItem(itemId, {
                x: itemToMove.x + dx,
                y: itemToMove.y + dy,
              });
            }
          });

          // Reset start position for next move
          handleRef.current.start = pt;
        } else {
          // Single item move with smart guides
          const item = items.find((it) => it.id === id);
          if (item) {
            const otherItems = items.filter((it) => it.id !== id);
            const snapResult = calculateSmartGuides(
              item,
              newX,
              newY,
              otherItems,
              snapConfig
            );

            // Update guides
            onSetActiveGuides(snapResult.guides);

            // Update item position (snapped or original)
            onUpdateItem(id, {
              x: snapResult.x,
              y: snapResult.y,
            });
          } else {
            // Fallback without snapping
            onUpdateItem(id, { x: newX, y: newY });
          }
        }
      } else if (
        active.type === 'scale' &&
        active.center &&
        active.startState &&
        active.startDist
      ) {
        const cx = active.center.x;
        const cy = active.center.y;
        const newDist = Math.hypot(pt.x - cx, pt.y - cy) || 0.0001;
        const ratio = newDist / active.startDist;

        // Scale multiple selected items together from group center
        if (selectedIds.length > 1 && selectedIds.includes(id)) {
          selectedIds.forEach((itemId) => {
            const itemToScale = items.find((it) => it.id === itemId);
            if (itemToScale && !itemToScale.locked) {
              // Calculate new scale
              const newScale = Math.max(0.1, itemToScale.scale * ratio);

              // Calculate new position relative to center
              const dx = itemToScale.x - cx;
              const dy = itemToScale.y - cy;
              const newX = cx + dx * ratio;
              const newY = cy + dy * ratio;

              onUpdateItem(itemId, {
                scale: newScale,
                x: newX,
                y: newY,
              });
            }
          });
          // Reset distance for incremental scaling
          handleRef.current.startDist = newDist;
        } else {
          // Single item scale
          onUpdateItem(id, {
            scale: Math.max(0.1, active.startState.scale * ratio),
          });
        }
      } else if (
        active.type === 'rotate' &&
        active.center &&
        active.startAngle !== undefined &&
        active.startState
      ) {
        const cx = active.center.x;
        const cy = active.center.y;
        const angleNow = Math.atan2(pt.y - cy, pt.x - cx);
        const delta = angleNow - active.startAngle;
        const deg = (delta * 180) / Math.PI;

        // Rotate multiple selected items together around group center
        if (selectedIds.length > 1 && selectedIds.includes(id)) {
          selectedIds.forEach((itemId) => {
            const itemToRotate = items.find((it) => it.id === itemId);
            if (itemToRotate && !itemToRotate.locked) {
              // Update rotation
              const newRotate = itemToRotate.rotate + deg;

              // Rotate position around center
              const dx = itemToRotate.x - cx;
              const dy = itemToRotate.y - cy;
              const distance = Math.hypot(dx, dy);
              const currentAngle = Math.atan2(dy, dx);
              const newAngle = currentAngle + delta;
              const newX = cx + distance * Math.cos(newAngle);
              const newY = cy + distance * Math.sin(newAngle);

              onUpdateItem(itemId, {
                rotate: newRotate,
                x: newX,
                y: newY,
              });
            }
          });
          // Reset start angle for next rotation
          handleRef.current.startAngle = angleNow;
        } else {
          // Single item rotate
          onUpdateItem(id, { rotate: active.startState.rotate + deg });
        }
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      // Handle marquee selection completion
      if (marqueeStart && marqueeEnd) {
        const x1 = Math.min(marqueeStart.x, marqueeEnd.x);
        const y1 = Math.min(marqueeStart.y, marqueeEnd.y);
        const x2 = Math.max(marqueeStart.x, marqueeEnd.x);
        const y2 = Math.max(marqueeStart.y, marqueeEnd.y);

        // Find all items within marquee rectangle
        const selectedItems = items.filter((item) => {
          // Check if item's center is within marquee
          return item.x >= x1 && item.x <= x2 && item.y >= y1 && item.y <= y2;
        });

        // Select the items found
        if (selectedItems.length > 0) {
          onDeselectAll();
          selectedItems.forEach((item) => {
            onToggleSelection(item.id);
          });
        } else {
          // No items selected - deselect all
          onDeselectAll();
        }

        // Clear marquee
        setMarqueeStart(null);
        setMarqueeEnd(null);

        try {
          (e.target as Element).releasePointerCapture?.(e.pointerId);
        } catch {
          // Ignore
        }
        return;
      }

      if (handleRef.current.type) {
        handleRef.current = {};
        onSetMode('none');
        onSetActiveGuides([]); // Clear guides when done

        try {
          (e.target as Element).releasePointerCapture?.(e.pointerId);
        } catch {
          // Ignore pointer capture errors
        }
      }
    };

    const onPointerCancel = (e: PointerEvent) => {
      if (handleRef.current.type) {
        handleRef.current = {};
        onSetMode('none');
        onSetActiveGuides([]); // Clear guides when cancelled

        try {
          (e.target as Element).releasePointerCapture?.(e.pointerId);
        } catch {
          // Ignore pointer capture errors
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      // Zoom with scroll wheel when an item is selected
      if (!selectedId) return;

      const item = items.find((it) => it.id === selectedId);
      if (!item || item.locked) return;

      e.preventDefault();

      // Determine zoom direction and amount
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      const newScale = Math.max(0.1, Math.min(10, item.scale + delta));

      onUpdateItem(selectedId, { scale: newScale });
    };

    svg.addEventListener('pointerdown', onPointerDown);
    svg.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);

    return () => {
      svg.removeEventListener('pointerdown', onPointerDown);
      svg.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
    };
  }, [
    items,
    selectedId,
    selectedIds,
    toSvgPoint,
    onSetSelectedId,
    onToggleSelection,
    onDeselectAll,
    onUpdateItem,
    onSetMode,
    onSetActiveGuides,
    svgRef,
    marqueeStart,
    marqueeEnd,
    snapConfig,
    brushMode,
  ]);

  return {
    handleRef,
    marquee:
      marqueeStart && marqueeEnd
        ? { start: marqueeStart, end: marqueeEnd }
        : null,
  };
};

/**
 * Custom hook to calculate canvas scale to fit in container
 *
 * @param containerRef - Ref to the container element
 * @param canvasWidth - Width of the canvas
 * @param canvasHeight - Height of the canvas
 * @param zoomFactor - Additional zoom multiplier (default 1)
 * @returns Current scale value
 */
export const useCanvasScale = (
  containerRef: RefObject<HTMLDivElement | null>,
  canvasWidth: number,
  canvasHeight: number,
  zoomFactor: number = 1
) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const padding = 32; // 16px padding on each side
      const availableWidth = container.clientWidth - padding;
      const availableHeight = container.clientHeight - padding;

      const scaleX = availableWidth / canvasWidth;
      const scaleY = availableHeight / canvasHeight;
      const baseScale = Math.min(scaleX, scaleY, 1); // Never scale up, only down

      // Apply zoom factor
      const newScale = baseScale * zoomFactor;

      setScale(newScale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [canvasWidth, canvasHeight, containerRef, zoomFactor]);

  return scale;
};
