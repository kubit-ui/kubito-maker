import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { LayersPanel } from "../LayersPanel";

vi.mock("@/store/editorStore", () => ({
  useItems: vi.fn(() => []),
  useSelection: vi.fn(() => ({
    selectedIds: [],
  })),
  useEditorActions: vi.fn(() => ({
    setSelectedId: vi.fn(),
    toggleSelection: vi.fn(),
    updateItem: vi.fn(),
    moveItemUp: vi.fn(),
    moveItemDown: vi.fn(),
    moveItemToTop: vi.fn(),
    moveItemToBottom: vi.fn(),
    toggleItemLock: vi.fn(),
    toggleItemVisibility: vi.fn(),
  })),
}));

describe("LayersPanel", () => {
  it("renders without crashing", () => {
    const { container } = render(<LayersPanel />);
    expect(container).toBeTruthy();
  });
});
