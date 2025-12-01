/**
 * GuidesManager
 * Service responsible for managing guides (smart guides, user guides, rulers)
 * Framework-agnostic - pure TypeScript business logic
 */

import type { Guide, SnapConfig } from "@/utils/smartGuides";
import type { GuidesState } from "../models/EditorStates";

/**
 * User guide type
 */
export interface UserGuide {
  id: string;
  type: "horizontal" | "vertical";
  position: number;
}

/**
 * GuidesManager class
 * Handles all guides-related business logic without framework dependencies
 */
export class GuidesManager {
  /**
   * Sets active smart guides
   * @param guides - Array of guides to activate
   * @returns Updated guides array
   */
  static setActiveGuides(guides: Guide[]): Guide[] {
    return guides;
  }

  /**
   * Adds a new user guide
   * @param currentGuides - Current user guides
   * @param type - Guide type (horizontal/vertical)
   * @param position - Position in pixels
   * @returns Updated guides array
   */
  static addUserGuide(
    currentGuides: UserGuide[],
    type: "horizontal" | "vertical",
    position: number,
  ): UserGuide[] {
    const newGuide: UserGuide = {
      id: `guide-${Date.now()}-${Math.random()}`,
      type,
      position,
    };
    return [...currentGuides, newGuide];
  }

  /**
   * Removes a user guide
   * @param currentGuides - Current user guides
   * @param id - Guide ID to remove
   * @returns Updated guides array
   */
  static removeUserGuide(currentGuides: UserGuide[], id: string): UserGuide[] {
    return currentGuides.filter((g) => g.id !== id);
  }

  /**
   * Moves a user guide to a new position
   * @param currentGuides - Current user guides
   * @param id - Guide ID to move
   * @param position - New position in pixels
   * @returns Updated guides array
   */
  static moveUserGuide(
    currentGuides: UserGuide[],
    id: string,
    position: number,
  ): UserGuide[] {
    return currentGuides.map((g) => (g.id === id ? { ...g, position } : g));
  }

  /**
   * Toggles rulers visibility
   * @param currentState - Current show/hide state
   * @returns New state
   */
  static toggleRulers(currentState: boolean): boolean {
    return !currentState;
  }

  /**
   * Clears all user guides
   * @returns Empty array
   */
  static clearUserGuides(): UserGuide[] {
    return [];
  }

  /**
   * Gets guide info
   * @param state - Current guides state
   * @returns Guide statistics
   */
  static getGuidesInfo(state: GuidesState): {
    hasActiveGuides: boolean;
    hasUserGuides: boolean;
    userGuidesCount: number;
    horizontalGuidesCount: number;
    verticalGuidesCount: number;
  } {
    const horizontalGuidesCount = state.userGuides.filter(
      (g) => g.type === "horizontal",
    ).length;
    const verticalGuidesCount = state.userGuides.filter(
      (g) => g.type === "vertical",
    ).length;

    return {
      hasActiveGuides: state.activeGuides.length > 0,
      hasUserGuides: state.userGuides.length > 0,
      userGuidesCount: state.userGuides.length,
      horizontalGuidesCount,
      verticalGuidesCount,
    };
  }

  /**
   * Updates snap configuration
   * @param currentConfig - Current snap configuration
   * @param updates - Partial updates to apply
   * @returns Updated snap configuration
   */
  static updateSnapConfig(
    currentConfig: SnapConfig,
    updates: Partial<SnapConfig>,
  ): SnapConfig {
    return { ...currentConfig, ...updates };
  }
}
