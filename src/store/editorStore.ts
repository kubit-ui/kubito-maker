/**
 * Editor Store
 * Main Zustand store for the Kubito editor.
 * Refactored to use domain services and adapters following clean architecture principles.
 *
 * This file is now much simpler - it only:
 * 1. Creates the Zustand store using our adapter
 * 2. Configures persistence
 * 3. Exports the store hook
 *
 * All business logic is in domain/services/
 * All framework connection logic is in adapters/zustand/
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import {
  createInitialState,
  createEditorActions,
  type EditorStore,
} from "@/adapters/zustand/EditorStoreAdapter";

/**
 * Main Zustand store for the Kubito editor.
 * Manages canvas items, selection, history, and configuration.
 * Persists config and theme to localStorage.
 *
 * @example
 * ```tsx
 * const { items, addItem, selectedId } = useEditorStore();
 * ```
 */
export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
      // Initial state from domain
      ...createInitialState(),

      // Actions from adapter
      ...createEditorActions(set, get),
    }),
    {
      name: "kubito-editor-storage",
      partialize: (state) => ({
        config: state.config,
        theme: state.theme,
        kubitoName: state.kubitoName,
      }),
    },
  ),
);

/**
 * Selector hooks for optimized component re-renders
 * Use these instead of accessing the full store to prevent unnecessary re-renders
 */

// Items selectors
export const useItems = () => useEditorStore((state) => state.items);
export const useItemById = (id: string) =>
  useEditorStore((state) => state.items.find((item) => item.id === id));

// Selection selectors
export const useSelection = () =>
  useEditorStore(
    useShallow((state) => ({
      selectedId: state.selectedId,
      selectedIds: state.selectedIds,
      mode: state.mode,
    })),
  );
export const useSelectedId = () => useEditorStore((state) => state.selectedId);
export const useSelectedIds = () =>
  useEditorStore((state) => state.selectedIds);
export const useMode = () => useEditorStore((state) => state.mode);

// Body selectors
export const useSelectedBodyId = () =>
  useEditorStore((state) => state.selectedBodyId);

// Guides selectors
export const useGuides = () =>
  useEditorStore(
    useShallow((state) => ({
      activeGuides: state.activeGuides,
      userGuides: state.userGuides,
      showRulers: state.showRulers,
    })),
  );

export const useSnapConfig = () => useEditorStore((state) => state.snapConfig);

// History selectors
export const useHistory = () =>
  useEditorStore(
    useShallow((state) => ({
      history: state.history,
      historyIndex: state.historyIndex,
      canUndo: state.historyIndex > 0,
      canRedo: state.historyIndex < state.history.length - 1,
    })),
  );

// Config selectors
export const useConfig = () => useEditorStore((state) => state.config);
export const useTheme = () => useEditorStore((state) => state.theme);
export const useKubitoName = () => useEditorStore((state) => state.kubitoName);
export const useCanvasSize = () =>
  useEditorStore(
    useShallow((state) => ({
      width: state.config.canvasWidth,
      height: state.config.canvasHeight,
    })),
  );

// View selectors
export const useCanvasZoom = () => useEditorStore((state) => state.canvasZoom);

// Brush selectors
export const useBrushMode = () => useEditorStore((state) => state.brushMode);
export const useBrushSettings = () =>
  useEditorStore((state) => state.brushSettings);
export const useBrushStrokes = () =>
  useEditorStore((state) => state.brushStrokes);
export const useCurrentStroke = () =>
  useEditorStore((state) => state.currentStroke);
export const useSelectedStrokeId = () =>
  useEditorStore((state) => state.selectedStrokeId);

// Text selectors
export const useTextSettings = () =>
  useEditorStore((state) => state.textSettings);
export const useTextItems = () =>
  useEditorStore((state) =>
    state.items.filter(
      (item) => "type" in item && (item as any).type === "text",
    ),
  );

// Action selectors (for callbacks) - OPTIMIZED with useShallow
export const useEditorActions = () =>
  useEditorStore(
    useShallow((state) => ({
      // Items
      addItem: state.addItem,
      updateItem: state.updateItem,
      removeItem: state.removeItem,
      duplicateItem: state.duplicateItem,
      copyItem: state.copyItem,
      pasteItem: state.pasteItem,

      // Selection
      setSelectedId: state.setSelectedId,
      setSelectedIds: state.setSelectedIds,
      toggleSelection: state.toggleSelection,
      selectAll: state.selectAll,
      deselectAll: state.deselectAll,
      setMode: state.setMode,

      // Layers
      moveItemUp: state.moveItemUp,
      moveItemDown: state.moveItemDown,
      moveItemToTop: state.moveItemToTop,
      moveItemToBottom: state.moveItemToBottom,
      toggleItemVisibility: state.toggleItemVisibility,
      toggleItemLock: state.toggleItemLock,

      // Alignment
      alignItems: state.alignItems,

      // History
      undo: state.undo,
      redo: state.redo,

      // Config
      updateConfig: state.updateConfig,
      setCanvasSize: state.setCanvasSize,
      setTheme: state.setTheme,
      setKubitoName: state.setKubitoName,

      // Body
      setSelectedBodyId: state.setSelectedBodyId,

      // Guides
      setActiveGuides: state.setActiveGuides,
      addGuide: state.addGuide,
      removeGuide: state.removeGuide,
      moveGuide: state.moveGuide,
      toggleRulers: state.toggleRulers,
      updateSnapConfig: state.updateSnapConfig,

      // View/Zoom
      setCanvasZoom: state.setCanvasZoom,
      zoomIn: state.zoomIn,
      zoomOut: state.zoomOut,
      resetZoom: state.resetZoom,

      // Brush
      setBrushMode: state.setBrushMode,
      updateBrushSettings: state.updateBrushSettings,
      startStroke: state.startStroke,
      addPointToStroke: state.addPointToStroke,
      finishStroke: state.finishStroke,
      removeStroke: state.removeStroke,
      clearAllStrokes: state.clearAllStrokes,
      toggleStrokeVisibility: state.toggleStrokeVisibility,
      toggleStrokeLock: state.toggleStrokeLock,
      selectStroke: state.selectStroke,
      moveStroke: state.moveStroke,
      updateStrokeTransform: state.updateStrokeTransform,

      // Text
      updateTextSettings: state.updateTextSettings,
      addText: state.addText,
      updateText: state.updateText,
      updateTextStyle: state.updateTextStyle,
      toggleTextEditing: state.toggleTextEditing,

      // Utility
      clearAll: state.clearAll,
      loadProject: state.loadProject,
      importKubito: state.importKubito,
    })),
  ); // ✅ CRITICAL: useShallow prevents re-renders when functions don't change
