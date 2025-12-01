import { describe, it, expect } from "vitest";
import { HistoryService } from "@/domain/services/HistoryService";
import type { KubitoItem, HistoryState } from "@/types";

describe("HistoryService", () => {
  const createMockItem = (id: string): KubitoItem => ({
    id,
    category: "Eyes",
    assetId: "eye1",
    name: "Test Eye",
    x: 100,
    y: 100,
    scale: 1,
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
      shadowOpacity: 0.3,
      blur: 0,
      brightness: 1,
      contrast: 1,
      saturate: 1,
    },
  });

  describe("addToHistory", () => {
    it("should add state to history", () => {
      const items = [createMockItem("item1")];
      const result = HistoryService.addToHistory([], -1, items);

      expect(result.history).toHaveLength(1);
      expect(result.historyIndex).toBe(0);
    });

    it("should trim future states when adding to middle of history", () => {
      const history: HistoryState[] = [
        { items: [createMockItem("1")], timestamp: 1 },
        { items: [createMockItem("2")], timestamp: 2 },
        { items: [createMockItem("3")], timestamp: 3 },
      ];

      const result = HistoryService.addToHistory(history, 1, [
        createMockItem("new"),
      ]);

      expect(result.history).toHaveLength(3); // States 0, 1, and new
      expect(result.historyIndex).toBe(2);
    });

    it("should limit history to max size", () => {
      const largeHistory: HistoryState[] = Array.from(
        { length: 50 },
        (_, i) => ({
          items: [createMockItem(`item${i}`)],
          timestamp: i,
        }),
      );

      const result = HistoryService.addToHistory(
        largeHistory,
        49,
        [createMockItem("new")],
        50,
      );

      expect(result.history.length).toBeLessThanOrEqual(50);
    });
  });

  describe("undo", () => {
    it("should return previous state", () => {
      const history: HistoryState[] = [
        { items: [createMockItem("1")], timestamp: 1 },
        { items: [createMockItem("2")], timestamp: 2 },
      ];

      const result = HistoryService.undo(history, 1);

      expect(result.items).toBeDefined();
      expect(result.items?.[0]?.id).toBe("1");
      expect(result.historyIndex).toBe(0);
    });

    it("should return null when at start of history", () => {
      const history: HistoryState[] = [
        { items: [createMockItem("1")], timestamp: 1 },
      ];

      const result = HistoryService.undo(history, 0);

      expect(result.items).toBeNull();
      expect(result.historyIndex).toBe(0);
    });
  });

  describe("redo", () => {
    it("should return next state", () => {
      const history: HistoryState[] = [
        { items: [createMockItem("1")], timestamp: 1 },
        { items: [createMockItem("2")], timestamp: 2 },
      ];

      const result = HistoryService.redo(history, 0);

      expect(result.items).toBeDefined();
      expect(result.items?.[0]?.id).toBe("2");
      expect(result.historyIndex).toBe(1);
    });

    it("should return null when at end of history", () => {
      const history: HistoryState[] = [
        { items: [createMockItem("1")], timestamp: 1 },
      ];

      const result = HistoryService.redo(history, 0);

      expect(result.items).toBeNull();
      expect(result.historyIndex).toBe(0);
    });
  });

  describe("canUndo", () => {
    it("should return true when undo is available", () => {
      expect(HistoryService.canUndo(1)).toBe(true);
      expect(HistoryService.canUndo(5)).toBe(true);
    });

    it("should return false when at start", () => {
      expect(HistoryService.canUndo(0)).toBe(false);
      expect(HistoryService.canUndo(-1)).toBe(false);
    });
  });

  describe("canRedo", () => {
    it("should return true when redo is available", () => {
      const history: HistoryState[] = [
        { items: [], timestamp: 1 },
        { items: [], timestamp: 2 },
        { items: [], timestamp: 3 },
      ];

      expect(HistoryService.canRedo(history, 0)).toBe(true);
      expect(HistoryService.canRedo(history, 1)).toBe(true);
    });

    it("should return false when at end", () => {
      const history: HistoryState[] = [
        { items: [], timestamp: 1 },
        { items: [], timestamp: 2 },
      ];

      expect(HistoryService.canRedo(history, 1)).toBe(false);
    });
  });

  describe("clearHistory", () => {
    it("should clear all history", () => {
      const result = HistoryService.clearHistory();

      expect(result.history).toEqual([]);
      expect(result.historyIndex).toBe(-1);
    });
  });

  describe("getUndoCount", () => {
    it("should return number of undo steps available", () => {
      expect(HistoryService.getUndoCount(0)).toBe(0);
      expect(HistoryService.getUndoCount(5)).toBe(5);
      expect(HistoryService.getUndoCount(-1)).toBe(0);
    });
  });

  describe("getRedoCount", () => {
    it("should return number of redo steps available", () => {
      const history: HistoryState[] = Array.from({ length: 5 }, (_, i) => ({
        items: [],
        timestamp: i,
      }));

      expect(HistoryService.getRedoCount(history, 2)).toBe(2);
      expect(HistoryService.getRedoCount(history, 4)).toBe(0);
    });
  });

  describe("hasChanges", () => {
    it("should detect changes in items", () => {
      const items1 = [createMockItem("1")];
      const items2 = [createMockItem("2")];

      expect(HistoryService.hasChanges(items1, items2)).toBe(true);
    });

    it("should detect no changes for identical items", () => {
      const items1 = [createMockItem("1")];
      const items2 = [createMockItem("1")];

      expect(HistoryService.hasChanges(items1, items2)).toBe(false);
    });

    it("should detect changes in item count", () => {
      const items1 = [createMockItem("1")];
      const items2 = [createMockItem("1"), createMockItem("2")];

      expect(HistoryService.hasChanges(items1, items2)).toBe(true);
    });
  });

  describe("initializeHistory", () => {
    it("should initialize history with current state", () => {
      const items = [createMockItem("1")];
      const result = HistoryService.initializeHistory(items);

      expect(result.history).toHaveLength(1);
      expect(result.historyIndex).toBe(0);
      expect(result.history[0]?.items).toHaveLength(1);
    });
  });

  describe("formatTimeElapsed", () => {
    it("should format recent time as 'Just now'", () => {
      const now = Date.now();
      expect(HistoryService.formatTimeElapsed(now)).toBe("Just now");
    });

    it("should format seconds", () => {
      const tenSecondsAgo = Date.now() - 10000;
      expect(HistoryService.formatTimeElapsed(tenSecondsAgo)).toBe("10s ago");
    });

    it("should format minutes", () => {
      const fiveMinutesAgo = Date.now() - 300000;
      expect(HistoryService.formatTimeElapsed(fiveMinutesAgo)).toBe("5m ago");
    });

    it("should format hours", () => {
      const twoHoursAgo = Date.now() - 7200000;
      expect(HistoryService.formatTimeElapsed(twoHoursAgo)).toBe("2h ago");
    });
  });
});
