import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { UnifiedSidebar } from "../UnifiedSidebar";

// Mock child components
vi.mock("@/components/AssetPanel", () => ({
  AssetPanel: () => <div>AssetPanel</div>,
}));

vi.mock("@/components/LayersPanel", () => ({
  LayersPanel: () => <div>LayersPanel</div>,
}));

vi.mock("@/components/Inspector", () => ({
  Inspector: () => <div>Inspector</div>,
}));

describe("UnifiedSidebar", () => {
  it("renders without crashing", () => {
    const { container } = render(<UnifiedSidebar />);
    expect(container).toBeTruthy();
  });

  it("shows assets panel by default", () => {
    render(<UnifiedSidebar />);
    expect(screen.getByText("AssetPanel")).toBeInTheDocument();
  });

  it("renders all tab buttons with icons", () => {
    render(<UnifiedSidebar />);

    // Check that all tab icons are present
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(4); // 3 tabs + 1 collapse
  });

  it("renders collapse button", () => {
    const { container } = render(<UnifiedSidebar />);
    // Check for collapse icon
    expect(container.textContent).toContain("←");
  });
});
