import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useKeyboardShortcuts } from "../useKeyboardShortcuts";

describe("useKeyboardShortcuts", () => {
  const mockHandlers = {
    onUndo: vi.fn(),
    onRedo: vi.fn(),
    onDuplicate: vi.fn(),
    onDelete: vi.fn(),
    onCopy: vi.fn(),
    onPaste: vi.fn(),
    onSelectAll: vi.fn(),
    onDeselect: vi.fn(),
    onMoveUp: vi.fn(),
    onMoveDown: vi.fn(),
    onMoveLeft: vi.fn(),
    onMoveRight: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes without crashing", () => {
    const { result } = renderHook(() => useKeyboardShortcuts(mockHandlers));
    expect(result).toBeTruthy();
  });

  it("sets up keyboard event listeners", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    renderHook(() => useKeyboardShortcuts(mockHandlers));
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );
  });

  it("cleans up event listeners on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useKeyboardShortcuts(mockHandlers));
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );
  });
});
