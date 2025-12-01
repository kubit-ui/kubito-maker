import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSmartGuides } from "../useSmartGuides";

describe("useSmartGuides", () => {
  it("initializes with empty guides", () => {
    const { result } = renderHook(() => useSmartGuides());
    expect(result.current.activeGuides).toEqual([]);
  });

  it("can set guides", () => {
    const { result } = renderHook(() => useSmartGuides());
    act(() => {
      result.current.setGuides([
        { type: "horizontal", position: 100 },
        { type: "vertical", position: 200 },
      ]);
    });
    expect(result.current.activeGuides).toHaveLength(2);
  });

  it("can clear guides", () => {
    const { result } = renderHook(() => useSmartGuides());
    act(() => {
      result.current.setGuides([{ type: "horizontal", position: 100 }]);
    });
    expect(result.current.activeGuides).toHaveLength(1);
    act(() => {
      result.current.clearGuides();
    });
    expect(result.current.activeGuides).toEqual([]);
  });
});
