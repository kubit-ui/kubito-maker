import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { CanvasSizeSelector } from "../CanvasSizeSelector";

vi.mock("@/store/editorStore", () => ({
  useEditorStore: vi.fn(() => ({
    canvasWidth: 720,
    canvasHeight: 720,
    setCanvasSize: vi.fn(),
  })),
}));

describe("CanvasSizeSelector", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <CanvasSizeSelector isOpen={true} onClose={vi.fn()} />,
    );
    expect(container).toBeTruthy();
  });
});
