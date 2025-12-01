import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CanvasGrid } from "../CanvasGrid";

describe("CanvasGrid", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <svg>
        <CanvasGrid backgroundColor="#ffffff" />
      </svg>,
    );
    expect(container).toBeTruthy();
  });

  it("renders with correct background color", () => {
    const { container } = render(
      <svg>
        <CanvasGrid backgroundColor="#ff0000" />
      </svg>,
    );
    const rect = container.querySelector("rect");
    expect(rect?.getAttribute("fill")).toBe("#ff0000");
  });
});
