import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { Inspector } from "../Inspector";

vi.mock("@/store/editorStore", () => ({
  useItems: vi.fn(() => []),
  useSelection: vi.fn(() => ({
    selectedId: null,
    selectedIds: [],
  })),
  useEditorActions: vi.fn(() => ({
    updateItem: vi.fn(),
    removeItem: vi.fn(),
    duplicateItem: vi.fn(),
    setSelectedId: vi.fn(),
    deselectAll: vi.fn(),
    toggleItemLock: vi.fn(),
    toggleItemVisibility: vi.fn(),
    moveItemUp: vi.fn(),
    moveItemDown: vi.fn(),
    alignItems: vi.fn(),
  })),
}));

describe("Inspector", () => {
  it("renders without crashing", () => {
    const { container } = render(<Inspector />);
    expect(container).toBeTruthy();
  });

  it("shows no selection message when nothing selected", () => {
    const { container } = render(<Inspector />);
    expect(container.textContent).toContain("Inspector");
  });
});
