import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { BodySelector } from "../BodySelector";

vi.mock("@/store/editorStore", () => ({
  useEditorStore: vi.fn(() => ({
    selectedBody: "body-1",
    setSelectedBody: vi.fn(),
  })),
}));

describe("BodySelector", () => {
  it("renders without crashing", () => {
    const { container } = render(<BodySelector />);
    expect(container).toBeTruthy();
  });
});
