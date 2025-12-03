/**
 * EditorStoreAdapter
 * Zustand adapter that connects the framework-agnostic domain services
 * to the React/Zustand store implementation.
 *
 * This adapter follows the Dependency Inversion Principle:
 * - Domain services contain pure business logic
 * - This adapter connects those services to Zustand state management
 * - React components consume through hooks
 */

import toast from 'react-hot-toast';
import type {
  KubitoItem,
  EditorConfig,
  EditorTheme,
  TransformMode,
  KubitoFile,
  BrushSettings,
  BrushStroke,
  BrushMode,
  BrushPoint,
} from '@/types';
import { DEFAULT_BRUSH_SETTINGS } from '@/types';
import type { Guide, SnapConfig } from '@/utils/smartGuides';
import { DEFAULT_SNAP_CONFIG } from '@/utils/smartGuides';
import type { CombinedEditorState } from '@/domain/models/EditorStates';
import {
  ItemService,
  HistoryService,
  AlignmentService,
  SelectionManager,
  GuidesManager,
  ConfigManager,
  type AlignmentType,
} from '@/domain';

/**
 * Actions interface for editor state mutations
 * All actions use domain services for business logic
 */
export interface EditorActions {
  // Body selection
  setSelectedBodyId: (id: string) => void;

  // Smart Guides
  setActiveGuides: (guides: Guide[]) => void;

  // User Guides
  addGuide: (type: 'horizontal' | 'vertical', position: number) => void;
  removeGuide: (id: string) => void;
  moveGuide: (id: string, position: number) => void;
  toggleRulers: () => void;
  updateSnapConfig: (updates: Partial<SnapConfig>) => void;

  // Item CRUD
  addItem: (
    item: Omit<KubitoItem, 'id' | 'z' | 'locked' | 'visible' | 'effects'>
  ) => void;
  updateItem: (id: string, updates: Partial<KubitoItem>) => void;
  removeItem: (id: string) => void;
  duplicateItem: (id: string) => void;
  copyItem: (id: string) => void;
  pasteItem: () => void;

  // Selection
  setSelectedId: (id: string | null) => void;
  setSelectedIds: (ids: string[]) => void;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  setMode: (mode: TransformMode) => void;

  // Layer management
  moveItemUp: (id: string) => void;
  moveItemDown: (id: string) => void;
  moveItemToTop: (id: string) => void;
  moveItemToBottom: (id: string) => void;
  toggleItemVisibility: (id: string) => void;
  toggleItemLock: (id: string) => void;

  // Alignment
  alignItems: (alignmentType: AlignmentType) => void;

  // History
  undo: () => void;
  redo: () => void;
  addToHistory: () => void;

  // Config
  updateConfig: (updates: Partial<EditorConfig>) => void;
  setCanvasSize: (width: number, height: number, presetId?: string) => void;
  setTheme: (theme: EditorTheme) => void;
  setKubitoName: (name: string) => void;

  // View/Zoom
  setCanvasZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;

  // Brush
  setBrushMode: (mode: BrushMode) => void;
  updateBrushSettings: (updates: Partial<BrushSettings>) => void;
  startStroke: (point: BrushPoint) => void;
  addPointToStroke: (point: BrushPoint) => void;
  finishStroke: () => void;
  removeStroke: (id: string) => void;
  clearAllStrokes: () => void;
  restoreBrushStrokes: (strokes: BrushStroke[]) => void; // For loading saved kubito files
  toggleStrokeVisibility: (id: string) => void;
  toggleStrokeLock: (id: string) => void;
  selectStroke: (id: string | null) => void;
  moveStroke: (id: string, offsetX: number, offsetY: number) => void;
  updateStrokeTransform: (
    id: string,
    transform: { scale?: number; rotate?: number }
  ) => void;

  // Utility
  clearAll: () => void;
  loadProject: (
    items: KubitoItem[],
    config?: Partial<EditorConfig>,
    brushStrokes?: BrushStroke[],
    selectedBodyId?: string
  ) => void;
  importKubito: (kubitoFile: KubitoFile) => void;
}

/**
 * Combined state and actions interface
 */
export type EditorStore = CombinedEditorState & EditorActions;

/**
 * Type for Zustand set function
 */
type SetState = (
  partial:
    | Partial<CombinedEditorState>
    | ((state: CombinedEditorState) => Partial<CombinedEditorState>)
) => void;

/**
 * Type for Zustand get function
 */
type GetState = () => CombinedEditorState & EditorActions;

/**
 * Creates the initial editor state using domain services
 */
export function createInitialState(
  config: EditorConfig = ConfigManager.getDefaultConfig()
): CombinedEditorState {
  const initialBodyItem = ConfigManager.createInitialBodyItem(config);

  return {
    // Items
    items: [initialBodyItem],

    // Selection
    selectedId: 'kubito-base',
    selectedIds: [],
    mode: 'none',

    // Body
    selectedBodyId: 'body1',

    // Guides
    activeGuides: [],
    userGuides: [],
    showRulers: false,
    snapConfig: DEFAULT_SNAP_CONFIG,

    // History
    history: [],
    historyIndex: -1,

    // Config
    config,
    theme: ConfigManager.getDefaultTheme(),
    kubitoName: 'my-kubito',

    // View
    canvasZoom: 1,

    // Brush
    brushMode: 'none',
    brushSettings: DEFAULT_BRUSH_SETTINGS,
    brushStrokes: [],
    currentStroke: null,
    selectedStrokeId: null,
  };
}

/**
 * Creates editor actions using domain services
 * This function returns all the actions that mutate state,
 * but delegates business logic to domain services
 */
export function createEditorActions(
  set: SetState,
  get: GetState
): EditorActions {
  return {
    // Body selection
    setSelectedBodyId: (id: string) => {
      set((state) => {
        const bodyItem = state.items.find((item) => item.id === 'kubito-base');

        // If kubito-base exists, update its assetId
        if (bodyItem) {
          const updatedItems = state.items.map((item) =>
            item.id === 'kubito-base' ? { ...item, assetId: id } : item
          );
          return {
            selectedBodyId: id,
            items: updatedItems,
          };
        }

        // If kubito-base doesn't exist, recreate it and ADD it to existing items
        const newBodyItem = ConfigManager.createInitialBodyItem(
          state.config,
          id
        );

        return {
          selectedBodyId: id,
          selectedId: 'kubito-base',
          items: [newBodyItem, ...state.items], // ✅ Mantener items existentes
        };
      });
      get().addToHistory();
    },

    // Smart Guides
    setActiveGuides: (guides: Guide[]) => {
      const newGuides = GuidesManager.setActiveGuides(guides);
      set({ activeGuides: newGuides });
    },

    // User Guides
    addGuide: (type: 'horizontal' | 'vertical', position: number) => {
      set((state) => ({
        userGuides: GuidesManager.addUserGuide(
          state.userGuides,
          type,
          position
        ),
      }));
    },

    removeGuide: (id: string) => {
      set((state) => ({
        userGuides: GuidesManager.removeUserGuide(state.userGuides, id),
      }));
    },

    moveGuide: (id: string, position: number) => {
      set((state) => ({
        userGuides: GuidesManager.moveUserGuide(state.userGuides, id, position),
      }));
    },

    toggleRulers: () => {
      set((state) => ({
        showRulers: GuidesManager.toggleRulers(state.showRulers),
      }));
    },

    updateSnapConfig: (updates: Partial<SnapConfig>) => {
      set((state) => ({
        snapConfig: GuidesManager.updateSnapConfig(state.snapConfig, updates),
      }));
    },

    // Item CRUD using ItemService
    addItem: (itemData) => {
      const isBackground = itemData.category === 'Backgrounds';
      const isBody = itemData.category === 'Bodies';
      const config = get().config;

      // Prevent adding Bodies from AssetPanel
      if (isBody) {
        return;
      }

      // Calculate scale and position for backgrounds
      const baseAssetSize = 80;
      const scaleToFillCanvas = isBackground
        ? Math.max(
            config.canvasWidth / baseAssetSize,
            config.canvasHeight / baseAssetSize
          )
        : itemData.scale;

      const xPosition = isBackground ? config.canvasWidth / 2 : itemData.x;
      const yPosition = isBackground ? config.canvasHeight / 2 : itemData.y;

      const itemDataAdjusted = {
        ...itemData,
        x: xPosition,
        y: yPosition,
        scale: scaleToFillCanvas,
      };

      const newItem = ItemService.createItem(
        itemDataAdjusted,
        get().items.length
      );

      // Handle backgrounds specially
      if (isBackground) {
        newItem.z = -1000;
        newItem.locked = true;

        set((state) => {
          const itemsWithoutBackgrounds = state.items.filter(
            (item) => item.category !== 'Backgrounds'
          );
          return {
            items: [...itemsWithoutBackgrounds, newItem],
            selectedId: null,
          };
        });
      } else {
        set((state) => ({
          items: [...state.items, newItem],
          selectedId: newItem.id,
        }));
      }

      get().addToHistory();
    },

    updateItem: (id: string, updates: Partial<KubitoItem>) => {
      set((state) => ({
        items: ItemService.updateItem(state.items, id, updates),
      }));
      get().addToHistory();
    },

    removeItem: (_id: string) => {
      const state = get();
      const idsToRemove = SelectionManager.getFilteredSelectedIds(state, [
        'kubito-base',
      ]);

      if (idsToRemove.length === 0) {
        return;
      }

      const result = ItemService.removeItems(state.items, idsToRemove);
      set({
        items: result.items,
        ...SelectionManager.deselectAll(),
      });
      get().addToHistory();
    },

    duplicateItem: (_id: string) => {
      const state = get();
      const idsToDuplicate = SelectionManager.getFilteredSelectedIds(state, [
        'kubito-base',
      ]);

      if (idsToDuplicate.length === 0) {
        return;
      }

      const result = ItemService.duplicateItems(
        state.items,
        idsToDuplicate,
        20
      );

      if (result.newItems.length > 0) {
        set((currentState) => ({
          items: [...currentState.items, ...result.newItems],
          ...SelectionManager.selectMultiple(result.newIds),
        }));
        get().addToHistory();
      }
    },

    copyItem: (_id: string) => {
      const state = get();
      const idsToCopy = SelectionManager.getFilteredSelectedIds(state, [
        'kubito-base',
      ]);

      if (idsToCopy.length === 0) {
        return;
      }

      ItemService.copyToClipboard(state.items, idsToCopy);
    },

    pasteItem: () => {
      const result = ItemService.pasteFromClipboard(get().items, 20);

      if (result) {
        set((state) => ({
          items: [...state.items, ...result.newItems],
          ...SelectionManager.selectMultiple(result.newIds),
        }));
        get().addToHistory();
      }
    },

    // Selection using SelectionManager
    setSelectedId: (id: string | null) => {
      set(SelectionManager.selectSingle(id));
    },

    setSelectedIds: (ids: string[]) => {
      set(SelectionManager.selectMultiple(ids));
    },

    toggleSelection: (id: string) => {
      set((state) => SelectionManager.toggleSelection(state.selectedIds, id));
    },

    selectAll: () => {
      const items = get().items;
      set(SelectionManager.selectAll(items));
      toast.success(`${items.length} items selected`, {
        duration: 1500,
      });
    },

    deselectAll: () => {
      set(SelectionManager.deselectAll());
    },

    setMode: (mode: TransformMode) => {
      set({ mode: SelectionManager.setMode(mode) });
    },

    // Layer management
    moveItemUp: (id: string) => {
      const items = get().items;
      const index = items.findIndex((i) => i.id === id);
      if (index === -1 || index === items.length - 1) return;

      const newItems = [...items];
      const item = newItems[index];
      const nextItem = newItems[index + 1];

      if (!item || !nextItem) return;

      item.z = nextItem.z;
      nextItem.z = item.z - 1;

      newItems[index] = nextItem;
      newItems[index + 1] = item;

      set({ items: newItems });
      get().addToHistory();
    },

    moveItemDown: (id: string) => {
      const items = get().items;
      const index = items.findIndex((i) => i.id === id);
      if (index === -1 || index === 0) return;

      const newItems = [...items];
      const item = newItems[index];
      const prevItem = newItems[index - 1];

      if (!item || !prevItem) return;

      item.z = prevItem.z;
      prevItem.z = item.z + 1;

      newItems[index] = prevItem;
      newItems[index - 1] = item;

      set({ items: newItems });
      get().addToHistory();
    },

    moveItemToTop: (id: string) => {
      const items = get().items;
      const maxZ = Math.max(...items.map((i) => i.z), 0);
      get().updateItem(id, { z: maxZ + 1 });
    },

    moveItemToBottom: (id: string) => {
      const items = get().items;
      const minZ = Math.min(...items.map((i) => i.z), 0);
      get().updateItem(id, { z: minZ - 1 });
    },

    toggleItemVisibility: (id: string) => {
      set((state) => ({
        items: ItemService.toggleVisibility(state.items, id),
      }));
      get().addToHistory();
    },

    toggleItemLock: (id: string) => {
      set((state) => ({
        items: ItemService.toggleLock(state.items, id),
      }));
      get().addToHistory();
    },

    // Alignment using AlignmentService
    alignItems: (alignmentType: AlignmentType) => {
      const { items, selectedIds, config } = get();
      if (selectedIds.length === 0) return;

      const alignedItems = AlignmentService.align(
        items,
        selectedIds,
        alignmentType,
        config.canvasWidth,
        config.canvasHeight
      );

      set({ items: alignedItems });
      get().addToHistory();
    },

    // History using HistoryService
    addToHistory: () => {
      const state = get();
      const result = HistoryService.addToHistory(
        state.history,
        state.historyIndex,
        state.items
      );

      set({
        history: result.history,
        historyIndex: result.historyIndex,
      });
    },

    undo: () => {
      const state = get();
      const result = HistoryService.undo(state.history, state.historyIndex);

      if (result.items) {
        set({
          items: result.items,
          historyIndex: result.historyIndex,
        });
      }
    },

    redo: () => {
      const state = get();
      const result = HistoryService.redo(state.history, state.historyIndex);

      if (result.items) {
        set({
          items: result.items,
          historyIndex: result.historyIndex,
        });
      }
    },

    // Config using ConfigManager
    updateConfig: (updates: Partial<EditorConfig>) => {
      const result = ConfigManager.updateConfig(get().config, updates);

      if (!result.valid) {
        toast.error(`Invalid config: ${result.validation.errors.join(', ')}`);
        return;
      }

      set({ config: result.config });
    },

    setCanvasSize: (width: number, height: number, presetId?: string) => {
      const result = ConfigManager.setCanvasSize(
        get().config,
        width,
        height,
        presetId
      );

      if (!result.validation.valid) {
        toast.error(
          `Invalid canvas size: ${result.validation.errors.join(', ')}`
        );
        return;
      }

      set({ config: result.config });

      // Adjust kubito-base if it exists
      if (result.bodyUpdates) {
        const bodyItem = get().items.find((item) => item.id === 'kubito-base');
        if (bodyItem) {
          get().updateItem('kubito-base', result.bodyUpdates);
        }
      }

      toast.success(`Canvas: ${width}x${height}px`, {
        duration: 1500,
      });
    },

    setTheme: (theme: EditorTheme) => {
      set({ theme: ConfigManager.setTheme(theme) });
    },

    setKubitoName: (name: string) => {
      set({ kubitoName: name.trim() || 'my-kubito' });
    },

    // View/Zoom
    setCanvasZoom: (zoom: number) => {
      const clampedZoom = Math.max(0.1, Math.min(5, zoom)); // Min 10%, Max 500%
      set({ canvasZoom: clampedZoom });
    },

    zoomIn: () => {
      const currentZoom = get().canvasZoom;
      const newZoom = Math.min(5, currentZoom + 0.1);
      set({ canvasZoom: newZoom });
    },

    zoomOut: () => {
      const currentZoom = get().canvasZoom;
      const newZoom = Math.max(0.1, currentZoom - 0.1);
      set({ canvasZoom: newZoom });
    },

    resetZoom: () => {
      set({ canvasZoom: 1 });
    },

    // Brush
    setBrushMode: (mode: BrushMode) => {
      console.warn('🎯 setBrushMode called in store with mode:', mode);
      set({ brushMode: mode });
      console.warn('🎯 State updated. New brushMode:', get().brushMode);
      // Deseleccionar items cuando se activa el modo brush
      if (mode !== 'none') {
        get().deselectAll();
      }
    },

    updateBrushSettings: (updates: Partial<BrushSettings>) => {
      set((state) => ({
        brushSettings: { ...state.brushSettings, ...updates },
      }));
    },

    startStroke: (point: BrushPoint) => {
      const state = get();
      const newStroke: BrushStroke = {
        id: `stroke-${Date.now()}-${Math.random()}`,
        points: [point],
        settings: { ...state.brushSettings },
        z: state.brushStrokes.length,
        locked: false,
        visible: true,
        createdAt: Date.now(),
        offsetX: 0,
        offsetY: 0,
        scale: 1,
        rotate: 0,
      };
      set({ currentStroke: newStroke });
    },

    addPointToStroke: (point: BrushPoint) => {
      set((state) => {
        if (!state.currentStroke) return state;
        return {
          currentStroke: {
            ...state.currentStroke,
            points: [...state.currentStroke.points, point],
          },
        };
      });
    },

    finishStroke: () => {
      set((state) => {
        if (!state.currentStroke) return state;

        // Solo añadir el trazo si tiene al menos 2 puntos
        if (state.currentStroke.points.length < 2) {
          return { currentStroke: null };
        }

        return {
          brushStrokes: [...state.brushStrokes, state.currentStroke],
          currentStroke: null,
        };
      });
      get().addToHistory();
    },

    removeStroke: (id: string) => {
      set((state) => ({
        brushStrokes: state.brushStrokes.filter((stroke) => stroke.id !== id),
      }));
      get().addToHistory();
    },

    clearAllStrokes: () => {
      set({ brushStrokes: [], currentStroke: null });
      get().addToHistory();
    },

    restoreBrushStrokes: (strokes: BrushStroke[]) => {
      set({ brushStrokes: strokes });
      get().addToHistory();
    },

    toggleStrokeVisibility: (id: string) => {
      set((state) => ({
        brushStrokes: state.brushStrokes.map((stroke) =>
          stroke.id === id ? { ...stroke, visible: !stroke.visible } : stroke
        ),
      }));
    },

    toggleStrokeLock: (id: string) => {
      set((state) => ({
        brushStrokes: state.brushStrokes.map((stroke) =>
          stroke.id === id ? { ...stroke, locked: !stroke.locked } : stroke
        ),
      }));
    },

    selectStroke: (id: string | null) => {
      set({ selectedStrokeId: id });
    },

    moveStroke: (id: string, offsetX: number, offsetY: number) => {
      set((state) => ({
        brushStrokes: state.brushStrokes.map((stroke) =>
          stroke.id === id ? { ...stroke, offsetX, offsetY } : stroke
        ),
      }));
    },

    updateStrokeTransform: (
      id: string,
      transform: { scale?: number; rotate?: number }
    ) => {
      set((state) => ({
        brushStrokes: state.brushStrokes.map((stroke) =>
          stroke.id === id ? { ...stroke, ...transform } : stroke
        ),
      }));
    },

    // Utility
    clearAll: () => {
      set({
        items: [],
        selectedId: null,
        selectedIds: [],
        history: [],
        historyIndex: -1,
      });
    },

    loadProject: (
      items: KubitoItem[],
      config?: Partial<EditorConfig>,
      brushStrokes?: BrushStroke[],
      selectedBodyId?: string
    ) => {
      set({
        items: JSON.parse(JSON.stringify(items)) as KubitoItem[],
        brushStrokes: brushStrokes
          ? (JSON.parse(JSON.stringify(brushStrokes)) as BrushStroke[])
          : [],
        config: config ? { ...get().config, ...config } : get().config,
        selectedBodyId: selectedBodyId || get().selectedBodyId,
        selectedId: null,
        selectedIds: [],
        history: [],
        historyIndex: -1,
      });
      get().addToHistory();
    },

    importKubito: (kubitoFile: KubitoFile) => {
      try {
        const items = kubitoFile.items as KubitoItem[];

        // Use canvas config if available, otherwise use current config
        const canvasConfig = kubitoFile.canvas
          ? {
              canvasWidth: kubitoFile.canvas.width,
              canvasHeight: kubitoFile.canvas.height,
              canvasBackground: kubitoFile.canvas.background,
            }
          : {};

        set({
          items: JSON.parse(JSON.stringify(items)) as KubitoItem[],
          config: { ...get().config, ...canvasConfig },
          kubitoName: kubitoFile.name || 'imported-design',
          selectedId: null,
          selectedIds: [],
          history: [],
          historyIndex: -1,
        });

        get().addToHistory();
        toast.success(
          `Design "${kubitoFile.name || 'Imported'}" loaded successfully`
        );
      } catch (error) {
        console.error('Error importing kubito:', error);
        toast.error('Error importing design');
      }
    },
  };
}
