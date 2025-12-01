import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { TipsModal } from "../TipsModal";

describe("TipsModal", () => {
  it("renders when open", () => {
    const { container } = render(<TipsModal isOpen={true} onClose={vi.fn()} />);
    expect(container).toBeTruthy();
  });

  it("does not render when closed", () => {
    const { container } = render(
      <TipsModal isOpen={false} onClose={vi.fn()} />,
    );
    expect(container.textContent).toBe("");
  });
});
