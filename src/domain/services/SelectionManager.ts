/**
 * SelectionManager
 * Service responsible for managing item selection logic (single, multiple, toggle)
 * Framework-agnostic - pure TypeScript business logic
 */

import type { KubitoItem, TransformMode } from "@/types";
import type { SelectionState } from "../models/EditorStates";

/**
 * Result type for selection operations
 */
export interface SelectionResult {
  selectedId: string | null;
  selectedIds: string[];
}

/**
 * SelectionManager class
 * Handles all selection-related business logic without framework dependencies
 */
export class SelectionManager {
  /**
   * Selects a single item
   * @param id - Item ID to select, or null to deselect all
   * @returns New selection state
   */
  static selectSingle(id: string | null): SelectionResult {
    return {
      selectedId: id,
      selectedIds: id ? [id] : [],
    };
  }

  /**
   * Selects multiple items
   * @param ids - Array of item IDs to select
   * @returns New selection state
   */
  static selectMultiple(ids: string[]): SelectionResult {
    return {
      selectedId: ids.length === 1 ? (ids[0] ?? null) : null,
      selectedIds: ids,
    };
  }

  /**
   * Toggles selection of an item (for Shift+Click)
   * @param currentIds - Currently selected IDs
   * @param id - Item ID to toggle
   * @returns New selection state
   */
  static toggleSelection(currentIds: string[], id: string): SelectionResult {
    const newIds = currentIds.includes(id)
      ? currentIds.filter((selId) => selId !== id)
      : [...currentIds, id];

    return {
      selectedId: newIds.length === 1 ? (newIds[0] ?? null) : null,
      selectedIds: newIds,
    };
  }

  /**
   * Selects all items
   * @param items - All canvas items
   * @returns New selection state
   */
  static selectAll(items: KubitoItem[]): SelectionResult {
    const allIds = items.map((item) => item.id);
    return {
      selectedId: allIds.length === 1 ? (allIds[0] ?? null) : null,
      selectedIds: allIds,
    };
  }

  /**
   * Deselects all items
   * @returns New selection state
   */
  static deselectAll(): SelectionResult {
    return {
      selectedId: null,
      selectedIds: [],
    };
  }

  /**
   * Gets the current selection state
   * @param state - Current selection state
   * @returns Selection summary
   */
  static getSelectionInfo(state: SelectionState): {
    hasSelection: boolean;
    isSingleSelection: boolean;
    isMultipleSelection: boolean;
    count: number;
  } {
    const count = state.selectedIds.length;
    return {
      hasSelection: count > 0,
      isSingleSelection: count === 1,
      isMultipleSelection: count > 1,
      count,
    };
  }

  /**
   * Checks if an item is selected
   * @param state - Current selection state
   * @param id - Item ID to check
   * @returns True if item is selected
   */
  static isSelected(state: SelectionState, id: string): boolean {
    return state.selectedIds.includes(id);
  }

  /**
   * Gets the IDs of selected items (prioritizes selectedIds array over selectedId)
   * @param state - Current selection state
   * @returns Array of selected item IDs
   */
  static getSelectedIds(state: SelectionState): string[] {
    return state.selectedIds.length > 0
      ? state.selectedIds
      : state.selectedId
        ? [state.selectedId]
        : [];
  }

  /**
   * Filters selected IDs to exclude certain items (e.g., kubito-base)
   * @param state - Current selection state
   * @param excludeIds - IDs to exclude
   * @returns Filtered selection IDs
   */
  static getFilteredSelectedIds(
    state: SelectionState,
    excludeIds: string[],
  ): string[] {
    const selectedIds = this.getSelectedIds(state);
    return selectedIds.filter((id) => !excludeIds.includes(id));
  }

  /**
   * Creates a new mode state
   * @param mode - Transformation mode
   * @returns New mode value
   */
  static setMode(mode: TransformMode): TransformMode {
    return mode;
  }
}
