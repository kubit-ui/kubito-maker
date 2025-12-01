import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { AssetPanel } from "../AssetPanel";

// Mock Zustand store
vi.mock("@/store/editorStore", () => ({
  useEditorStore: vi.fn(() => ({
    items: [],
    addItem: vi.fn(),
    setSelectedBody: vi.fn(),
  })),
}));

describe("AssetPanel", () => {
  it("renders without crashing", () => {
    const { container } = render(<AssetPanel />);
    expect(container).toBeTruthy();
  });

  it("renders the panel with title", () => {
    const { container } = render(<AssetPanel />);
    expect(container.textContent).toContain("Assets");
  });
});
