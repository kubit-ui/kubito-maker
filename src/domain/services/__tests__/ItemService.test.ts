import { describe, it, expect, beforeEach } from "vitest";
import { ItemService } from "@/domain/services/ItemService";
import type { KubitoItem } from "@/types";

describe("ItemService", () => {
  let mockItems: KubitoItem[];

  beforeEach(() => {
    mockItems = [
      {
        id: "item_1",
        category: "Eyes",
        assetId: "eye1",
        name: "Eye 1",
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
      },
      {
        id: "item_2",
        category: "Mouths",
        assetId: "mouth1",
        name: "Mouth 1",
        x: 200,
        y: 200,
        scale: 1.5,
        rotate: 45,
        flipX: false,
        flipY: false,
        z: 1,
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
      },
    ];

    // Reset ID counter - using type assertion to access private member
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (ItemService as any).idCounter = 1;
  });

  describe("createItem", () => {
    it("should create item with generated ID and defaults", () => {
      const data = {
        category: "Eyes" as const,
        assetId: "eye2",
        name: "New Eye",
        x: 150,
        y: 150,
        scale: 1,
        rotate: 0,
        flipX: false,
        flipY: false,
      };

      const item = ItemService.createItem(data, 2);

      expect(item.id).toMatch(/^item_\d+_\d+$/);
      expect(item.z).toBe(2);
      expect(item.locked).toBe(false);
      expect(item.visible).toBe(true);
      expect(item.effects).toBeDefined();
      expect(item.category).toBe("Eyes");
    });
  });

  describe("updateItem", () => {
    it("should update specific item properties", () => {
      const updated = ItemService.updateItem(mockItems, "item_1", {
        x: 300,
        scale: 2,
      });

      const updatedItem = updated.find((i) => i.id === "item_1");
      expect(updatedItem?.x).toBe(300);
      expect(updatedItem?.scale).toBe(2);
      expect(updatedItem?.y).toBe(100); // Unchanged
    });

    it("should not modify other items", () => {
      const updated = ItemService.updateItem(mockItems, "item_1", { x: 300 });

      const otherItem = updated.find((i) => i.id === "item_2");
      expect(otherItem).toEqual(mockItems[1]);
    });
  });

  describe("removeItems", () => {
    it("should remove specified items", () => {
      const { items, removedCount } = ItemService.removeItems(mockItems, [
        "item_1",
      ]);

      expect(items).toHaveLength(1);
      expect(items[0]?.id).toBe("item_2");
      expect(removedCount).toBe(1);
    });

    it("should remove multiple items", () => {
      const { items, removedCount } = ItemService.removeItems(mockItems, [
        "item_1",
        "item_2",
      ]);

      expect(items).toHaveLength(0);
      expect(removedCount).toBe(2);
    });
  });

  describe("duplicateItems", () => {
    it("should duplicate item with offset", () => {
      const { newItems, newIds } = ItemService.duplicateItems(
        mockItems,
        ["item_1"],
        20,
      );

      expect(newItems).toHaveLength(1);
      expect(newIds).toHaveLength(1);
      expect(newItems[0]?.x).toBe(120); // Original 100 + offset 20
      expect(newItems[0]?.y).toBe(120);
      expect(newItems[0]?.id).not.toBe("item_1");
    });

    it("should duplicate multiple items", () => {
      const { newItems, newIds } = ItemService.duplicateItems(
        mockItems,
        ["item_1", "item_2"],
        10,
      );

      expect(newItems).toHaveLength(2);
      expect(newIds).toHaveLength(2);
    });
  });

  describe("findById", () => {
    it("should find item by ID", () => {
      const item = ItemService.findById(mockItems, "item_1");
      expect(item?.id).toBe("item_1");
    });

    it("should return undefined for non-existent ID", () => {
      const item = ItemService.findById(mockItems, "non_existent");
      expect(item).toBeUndefined();
    });
  });

  describe("toggleVisibility", () => {
    it("should toggle item visibility", () => {
      const updated = ItemService.toggleVisibility(mockItems, "item_1");
      const item = updated.find((i) => i.id === "item_1");
      expect(item?.visible).toBe(false);

      const toggledAgain = ItemService.toggleVisibility(updated, "item_1");
      const item2 = toggledAgain.find((i) => i.id === "item_1");
      expect(item2?.visible).toBe(true);
    });
  });

  describe("toggleLock", () => {
    it("should toggle item lock state", () => {
      const updated = ItemService.toggleLock(mockItems, "item_1");
      const item = updated.find((i) => i.id === "item_1");
      expect(item?.locked).toBe(true);

      const toggledAgain = ItemService.toggleLock(updated, "item_1");
      const item2 = toggledAgain.find((i) => i.id === "item_1");
      expect(item2?.locked).toBe(false);
    });
  });

  describe("sortByZ", () => {
    it("should sort items by z-index", () => {
      const unsorted = [...mockItems].reverse();
      const sorted = ItemService.sortByZ(unsorted);

      expect(sorted[0]?.z).toBe(0);
      expect(sorted[1]?.z).toBe(1);
    });
  });

  describe("getCountByCategory", () => {
    it("should count items by category", () => {
      const counts = ItemService.getCountByCategory(mockItems);

      expect(counts["Eyes"]).toBe(1);
      expect(counts["Mouths"]).toBe(1);
    });
  });

  describe("filterByCategory", () => {
    it("should filter items by category", () => {
      const eyes = ItemService.filterByCategory(mockItems, "Eyes");

      expect(eyes).toHaveLength(1);
      expect(eyes[0]?.category).toBe("Eyes");
    });
  });
});
