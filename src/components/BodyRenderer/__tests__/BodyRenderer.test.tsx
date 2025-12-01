import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { BodyRenderer } from "../BodyRenderer";

vi.mock("@/store/editorStore", () => ({
  useEditorStore: vi.fn(() => ({
    setSelectedBody: vi.fn(),
  })),
}));

describe("BodyRenderer", () => {
  it("renders without crashing with svg element", () => {
    const mockBody = {
      id: "body-1",
      name: "Test Body",
      svg: <circle cx="0" cy="0" r="50" />,
    };

    const { container } = render(<BodyRenderer body={mockBody} />);
    expect(container).toBeTruthy();
  });

  it("renders without crashing with svgPath", () => {
    const mockBody = {
      id: "body-2",
      name: "Test Body Path",
      svgPath: "/assets/svg/bodies/body1.svg",
    };

    const { container } = render(<BodyRenderer body={mockBody} />);
    expect(container).toBeTruthy();
  });
});
