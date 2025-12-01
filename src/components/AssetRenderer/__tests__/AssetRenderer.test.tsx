import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { AssetRenderer } from "../AssetRenderer";

vi.mock("@/store/editorStore", () => ({
  useEditorStore: vi.fn(() => ({
    addItem: vi.fn(),
  })),
}));

describe("AssetRenderer", () => {
  it("renders without crashing", () => {
    const mockAsset = {
      id: "test-asset",
      name: "Test Asset",
      category: "Eyes" as const,
      svg: <circle cx="0" cy="0" r="10" />,
    };

    const { container } = render(<AssetRenderer asset={mockAsset} />);
    expect(container).toBeTruthy();
  });
});
