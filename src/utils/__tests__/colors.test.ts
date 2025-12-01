import { describe, it, expect } from "vitest";
import { COLOR_PALETTES, THEMES } from "../colors";

describe("colors", () => {
  describe("COLOR_PALETTES", () => {
    it("should have default palette", () => {
      const defaultPalette = COLOR_PALETTES.find((p) => p.id === "default");
      expect(defaultPalette).toBeDefined();
      expect(defaultPalette?.colors).toHaveLength(8);
    });

    it("should have all palettes with valid structure", () => {
      COLOR_PALETTES.forEach((palette) => {
        expect(palette.id).toBeTruthy();
        expect(palette.name).toBeTruthy();
        expect(Array.isArray(palette.colors)).toBe(true);
        expect(palette.colors.length).toBeGreaterThan(0);

        palette.colors.forEach((color) => {
          expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
      });
    });

    it("should have unique palette IDs", () => {
      const ids = COLOR_PALETTES.map((p) => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("THEMES", () => {
    it("should have light theme", () => {
      const lightTheme = THEMES.find((t) => t.id === "light");
      expect(lightTheme).toBeDefined();
      expect(lightTheme?.isDark).toBe(false);
    });

    it("should have dark theme", () => {
      const darkTheme = THEMES.find((t) => t.id === "dark");
      expect(darkTheme).toBeDefined();
      expect(darkTheme?.isDark).toBe(true);
    });

    it("should have all themes with valid structure", () => {
      THEMES.forEach((theme) => {
        expect(theme.id).toBeTruthy();
        expect(theme.name).toBeTruthy();
        expect(theme.primaryColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(theme.secondaryColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(theme.backgroundColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(theme.textColor).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(typeof theme.isDark).toBe("boolean");
      });
    });

    it("should have unique theme IDs", () => {
      const ids = THEMES.map((t) => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
