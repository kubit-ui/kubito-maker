import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Toolbar } from "../Toolbar";

vi.mock("@/store/editorStore", () => ({
  useEditorStore: vi.fn(() => ({
    items: [],
    canUndo: false,
    canRedo: false,
    undo: vi.fn(),
    redo: vi.fn(),
    canvasWidth: 720,
    canvasHeight: 720,
    selectedId: null,
  })),
}));

describe("Toolbar", () => {
  it("renders without crashing", () => {
    const { container } = render(<Toolbar />);
    expect(container).toBeTruthy();
  });
});
