import { useRef, memo, useState, useEffect, useCallback } from 'react';
import { useDroppable, useDndMonitor } from '@dnd-kit/core';
import {
  Copy,
  FileText,
  CopyPlus,
  ChevronsUp,
  ChevronUp,
  ChevronDown,
  ChevronsDown,
  Trash2,
} from 'lucide-react';
import type { Asset, AssetCategory } from '@/types';
import {
  useItems,
  useSelection,
  useConfig,
  useCanvasSize,
  useGuides,
  useEditorActions,
  useCanvasZoom,
} from '@/store/editorStore';
import {
  useCanvasDragAndDrop,
  useCanvasTransform,
  useCanvasScale,
} from '@/hooks';
import {
  CanvasGrid,
  CanvasItem,
  CanvasGuides,
  CanvasMultiSelection,
  CanvasMarquee,
  ZoomControls,
} from '.';
import { ContextMenu, type ContextMenuItem } from '../ContextMenu';

interface CanvasProps {
  className?: string;
}

export const Canvas = memo<CanvasProps>(({ className }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    itemId: string | null;
  } | null>(null);

  // Store state - Using new specific hooks
  const items = useItems();
  const { selectedId, selectedIds } = useSelection();
  const config = useConfig();
  const { width: canvasWidth, height: canvasHeight } = useCanvasSize();
  const { activeGuides } = useGuides();
  const canvasZoom = useCanvasZoom();

  // Store actions - Using new actions hook
  const {
    setSelectedId,
    toggleSelection,
    deselectAll,
    updateItem,
    setMode,
    addItem,
    setActiveGuides,
    removeItem,
    duplicateItem,
    copyItem,
    pasteItem,
    moveItemToTop,
    moveItemToBottom,
    moveItemUp,
    moveItemDown,
  } = useEditorActions();

  // Custom hooks
  const { toSvgPoint, onCanvasDragOver, onCanvasDrop } = useCanvasDragAndDrop({
    svgRef,
    onItemAdd: addItem,
  });

  // @dnd-kit droppable zone
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: 'canvas-droppable',
  });

  // Combine refs for container
  const setContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      setDroppableRef(node);
    },
    [setDroppableRef]
  );

  // Global mouse tracking for precise positioning
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        lastMousePosition.current = {
          x: e.clientX,
          y: e.clientY,
        };
      }
    };

    document.addEventListener('mousemove', handleGlobalMouseMove, true);
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove, true);
    };
  }, []);

  // Monitor @dnd-kit drops on this canvas
  useDndMonitor({
    onDragStart() {
      isDraggingRef.current = true;
    },
    onDragMove(event) {
      // Update mouse position during drag for more accuracy
      const { activatorEvent, delta } = event;

      if (
        activatorEvent &&
        'clientX' in activatorEvent &&
        'clientY' in activatorEvent
      ) {
        const clientX = activatorEvent.clientX as number;
        const clientY = activatorEvent.clientY as number;
        lastMousePosition.current = {
          x: clientX + (delta?.x || 0),
          y: clientY + (delta?.y || 0),
        };
      }
    },
    onDragEnd(event) {
      isDraggingRef.current = false;
      const { active, over } = event;

      // Only handle drops on this canvas
      if (over?.id !== 'canvas-droppable') {
        return;
      }

      // Get the drag data (asset info)
      const data = active.data.current as
        | {
            asset: Asset;
            category: AssetCategory;
          }
        | undefined;

      if (!data) {
        return;
      }

      // Get SVG reference
      const svg = svgRef.current;
      if (!svg) {
        return;
      }

      // Use the last tracked mouse position (most accurate)
      const cursorX = lastMousePosition.current.x;
      const cursorY = lastMousePosition.current.y;

      // Convert screen coordinates to SVG coordinates
      const mockEvent = {
        clientX: cursorX,
        clientY: cursorY,
      } as MouseEvent;
      const svgCoords = toSvgPoint(mockEvent);

      // Add the item to canvas at the exact drop position
      addItem({
        category: data.category,
        assetId: data.asset.id,
        name: data.asset.name,
        x: svgCoords.x,
        y: svgCoords.y,
        scale: 1,
        rotate: 0,
        flipX: false,
        flipY: false,
      });
    },
  });

  const { marquee } = useCanvasTransform({
    svgRef,
    items,
    selectedId,
    selectedIds,
    toSvgPoint,
    onSetSelectedId: setSelectedId,
    onToggleSelection: toggleSelection,
    onDeselectAll: deselectAll,
    onUpdateItem: updateItem,
    onSetMode: setMode,
    onSetActiveGuides: setActiveGuides,
  });

  const scale = useCanvasScale(
    containerRef,
    canvasWidth,
    canvasHeight,
    canvasZoom
  );

  // Close context menu on any click outside the menu itself
  useEffect(() => {
    if (!contextMenu) return;

    const handleGlobalClick = (e: MouseEvent) => {
      // Check if the click was on the context menu itself
      const target = e.target as HTMLElement;
      const contextMenuElement = document.querySelector('[data-context-menu]');

      // If clicking inside the context menu, don't close it
      if (contextMenuElement && contextMenuElement.contains(target)) {
        return;
      }

      // Otherwise, close the menu
      setContextMenu(null);
    };

    // Use capture phase to intercept before stopPropagation
    // Small delay to avoid closing immediately on the same click that opened it
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleGlobalClick, true);
      document.addEventListener('click', handleGlobalClick, true);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleGlobalClick, true);
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [contextMenu]);

  // Handle context menu
  const handleContextMenu = (e: React.MouseEvent, itemId: string | null) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      itemId,
    });
  };

  // Build context menu items based on selection
  const contextMenuItems: ContextMenuItem[] = contextMenu?.itemId
    ? [
        {
          id: 'copy',
          label: 'Copy',
          icon: <Copy className="h-4 w-4" />,
          shortcut: 'Cmd+C',
          onClick: () => copyItem(contextMenu.itemId!),
        },
        {
          id: 'paste',
          label: 'Paste',
          icon: <FileText className="h-4 w-4" />,
          shortcut: 'Cmd+V',
          onClick: () => pasteItem(),
        },
        {
          id: 'duplicate',
          label: 'Duplicate',
          icon: <CopyPlus className="h-4 w-4" />,
          shortcut: 'Cmd+D',
          onClick: () => duplicateItem(contextMenu.itemId!),
        },
        { id: 'separator-1', label: '', separator: true },
        {
          id: 'bring-to-front',
          label: 'Bring to Front',
          icon: <ChevronsUp className="h-4 w-4" />,
          shortcut: 'Cmd+Shift+↑',
          onClick: () => moveItemToTop(contextMenu.itemId!),
        },
        {
          id: 'bring-forward',
          label: 'Bring Forward',
          icon: <ChevronUp className="h-4 w-4" />,
          shortcut: 'Cmd+↑',
          onClick: () => moveItemUp(contextMenu.itemId!),
        },
        {
          id: 'send-backward',
          label: 'Send Backward',
          icon: <ChevronDown className="h-4 w-4" />,
          shortcut: 'Cmd+↓',
          onClick: () => moveItemDown(contextMenu.itemId!),
        },
        {
          id: 'send-to-back',
          label: 'Send to Back',
          icon: <ChevronsDown className="h-4 w-4" />,
          shortcut: 'Cmd+Shift+↓',
          onClick: () => moveItemToBottom(contextMenu.itemId!),
        },
        { id: 'separator-2', label: '', separator: true },
        {
          id: 'delete',
          label: 'Delete',
          icon: <Trash2 className="h-4 w-4" />,
          shortcut: 'Del',
          danger: true,
          onClick: () => removeItem(contextMenu.itemId!),
        },
      ]
    : [];

  return (
    <>
      <div
        ref={setContainerRef}
        className={`relative flex items-center justify-center p-4 rounded-lg transition-colors ${
          isOver
            ? 'bg-blue-100 dark:bg-blue-900/30'
            : 'bg-gray-100 dark:bg-gray-800'
        } ${className || ''}`}
        onDragOver={onCanvasDragOver}
        onDrop={onCanvasDrop}
        onMouseMove={(e) => {
          // Track mouse position for drag and drop
          lastMousePosition.current = {
            x: e.clientX,
            y: e.clientY,
          };
        }}
      >
        <svg
          ref={svgRef}
          id="kubito-canvas"
          width={canvasWidth * scale}
          height={canvasHeight * scale}
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          className="bg-white shadow-lg"
          style={{ touchAction: 'none' }}
          onContextMenu={(e) => {
            e.preventDefault();
            // Check if clicked on an item
            const target = e.target as SVGElement;
            const itemElement = target.closest('[data-item-id]') as SVGElement;
            const itemId = itemElement?.getAttribute('data-item-id');

            // Only show menu if clicked on an item
            if (!itemId) {
              return;
            }

            // If clicked on item and it's not selected, select it first
            if (selectedId !== itemId && !selectedIds.includes(itemId)) {
              setSelectedId(itemId);
            }

            handleContextMenu(e as unknown as React.MouseEvent, itemId);
          }}
        >
          <defs>
            <filter
              id="softShadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="6"
                floodOpacity="0.25"
              />
            </filter>
          </defs>

          {/* Background */}
          <CanvasGrid backgroundColor={config.backgroundColor} />

          {/* Render all items in z-order:
              - Backgrounds (z=-1000, locked)
              - Kubito-base body (z=0, transformable but cannot delete/copy)
              - Other items (z>0)
          */}
          {items
            .filter((item) => item.visible)
            .slice()
            .sort((a, b) => a.z - b.z)
            .map((item) => (
              <CanvasItem
                key={item.id}
                item={item}
                isSelected={
                  selectedId === item.id || selectedIds.includes(item.id)
                }
                selectedId={selectedId}
              />
            ))}

          {/* Multi-selection bounding box */}
          <CanvasMultiSelection items={items} selectedIds={selectedIds} />

          {/* Marquee selection - visual feedback while dragging */}
          {marquee && <CanvasMarquee start={marquee.start} end={marquee.end} />}

          {/* Smart alignment guides */}
          <CanvasGuides
            guides={activeGuides}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
          />
        </svg>

        {/* Zoom Controls */}
        <ZoomControls />
      </div>

      {/* Context Menu */}
      <ContextMenu
        isOpen={!!contextMenu}
        x={contextMenu?.x || 0}
        y={contextMenu?.y || 0}
        items={contextMenuItems}
        onClose={() => setContextMenu(null)}
      />
    </>
  );
});

Canvas.displayName = 'Canvas';
