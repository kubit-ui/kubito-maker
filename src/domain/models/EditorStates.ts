/**
 * Domain state interfaces
 * These interfaces represent the different state slices of the editor,
 * following the Single Responsibility Principle and making the state more maintainable.
 */

import type {
  KubitoItem,
  EditorConfig,
  EditorTheme,
  HistoryState,
  TransformMode,
} from "@/types";
import type { Guide, SnapConfig } from "@/utils/smartGuides";

/**
 * State interface for managing canvas items
 */
export interface ItemsState {
  /** All items currently on the canvas */
  items: KubitoItem[];
}

/**
 * State interface for managing item selection
 */
export interface SelectionState {
  /** ID of the single selected item, or null if none/multiple selected */
  selectedId: string | null;
  /** Array of all selected item IDs (supports multiple selection) */
  selectedIds: string[];
  /** Current transformation mode for selected items */
  mode: TransformMode;
}

/**
 * State interface for managing body/character selection
 */
export interface BodyState {
  /** ID of the currently selected body/character base */
  selectedBodyId: string;
}

/**
 * State interface for managing alignment guides
 */
export interface GuidesState {
  /** Currently active alignment guides */
  activeGuides: Guide[];
  /** User-created guide lines */
  userGuides: Array<{
    id: string;
    type: "horizontal" | "vertical";
    position: number;
  }>;
  /** Shows/hides rulers */
  showRulers: boolean;
  /** Snap configuration */
  snapConfig: SnapConfig;
}

/**
 * State interface for managing undo/redo history
 */
export interface HistoryStateContainer {
  /** Stack of previous states for undo/redo */
  history: HistoryState[];
  /** Current position in history stack */
  historyIndex: number;
}

/**
 * State interface for managing editor configuration
 */
export interface ConfigState {
  /** Editor configuration settings */
  config: EditorConfig;
  /** Current UI theme */
  theme: EditorTheme;
  /** Name for the Kubito (used in export filename: kubito_[name].extension) */
  kubitoName: string;
}

/**
 * State interface for managing canvas zoom/view
 */
export interface ViewState {
  /** Current zoom level (1 = 100%, 0.5 = 50%, 2 = 200%, etc.) */
  canvasZoom: number;
}

/**
 * Combined editor state
 * This is the complete state interface that combines all state slices
 */
export interface CombinedEditorState
  extends
    ItemsState,
    SelectionState,
    BodyState,
    GuidesState,
    HistoryStateContainer,
    ConfigState,
    ViewState {}
