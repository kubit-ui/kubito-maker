import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CanvasGuides } from "../CanvasGuides";

describe("CanvasGuides", () => {
  it("renders without guides", () => {
    const { container } = render(
      <svg>
        <CanvasGuides guides={[]} canvasWidth={720} canvasHeight={720} />
      </svg>,
    );
    expect(container).toBeTruthy();
  });

  it("renders with horizontal guide", () => {
    const { container } = render(
      <svg>
        <CanvasGuides
          guides={[{ type: "horizontal", position: 100, alignedItems: [] }]}
          canvasWidth={720}
          canvasHeight={720}
        />
      </svg>,
    );
    expect(container).toBeTruthy();
  });

  it("renders with vertical guide", () => {
    const { container } = render(
      <svg>
        <CanvasGuides
          guides={[{ type: "vertical", position: 100, alignedItems: [] }]}
          canvasWidth={720}
          canvasHeight={720}
        />
      </svg>,
    );
    expect(container).toBeTruthy();
  });
});
