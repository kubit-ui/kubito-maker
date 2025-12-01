import { describe, it, expect } from "vitest";
import {
  transformToString,
  getFilterString,
  getShadowFilter,
  hexToRgba,
  clamp,
  degreesToRadians,
  radiansToDegrees,
  rotatePoint,
  distance,
  generateId,
} from "../transform";
import type { KubitoItem } from "@/types";
import { DEFAULT_EFFECTS, DEFAULT_TRANSFORM } from "@/types";

describe("transform utils", () => {
  const mockItem: KubitoItem = {
    id: "test-1",
    category: "Eyes",
    assetId: "eyes-1",
    name: "Test Eyes",
    ...DEFAULT_TRANSFORM,
    z: 0,
    locked: false,
    visible: true,
    effects: { ...DEFAULT_EFFECTS },
  };

  describe("transformToString", () => {
    it("should convert transform properties to SVG string", () => {
      const result = transformToString(mockItem);
      expect(result).toContain("translate(360, 360)");
      expect(result).toContain("rotate(0)");
      expect(result).toContain("scale(1, 1)");
    });

    it("should handle flipped items", () => {
      const flippedItem = { ...mockItem, flipX: true, flipY: true };
      const result = transformToString(flippedItem);
      expect(result).toContain("scale(-1, -1)");
    });

    it("should handle rotation", () => {
      const rotatedItem = { ...mockItem, rotate: 45 };
      const result = transformToString(rotatedItem);
      expect(result).toContain("rotate(45)");
    });

    it("should handle scale", () => {
      const scaledItem = { ...mockItem, scale: 2 };
      const result = transformToString(scaledItem);
      expect(result).toContain("scale(2, 2)");
    });
  });

  describe("getFilterString", () => {
    it('should return "none" for default effects', () => {
      const result = getFilterString(mockItem);
      expect(result).toBe("none");
    });

    it("should generate blur filter", () => {
      const blurredItem = {
        ...mockItem,
        effects: { ...mockItem.effects, blur: 5 },
      };
      const result = getFilterString(blurredItem);
      expect(result).toContain("blur(5px)");
    });

    it("should generate brightness filter", () => {
      const brightItem = {
        ...mockItem,
        effects: { ...mockItem.effects, brightness: 1.5 },
      };
      const result = getFilterString(brightItem);
      expect(result).toContain("brightness(1.5)");
    });

    it("should combine multiple filters", () => {
      const filteredItem = {
        ...mockItem,
        effects: {
          ...mockItem.effects,
          blur: 2,
          brightness: 1.2,
          contrast: 0.8,
          saturate: 1.5,
        },
      };
      const result = getFilterString(filteredItem);
      expect(result).toContain("blur(2px)");
      expect(result).toContain("brightness(1.2)");
      expect(result).toContain("contrast(0.8)");
      expect(result).toContain("saturate(1.5)");
    });
  });

  describe("getShadowFilter", () => {
    it("should return empty string for no shadow", () => {
      const result = getShadowFilter(mockItem);
      expect(result).toBe("");
    });

    it("should generate drop-shadow filter", () => {
      const shadowItem = {
        ...mockItem,
        effects: {
          ...mockItem.effects,
          shadowBlur: 10,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          shadowColor: "#000000",
          shadowOpacity: 0.5,
        },
      };
      const result = getShadowFilter(shadowItem);
      expect(result).toContain("drop-shadow");
      expect(result).toContain("5px");
      expect(result).toContain("10px");
    });
  });

  describe("hexToRgba", () => {
    it("should convert hex to rgba", () => {
      const result = hexToRgba("#ff0000", 0.5);
      expect(result).toBe("rgba(255, 0, 0, 0.5)");
    });

    it("should handle hex without hash", () => {
      const result = hexToRgba("00ff00", 1);
      expect(result).toBe("rgba(0, 255, 0, 1)");
    });

    it("should handle invalid hex", () => {
      const result = hexToRgba("invalid", 0.5);
      expect(result).toBe("rgba(0, 0, 0, 0.5)");
    });
  });

  describe("clamp", () => {
    it("should clamp value within bounds", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe("angle conversions", () => {
    it("should convert degrees to radians", () => {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI);
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2);
      expect(degreesToRadians(0)).toBe(0);
    });

    it("should convert radians to degrees", () => {
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180);
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90);
      expect(radiansToDegrees(0)).toBe(0);
    });
  });

  describe("rotatePoint", () => {
    it("should rotate point around center", () => {
      const result = rotatePoint(10, 0, 0, 0, 90);
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(-10); // Rotation is counter-clockwise in standard math
    });

    it("should not change point at 0 degrees", () => {
      const result = rotatePoint(5, 5, 0, 0, 0);
      expect(result.x).toBeCloseTo(5);
      expect(result.y).toBeCloseTo(5);
    });
  });

  describe("distance", () => {
    it("should calculate distance between points", () => {
      expect(distance(0, 0, 3, 4)).toBe(5);
      expect(distance(0, 0, 0, 0)).toBe(0);
      expect(distance(1, 1, 4, 5)).toBeCloseTo(5);
    });
  });

  describe("generateId", () => {
    it("should generate unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it("should generate ID with correct format", () => {
      const id = generateId();
      expect(id).toMatch(/^\d+_[a-z0-9]+$/);
    });
  });
});
