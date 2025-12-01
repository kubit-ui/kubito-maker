import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { StylePanel } from "../StylePanel";

describe("StylePanel", () => {
  const mockItem = {
    id: "test-item",
    name: "Test Item",
    assetId: "eye-1",
    category: "Eyes" as const,
    x: 100,
    y: 100,
    scale: 1,
    rotate: 0,
    flipX: false,
    flipY: false,
    z: 1,
    locked: false,
    visible: true,
    effects: {
      color: "#000000",
      opacity: 1,
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      shadowColor: "#000000",
      shadowOpacity: 0,
      blur: 0,
      brightness: 1,
      contrast: 1,
      saturate: 1,
    },
  };

  it("renders without crashing", () => {
    const { container } = render(
      <StylePanel item={mockItem} onUpdate={vi.fn()} />,
    );
    expect(container).toBeTruthy();
  });
});
