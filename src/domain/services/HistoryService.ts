import type { KubitoItem, HistoryState } from "@/types";

/**
 * Service for managing undo/redo history.
 * Implements a stack-based history system with configurable limits.
 */
export class HistoryService {
  private static readonly DEFAULT_MAX_HISTORY = 50;

  /**
   * Adds a new state to the history stack
   */
  static addToHistory(
    history: HistoryState[],
    historyIndex: number,
    items: KubitoItem[],
    maxHistory = this.DEFAULT_MAX_HISTORY,
  ): {
    history: HistoryState[];
    historyIndex: number;
  } {
    // Trim history to current index (remove any "future" states)
    const newHistory = history.slice(0, historyIndex + 1);

    // Add new state
    newHistory.push({
      items: JSON.parse(JSON.stringify(items)) as KubitoItem[],
      timestamp: Date.now(),
    });

    // Limit history size
    if (newHistory.length > maxHistory) {
      newHistory.shift();
    }

    return {
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  }

  /**
   * Undoes the last action
   */
  static undo(
    history: HistoryState[],
    historyIndex: number,
  ): {
    items: KubitoItem[] | null;
    historyIndex: number;
  } {
    if (historyIndex <= 0) {
      return {
        items: null,
        historyIndex,
      };
    }

    const previousState = history[historyIndex - 1];
    if (!previousState) {
      return {
        items: null,
        historyIndex,
      };
    }

    return {
      items: JSON.parse(JSON.stringify(previousState.items)) as KubitoItem[],
      historyIndex: historyIndex - 1,
    };
  }

  /**
   * Redoes the last undone action
   */
  static redo(
    history: HistoryState[],
    historyIndex: number,
  ): {
    items: KubitoItem[] | null;
    historyIndex: number;
  } {
    if (historyIndex >= history.length - 1) {
      return {
        items: null,
        historyIndex,
      };
    }

    const nextState = history[historyIndex + 1];
    if (!nextState) {
      return {
        items: null,
        historyIndex,
      };
    }

    return {
      items: JSON.parse(JSON.stringify(nextState.items)) as KubitoItem[],
      historyIndex: historyIndex + 1,
    };
  }

  /**
   * Checks if undo is available
   */
  static canUndo(historyIndex: number): boolean {
    return historyIndex > 0;
  }

  /**
   * Checks if redo is available
   */
  static canRedo(history: HistoryState[], historyIndex: number): boolean {
    return historyIndex < history.length - 1;
  }

  /**
   * Clears all history
   */
  static clearHistory(): {
    history: HistoryState[];
    historyIndex: number;
  } {
    return {
      history: [],
      historyIndex: -1,
    };
  }

  /**
   * Gets the number of available undo steps
   */
  static getUndoCount(historyIndex: number): number {
    return Math.max(0, historyIndex);
  }

  /**
   * Gets the number of available redo steps
   */
  static getRedoCount(history: HistoryState[], historyIndex: number): number {
    return Math.max(0, history.length - historyIndex - 1);
  }

  /**
   * Gets history statistics
   */
  static getHistoryStats(
    history: HistoryState[],
    historyIndex: number,
  ): {
    totalStates: number;
    currentIndex: number;
    canUndo: boolean;
    canRedo: boolean;
    undoCount: number;
    redoCount: number;
    memoryUsage: number;
  } {
    const memoryUsage = JSON.stringify(history).length;

    return {
      totalStates: history.length,
      currentIndex: historyIndex,
      canUndo: this.canUndo(historyIndex),
      canRedo: this.canRedo(history, historyIndex),
      undoCount: this.getUndoCount(historyIndex),
      redoCount: this.getRedoCount(history, historyIndex),
      memoryUsage,
    };
  }

  /**
   * Initializes history with current state
   */
  static initializeHistory(items: KubitoItem[]): {
    history: HistoryState[];
    historyIndex: number;
  } {
    return {
      history: [
        {
          items: JSON.parse(JSON.stringify(items)) as KubitoItem[],
          timestamp: Date.now(),
        },
      ],
      historyIndex: 0,
    };
  }

  /**
   * Compares two item states to detect changes
   */
  static hasChanges(items1: KubitoItem[], items2: KubitoItem[]): boolean {
    if (items1.length !== items2.length) {
      return true;
    }

    const sorted1 = [...items1].sort((a, b) => a.id.localeCompare(b.id));
    const sorted2 = [...items2].sort((a, b) => a.id.localeCompare(b.id));

    return JSON.stringify(sorted1) !== JSON.stringify(sorted2);
  }

  /**
   * Gets time elapsed since a history state
   */
  static getTimeElapsed(timestamp: number): number {
    return Date.now() - timestamp;
  }

  /**
   * Formats time elapsed as human-readable string
   */
  static formatTimeElapsed(timestamp: number): string {
    const elapsed = this.getTimeElapsed(timestamp);
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ago`;
    }
    if (minutes > 0) {
      return `${minutes}m ago`;
    }
    if (seconds > 5) {
      return `${seconds}s ago`;
    }
    return "Just now";
  }

  /**
   * Exports history for debugging or analysis
   */
  static exportHistory(history: HistoryState[], historyIndex: number): string {
    return JSON.stringify(
      {
        history,
        historyIndex,
        exportedAt: Date.now(),
      },
      null,
      2,
    );
  }

  /**
   * Imports history from exported data
   */
  static importHistory(data: string): {
    history: HistoryState[];
    historyIndex: number;
  } | null {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parsed = JSON.parse(data);
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        Array.isArray(parsed.history) &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof parsed.historyIndex === "number"
      ) {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          history: parsed.history,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          historyIndex: parsed.historyIndex,
        };
      }
      return null;
    } catch {
      return null;
    }
  }
}
