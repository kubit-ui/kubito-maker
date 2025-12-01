import { describe, it, expect } from "vitest";
import { TransformService } from "@/domain/services/TransformService";
import type { KubitoItem } from "@/types";

describe("TransformService", () => {
  const createMockItem = (): KubitoItem => ({
    id: "test_item",
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

  describe("moveItemBy", () => {
    it("should move item by delta", () => {
      const item = createMockItem();
      const moved = TransformService.moveItemBy(item, 50, 30);

      expect(moved.x).toBe(150);
      expect(moved.y).toBe(130);
    });
  });

  describe("moveItemTo", () => {
    it("should move item to absolute position", () => {
      const item = createMockItem();
      const moved = TransformService.moveItemTo(item, 200, 300);

      expect(moved.x).toBe(200);
      expect(moved.y).toBe(300);
    });
  });

  describe("scaleItemBy", () => {
    it("should scale item by factor", () => {
      const item = createMockItem();
      const scaled = TransformService.scaleItemBy(item, 2);

      expect(scaled.scale).toBe(2);
    });

    it("should compound scale operations", () => {
      const item = createMockItem();
      const scaled = TransformService.scaleItemBy(item, 2);
      const doubleScaled = TransformService.scaleItemBy(scaled, 1.5);

      expect(doubleScaled.scale).toBe(3);
    });
  });

  describe("scaleItemTo", () => {
    it("should set absolute scale", () => {
      const item = { ...createMockItem(), scale: 2 };
      const scaled = TransformService.scaleItemTo(item, 3);

      expect(scaled.scale).toBe(3);
    });
  });

  describe("rotateItemBy", () => {
    it("should rotate item by delta degrees", () => {
      const item = createMockItem();
      const rotated = TransformService.rotateItemBy(item, 45);

      expect(rotated.rotate).toBe(45);
    });

    it("should wrap rotation at 360 degrees", () => {
      const item = createMockItem();
      const rotated = TransformService.rotateItemBy(item, 370);

      expect(rotated.rotate).toBe(10);
    });
  });

  describe("rotateItemTo", () => {
    it("should set absolute rotation", () => {
      const item = createMockItem();
      const rotated = TransformService.rotateItemTo(item, 90);

      expect(rotated.rotate).toBe(90);
    });
  });

  describe("flipItemHorizontal", () => {
    it("should toggle horizontal flip", () => {
      const item = createMockItem();
      const flipped = TransformService.flipItemHorizontal(item);

      expect(flipped.flipX).toBe(true);

      const flippedBack = TransformService.flipItemHorizontal(flipped);
      expect(flippedBack.flipX).toBe(false);
    });
  });

  describe("flipItemVertical", () => {
    it("should toggle vertical flip", () => {
      const item = createMockItem();
      const flipped = TransformService.flipItemVertical(item);

      expect(flipped.flipY).toBe(true);

      const flippedBack = TransformService.flipItemVertical(flipped);
      expect(flippedBack.flipY).toBe(false);
    });
  });

  describe("applyTransform", () => {
    it("should apply partial transform", () => {
      const item = createMockItem();
      const transformed = TransformService.applyTransform(item, {
        x: 200,
        rotate: 45,
        scale: 2,
      });

      expect(transformed.x).toBe(200);
      expect(transformed.rotate).toBe(45);
      expect(transformed.scale).toBe(2);
      expect(transformed.y).toBe(100); // Unchanged
    });
  });

  describe("resetTransform", () => {
    it("should reset transform to defaults", () => {
      const item = {
        ...createMockItem(),
        scale: 3,
        rotate: 180,
        flipX: true,
        flipY: true,
      };

      const reset = TransformService.resetTransform(item);

      expect(reset.scale).toBe(1);
      expect(reset.rotate).toBe(0);
      expect(reset.flipX).toBe(false);
      expect(reset.flipY).toBe(false);
    });
  });

  describe("getItemCenter", () => {
    it("should get item center point", () => {
      const item = createMockItem();
      const center = TransformService.getItemCenter(item);

      expect(center.x).toBe(100);
      expect(center.y).toBe(100);
    });
  });

  describe("getItemsCenter", () => {
    it("should calculate center of multiple items", () => {
      const items = [
        { ...createMockItem(), x: 0, y: 0 },
        { ...createMockItem(), x: 100, y: 100 },
      ];

      const center = TransformService.getItemsCenter(items);

      expect(center.x).toBe(50);
      expect(center.y).toBe(50);
    });

    it("should return origin for empty array", () => {
      const center = TransformService.getItemsCenter([]);

      expect(center.x).toBe(0);
      expect(center.y).toBe(0);
    });
  });

  describe("snapToGrid", () => {
    it("should snap value to grid", () => {
      expect(TransformService.snapToGrid(47, 10)).toBe(50);
      expect(TransformService.snapToGrid(43, 10)).toBe(40);
      expect(TransformService.snapToGrid(105, 20)).toBe(100);
    });
  });

  describe("snapPointToGrid", () => {
    it("should snap point to grid", () => {
      const snapped = TransformService.snapPointToGrid(47, 83, 10);

      expect(snapped.x).toBe(50);
      expect(snapped.y).toBe(80);
    });
  });

  describe("constrainToBounds", () => {
    it("should constrain item within bounds", () => {
      const item = { ...createMockItem(), x: -10, y: 500 };
      const constrained = TransformService.constrainToBounds(
        item,
        0,
        0,
        400,
        400,
      );

      expect(constrained.x).toBe(0);
      expect(constrained.y).toBe(400);
    });
  });
});
