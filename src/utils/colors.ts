import type { ColorPalette, EditorTheme } from "@/types";

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: "default",
    name: "Default",
    colors: [
      "#000000",
      "#ffffff",
      "#ff4d4f",
      "#1890ff",
      "#52c41a",
      "#faad14",
      "#722ed1",
      "#eb2f96",
    ],
  },
  {
    id: "pastel",
    name: "Pastel",
    colors: [
      "#ffc9c9",
      "#b2f2bb",
      "#a5d8ff",
      "#ffec99",
      "#e7c6ff",
      "#ffd8a8",
      "#d3f9d8",
      "#ffc9d9",
    ],
  },
  {
    id: "vibrant",
    name: "Vibrant",
    colors: [
      "#ff0000",
      "#00ff00",
      "#0000ff",
      "#ffff00",
      "#ff00ff",
      "#00ffff",
      "#ff8800",
      "#8800ff",
    ],
  },
  {
    id: "earth",
    name: "Earth Tones",
    colors: [
      "#8b4513",
      "#d2691e",
      "#daa520",
      "#bc8f8f",
      "#f4a460",
      "#cd853f",
      "#deb887",
      "#d2b48c",
    ],
  },
  {
    id: "monochrome",
    name: "Monochrome",
    colors: [
      "#000000",
      "#333333",
      "#666666",
      "#999999",
      "#cccccc",
      "#e0e0e0",
      "#f5f5f5",
      "#ffffff",
    ],
  },
];

export const THEMES: EditorTheme[] = [
  {
    id: "light",
    name: "Light",
    primaryColor: "#1f6feb",
    secondaryColor: "#0969da",
    backgroundColor: "#ffffff",
    textColor: "#24292f",
    isDark: false,
  },
  {
    id: "dark",
    name: "Dark",
    primaryColor: "#58a6ff",
    secondaryColor: "#1f6feb",
    backgroundColor: "#0d1117",
    textColor: "#c9d1d9",
    isDark: true,
  },
  {
    id: "sunset",
    name: "Sunset",
    primaryColor: "#ff6b6b",
    secondaryColor: "#ff8787",
    backgroundColor: "#fff4e6",
    textColor: "#2d3436",
    isDark: false,
  },
  {
    id: "ocean",
    name: "Ocean",
    primaryColor: "#0984e3",
    secondaryColor: "#74b9ff",
    backgroundColor: "#dfe6e9",
    textColor: "#2d3436",
    isDark: false,
  },
];

export const hexToRgb = (
  hex: string,
): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result || !result[1] || !result[2] || !result[3]) {
    return null;
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
};

export const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

export const adjustColor = (hex: string, amount: number): string => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const r = Math.max(0, Math.min(255, rgb.r + amount));
  const g = Math.max(0, Math.min(255, rgb.g + amount));
  const b = Math.max(0, Math.min(255, rgb.b + amount));

  return rgbToHex(r, g, b);
};
