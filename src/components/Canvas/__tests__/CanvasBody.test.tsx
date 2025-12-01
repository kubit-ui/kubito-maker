import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { CanvasBody } from "../CanvasBody";

vi.mock("@/store/editorStore", () => ({
  useEditorStore: vi.fn(() => ({
    selectedBody: "body-1",
  })),
}));

describe("CanvasBody", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <svg>
        <CanvasBody
          selectedBodyId="body-1"
          canvasWidth={720}
          canvasHeight={720}
        />
      </svg>,
    );
    expect(container).toBeTruthy();
  });
});
