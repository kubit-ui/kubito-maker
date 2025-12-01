import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import type {
  KubitoItem,
  EditorConfig,
  EditorTheme,
  HistoryState,
  TransformMode,
} from "@/types";
import type { Guide } from "@/utils/smartGuides";
import {
  ItemService,
  HistoryService,
  AlignmentService,
  CanvasModel,
  type AlignmentType,
} from "@/domain";

/**
 * Main editor state interface containing all canvas items, selection state,
 * configuration, and action methods.
 * @interface EditorState
 */
interface EditorState {
  // Items
  /** All items currently on the canvas */
  items: KubitoItem[];
  /** ID of the single selected item, or null if none/multiple selected */
  selectedId: string | null;
  /** Array of all selected item IDs (supports multiple selection) */
  selectedIds: string[];
  /** Current transformation mode for selected items */
  mode: TransformMode;

  // Body selection
  /** ID of the currently selected body/character base */
  selectedBodyId: string;
  /** Sets the selected body ID */
  setSelectedBodyId: (id: string) => void;

  // Smart Guides
  /** Currently active alignment guides */
  activeGuides: Guide[];
  /** Updates the active alignment guides */
  setActiveGuides: (guides: Guide[]) => void;

  // User Guides (draggable rulers)
  /** User-created guide lines */
  userGuides: Array<{
    id: string;
    type: "horizontal" | "vertical";
    position: number;
  }>;
  /** Adds a new guide */
  addGuide: (type: "horizontal" | "vertical", position: number) => void;
  /** Removes a guide */
  removeGuide: (id: string) => void;
  /** Moves a guide */
  moveGuide: (id: string, position: number) => void;
  /** Shows/hides rulers */
  showRulers: boolean;
  /** Toggles rulers visibility */
  toggleRulers: () => void;

  // History
  /** Stack of previous states for undo/redo */
  history: HistoryState[];
  /** Current position in history stack */
  historyIndex: number;

  // Config
  /** Editor configuration settings */
  config: EditorConfig;
  /** Current UI theme */
  theme: EditorTheme;

  // Actions
  /**
   * Adds a new item to the canvas with auto-generated ID and defaults.
   * @param item - Item data without ID, z-index, locked, visible, or effects
   */
  addItem: (
    item: Omit<KubitoItem, "id" | "z" | "locked" | "visible" | "effects">,
  ) => void;

  /**
   * Updates properties of an existing item.
   * @param id - Item ID to update
   * @param updates - Partial updates to apply
   */
  updateItem: (id: string, updates: Partial<KubitoItem>) => void;

  /**
   * Removes an item or all selected items from canvas.
   * @param id - Item ID to remove
   */
  removeItem: (id: string) => void;

  /**
   * Duplicates an item or all selected items.
   * @param id - Item ID to duplicate
   */
  duplicateItem: (id: string) => void;

  /**
   * Copies an item or selected items to clipboard.
   * @param id - Item ID to copy
   */
  copyItem: (id: string) => void;

  /** Pastes items from clipboard to canvas */
  pasteItem: () => void;

  /**
   * Sets the selected item by ID.
   * @param id - Item ID to select, or null to deselect
   */
  setSelectedId: (id: string | null) => void;

  /**
   * Sets multiple selected items.
   * @param ids - Array of item IDs to select
   */
  setSelectedIds: (ids: string[]) => void;

  /**
   * Toggles an item's selection state (for Shift+Click).
   * @param id - Item ID to toggle
   */
  toggleSelection: (id: string) => void;

  /** Selects all items on canvas */
  selectAll: () => void;

  /** Deselects all items */
  deselectAll: () => void;

  /**
   * Sets the current transformation mode.
   * @param mode - Transform mode to activate
   */
  setMode: (mode: TransformMode) => void;

  // Layer management
  /**
   * Moves item up one layer.
   * @param id - Item ID to move
   */
  moveItemUp: (id: string) => void;

  /**
   * Moves item down one layer.
   * @param id - Item ID to move
   */
  moveItemDown: (id: string) => void;

  /**
   * Moves item to topmost layer.
   * @param id - Item ID to move
   */
  moveItemToTop: (id: string) => void;

  /**
   * Moves item to bottommost layer.
   * @param id - Item ID to move
   */
  moveItemToBottom: (id: string) => void;

  /**
   * Toggles item visibility.
   * @param id - Item ID to toggle
   */
  toggleItemVisibility: (id: string) => void;

  /**
   * Toggles item lock state.
   * @param id - Item ID to toggle
   */
  toggleItemLock: (id: string) => void;

  // Alignment
  /**
   * Aligns selected items
   * @param alignmentType - Type of alignment to apply
   */
  alignItems: (alignmentType: AlignmentType) => void;

  // History
  /** Undoes the last action */
  undo: () => void;

  /** Redoes the last undone action */
  redo: () => void;

  /** Adds current state to history stack */
  addToHistory: () => void;

  // Config
  /**
   * Updates editor configuration.
   * @param updates - Partial config updates to apply
   */
  updateConfig: (updates: Partial<EditorConfig>) => void;

  /**
   * Sets canvas dimensions.
   * @param width - Canvas width in pixels
   * @param height - Canvas height in pixels
   * @param presetId - Optional preset ID
   */
  setCanvasSize: (width: number, height: number, presetId?: string) => void;

  /**
   * Sets the editor theme.
   * @param theme - Theme configuration to apply
   */
  setTheme: (theme: EditorTheme) => void;

  // Utility
  /** Clears all items and resets history */
  clearAll: () => void;

  /**
   * Loads a project with items and configuration.
   * @param items - Items to load
   * @param config - Optional configuration to merge
   */
  loadProject: (items: KubitoItem[], config?: Partial<EditorConfig>) => void;
}

/** Default editor configuration */
const DEFAULT_CONFIG: EditorConfig = {
  canvasWidth: 720,
  canvasHeight: 720,
  gridEnabled: false,
  snapToGrid: false,
  gridSize: 20,
  backgroundColor: "#ffffff",
};

/** Default light theme configuration */
const DEFAULT_THEME: EditorTheme = {
  id: "light",
  name: "Light",
  primaryColor: "#1f6feb",
  secondaryColor: "#0969da",
  backgroundColor: "#ffffff",
  textColor: "#24292f",
  isDark: false,
};

/**
 * Main Zustand store for the Kubito editor.
 * Manages canvas items, selection, history, and configuration.
 * Persists config and theme to localStorage.
 *
 * Now refactored to use domain services for business logic!
 *
 * @example
 * ```tsx
 * const { items, addItem, selectedId } = useEditorStore();
 * ```
 */
export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => {
      // Create initial kubito-base body item
      // Calculate initial scale based on canvas size
      // Body assets use 80x80 viewBox like other assets,
      // but we want them to be ~80% of canvas size
      const canvasWidth = DEFAULT_CONFIG.canvasWidth;
      const canvasHeight = DEFAULT_CONFIG.canvasHeight;
      const targetBodySize = Math.min(canvasWidth, canvasHeight) * 0.8;
      const baseAssetSize = 80; // Asset viewBox size
      const bodyScale = targetBodySize / baseAssetSize;

      const initialBodyItem: KubitoItem = {
        id: "kubito-base",
        category: "Bodies",
        assetId: "body1",
        name: "Kubito Base",
        x: canvasWidth / 2,
        y: canvasHeight / 2,
        scale: bodyScale, // Calculated to fit 80% of canvas
        rotate: 0,
        flipX: false,
        flipY: false,
        z: 0, // Above backgrounds (-1000), below accessories (>0)
        locked: false, // CAN be transformed (moved, scaled, rotated)
        visible: true,
        effects: {
          opacity: 1,
          color: "#000000",
          shadowBlur: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: "#000000",
          shadowOpacity: 0,
          blur: 0,
          brightness: 1,
          contrast: 1,
          saturate: 1,
        },
      };

      return {
        items: [initialBodyItem],
        selectedId: "kubito-base", // Kubito-base selected by default to show handles
        selectedIds: [],
        mode: "none",
        selectedBodyId: "body1",
        activeGuides: [],
        userGuides: [],
        showRulers: false,
        history: [],
        historyIndex: -1,
        config: DEFAULT_CONFIG,
        theme: DEFAULT_THEME,

        setSelectedBodyId: (id) => {
          // Update both selectedBodyId and kubito-base assetId in one atomic operation
          set((state) => {
            const bodyItem = state.items.find(
              (item) => item.id === "kubito-base",
            );

            // If kubito-base exists, update its assetId
            if (bodyItem) {
              const updatedItems = state.items.map((item) =>
                item.id === "kubito-base" ? { ...item, assetId: id } : item,
              );
              return {
                selectedBodyId: id,
                items: updatedItems,
              };
            }

            // If kubito-base doesn't exist (after clearAll), recreate it
            const canvasWidth = state.config.canvasWidth;
            const canvasHeight = state.config.canvasHeight;
            const targetBodySize = Math.min(canvasWidth, canvasHeight) * 0.8;
            const baseAssetSize = 80;
            const bodyScale = targetBodySize / baseAssetSize;

            const newBodyItem: KubitoItem = {
              id: "kubito-base",
              category: "Bodies",
              assetId: id, // Use the new body ID
              name: "Kubito Base",
              x: canvasWidth / 2,
              y: canvasHeight / 2,
              scale: bodyScale,
              rotate: 0,
              flipX: false,
              flipY: false,
              z: 0,
              locked: false,
              visible: true,
              effects: {
                opacity: 1,
                color: "#000000",
                shadowBlur: 0,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowColor: "#000000",
                shadowOpacity: 0,
                blur: 0,
                brightness: 1,
                contrast: 1,
                saturate: 1,
              },
            };

            return {
              selectedBodyId: id,
              selectedId: "kubito-base", // Select the new body
              items: [newBodyItem],
            };
          });
          get().addToHistory();
        },
        setActiveGuides: (guides) => set({ activeGuides: guides }),

        // User guides management
        addGuide: (type, position) => {
          const newGuide = {
            id: `guide-${Date.now()}-${Math.random()}`,
            type,
            position,
          };
          set((state) => ({
            userGuides: [...state.userGuides, newGuide],
          }));
        },

        removeGuide: (id) => {
          set((state) => ({
            userGuides: state.userGuides.filter((g) => g.id !== id),
          }));
        },

        moveGuide: (id, position) => {
          set((state) => ({
            userGuides: state.userGuides.map((g) =>
              g.id === id ? { ...g, position } : g,
            ),
          }));
        },

        toggleRulers: () => {
          set((state) => ({ showRulers: !state.showRulers }));
        },

        // Item CRUD operations using ItemService
        addItem: (itemData) => {
          const isBackground = itemData.category === "Backgrounds";
          const isBody = itemData.category === "Bodies";
          const config = get().config;

          // Prevent adding Bodies from AssetPanel
          // The kubito-base is the only body and it's managed by CanvasBody component
          if (isBody) {
            return;
          }

          // For backgrounds:
          // - Calculate scale to fill the entire canvas
          // - Position at canvas center (since SVG assets are centered at 0,0)
          const baseAssetSize = 80; // Standard asset size in viewBox units
          const scaleToFillCanvas = isBackground
            ? Math.max(
                config.canvasWidth / baseAssetSize,
                config.canvasHeight / baseAssetSize,
              )
            : itemData.scale;

          // Position backgrounds at canvas center (assets are centered at 0,0)
          const xPosition = isBackground ? config.canvasWidth / 2 : itemData.x;
          const yPosition = isBackground ? config.canvasHeight / 2 : itemData.y;

          // Create item with adjusted properties for backgrounds
          const itemDataAdjusted = {
            ...itemData,
            x: xPosition,
            y: yPosition,
            scale: scaleToFillCanvas,
          };

          const newItem = ItemService.createItem(
            itemDataAdjusted,
            get().items.length,
          );

          // If adding a background, replace any existing background atomically
          // (only one background allowed at a time)
          if (isBackground) {
            // Set z and locked properties immediately before adding to items
            newItem.z = -1000;
            newItem.locked = true;

            set((state) => {
              // Remove any existing backgrounds and add the new one in one atomic operation
              const itemsWithoutBackgrounds = state.items.filter(
                (item) => item.category !== "Backgrounds",
              );
              return {
                items: [...itemsWithoutBackgrounds, newItem],
                selectedId: null, // Don't select backgrounds
              };
            });
          } else {
            // Normal items: just add them
            set((state) => ({
              items: [...state.items, newItem],
              selectedId: newItem.id,
            }));
          }

          get().addToHistory();
        },

        updateItem: (id, updates) => {
          set((state) => ({
            items: ItemService.updateItem(state.items, id, updates),
          }));
          get().addToHistory();
        },

        removeItem: (id) => {
          const idsToRemove =
            get().selectedIds.length > 0 ? get().selectedIds : [id];

          // Prevent removal of kubito-base body
          const filteredIds = idsToRemove.filter(
            (itemId) => itemId !== "kubito-base",
          );

          if (filteredIds.length === 0) {
            // All selected items were kubito-base, cannot delete
            return;
          }

          const result = ItemService.removeItems(get().items, filteredIds);
          set({
            items: result.items,
            selectedId: null,
            selectedIds: [],
          });
          get().addToHistory();
        },

        duplicateItem: (id) => {
          const idsToDuplicate =
            get().selectedIds.length > 0 ? get().selectedIds : [id];

          // Prevent duplication of kubito-base body
          const filteredIds = idsToDuplicate.filter(
            (itemId) => itemId !== "kubito-base",
          );

          if (filteredIds.length === 0) {
            // All selected items were kubito-base, cannot duplicate
            return;
          }

          const result = ItemService.duplicateItems(
            get().items,
            filteredIds,
            20,
          );

          if (result.newItems.length > 0) {
            set((state) => ({
              items: [...state.items, ...result.newItems],
              selectedIds: result.newIds,
              selectedId: result.newIds.length === 1 ? result.newIds[0] : null,
            }));
            get().addToHistory();
          }
        },

        copyItem: (id) => {
          const idsToCopy =
            get().selectedIds.length > 0 ? get().selectedIds : [id];

          // Prevent copying of kubito-base body
          const filteredIds = idsToCopy.filter(
            (itemId) => itemId !== "kubito-base",
          );

          if (filteredIds.length === 0) {
            // All selected items were kubito-base, cannot copy
            return;
          }

          ItemService.copyToClipboard(get().items, filteredIds);
        },

        pasteItem: () => {
          const result = ItemService.pasteFromClipboard(get().items, 20);

          if (result) {
            set((state) => ({
              items: [...state.items, ...result.newItems],
              selectedIds: result.newIds,
              selectedId: result.newIds.length === 1 ? result.newIds[0] : null,
            }));
            get().addToHistory();
          }
        },

        // Selection
        setSelectedId: (id) =>
          set({ selectedId: id, selectedIds: id ? [id] : [] }),

        setSelectedIds: (ids) =>
          set({
            selectedIds: ids,
            selectedId: ids.length === 1 ? ids[0] : null,
          }),

        toggleSelection: (id) => {
          const currentIds = get().selectedIds;
          const newIds = currentIds.includes(id)
            ? currentIds.filter((selId) => selId !== id)
            : [...currentIds, id];

          set({
            selectedIds: newIds,
            selectedId: newIds.length === 1 ? newIds[0] : null,
          });
        },

        selectAll: () => {
          const allIds = get().items.map((item) => item.id);
          set({
            selectedIds: allIds,
            selectedId: allIds.length === 1 ? allIds[0] : null,
          });
          toast.success(`${allIds.length} items selected`, {
            duration: 1500,
          });
        },

        deselectAll: () => {
          set({ selectedIds: [], selectedId: null });
        },

        setMode: (mode) => set({ mode }),

        // Layer management
        moveItemUp: (id) => {
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

        moveItemDown: (id) => {
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

        moveItemToTop: (id) => {
          const items = get().items;
          const maxZ = Math.max(...items.map((i) => i.z), 0);
          get().updateItem(id, { z: maxZ + 1 });
        },

        moveItemToBottom: (id) => {
          const items = get().items;
          const minZ = Math.min(...items.map((i) => i.z), 0);
          get().updateItem(id, { z: minZ - 1 });
        },

        toggleItemVisibility: (id) => {
          set((state) => ({
            items: ItemService.toggleVisibility(state.items, id),
          }));
          get().addToHistory();
        },

        toggleItemLock: (id) => {
          set((state) => ({
            items: ItemService.toggleLock(state.items, id),
          }));
          get().addToHistory();
        },

        // Alignment using AlignmentService
        alignItems: (alignmentType) => {
          const { items, selectedIds, config } = get();
          if (selectedIds.length === 0) return;

          const alignedItems = AlignmentService.align(
            items,
            selectedIds,
            alignmentType,
            config.canvasWidth,
            config.canvasHeight,
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
            state.items,
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

        // Config
        updateConfig: (updates) => {
          const currentCanvas = new CanvasModel(get().config);
          const updatedCanvas = currentCanvas.update(updates);
          const validation = updatedCanvas.validate();

          if (!validation.valid) {
            toast.error(`Invalid config: ${validation.errors.join(", ")}`);
            return;
          }

          set({
            config: updatedCanvas.toJSON(),
          });
        },

        setCanvasSize: (width, height, presetId) => {
          const currentCanvas = new CanvasModel(get().config);
          const updatedCanvas = currentCanvas.setSize(width, height, presetId);
          const validation = updatedCanvas.validate();

          if (!validation.valid) {
            toast.error(`Invalid canvas size: ${validation.errors.join(", ")}`);
            return;
          }

          set({
            config: updatedCanvas.toJSON(),
          });

          // Adjust kubito-base position and scale when canvas size changes
          const bodyItem = get().items.find(
            (item) => item.id === "kubito-base",
          );
          if (bodyItem) {
            // Calculate new scale to maintain ~80% of canvas size
            const targetBodySize = Math.min(width, height) * 0.8;
            const baseAssetSize = 80;
            const newScale = targetBodySize / baseAssetSize;

            get().updateItem("kubito-base", {
              x: width / 2,
              y: height / 2,
              scale: newScale,
            });
          }

          toast.success(`Canvas: ${width}x${height}px`, {
            duration: 1500,
          });
        },
        setTheme: (theme) => set({ theme }),

        // Utility
        clearAll: () => {
          set({
            items: [],
            selectedId: null,
            history: [],
            historyIndex: -1,
          });
        },

        loadProject: (items, config) => {
          set({
            items: JSON.parse(JSON.stringify(items)) as KubitoItem[],
            config: config ? { ...get().config, ...config } : get().config,
            selectedId: null,
            history: [],
            historyIndex: -1,
          });
          get().addToHistory();
        },
      };
    },
    {
      name: "kubito-editor-storage",
      partialize: (state) => ({
        config: state.config,
        theme: state.theme,
      }),
    },
  ),
);
