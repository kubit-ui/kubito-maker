import { useEffect } from "react";

/**
 * Configuration for keyboard shortcuts
 */
export interface KeyboardShortcutsConfig {
  onUndo?: () => void;
  onRedo?: () => void;
  onSelectAll?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onArrowMove?: (
    direction: "left" | "right" | "up" | "down",
    step: number,
  ) => void;
  enabled?: boolean;
}

/**
 * Helper to detect if user is typing in an input field
 */
const isTyping = (): boolean => {
  const activeElement = document.activeElement;
  return (
    activeElement instanceof HTMLInputElement ||
    activeElement instanceof HTMLTextAreaElement ||
    (activeElement as HTMLElement)?.isContentEditable
  );
};

/**
 * Helper to detect platform (Mac vs Windows/Linux)
 */
const isMacPlatform = (): boolean => {
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
};

/**
 * Custom hook to handle keyboard shortcuts for the editor
 *
 * Supports:
 * - Undo/Redo (Cmd/Ctrl + Z, Cmd/Ctrl + Shift + Z)
 * - Select All (Cmd/Ctrl + A)
 * - Copy/Paste (Cmd/Ctrl + C/V)
 * - Delete (Delete/Backspace)
 * - Duplicate (Cmd/Ctrl + D)
 * - Arrow keys movement (with Shift for 10x speed)
 *
 * @param config - Configuration object with callback functions
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts({
 *   onUndo: () => console.log('Undo'),
 *   onRedo: () => console.log('Redo'),
 *   onArrowMove: (direction, step) => console.log(`Move ${direction} by ${step}px`),
 * });
 * ```
 */
export const useKeyboardShortcuts = (config: KeyboardShortcutsConfig) => {
  const {
    onUndo,
    onRedo,
    onSelectAll,
    onCopy,
    onPaste,
    onDelete,
    onDuplicate,
    onArrowMove,
    enabled = true,
  } = config;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = isMacPlatform();
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo (Cmd/Ctrl + Z)
      if (cmdOrCtrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        onUndo?.();
        return;
      }

      // Redo (Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y)
      if (
        (cmdOrCtrl && e.shiftKey && e.key === "z") ||
        (cmdOrCtrl && e.key === "y")
      ) {
        e.preventDefault();
        onRedo?.();
        return;
      }

      // Select All (Cmd/Ctrl + A)
      if (cmdOrCtrl && e.key === "a" && !isTyping()) {
        e.preventDefault();
        onSelectAll?.();
        return;
      }

      // Copy (Cmd/Ctrl + C)
      if (cmdOrCtrl && e.key === "c" && !isTyping()) {
        e.preventDefault();
        onCopy?.();
        return;
      }

      // Paste (Cmd/Ctrl + V)
      if (cmdOrCtrl && e.key === "v" && !isTyping()) {
        e.preventDefault();
        onPaste?.();
        return;
      }

      // Delete (Delete/Backspace)
      if ((e.key === "Delete" || e.key === "Backspace") && !isTyping()) {
        e.preventDefault();
        onDelete?.();
        return;
      }

      // Duplicate (Cmd/Ctrl + D)
      if (cmdOrCtrl && e.key === "d" && !isTyping()) {
        e.preventDefault();
        onDuplicate?.();
        return;
      }

      // Arrow keys for movement
      if (!isTyping() && onArrowMove) {
        const step = e.shiftKey ? 10 : 1;
        let direction: "left" | "right" | "up" | "down" | null = null;

        if (e.key === "ArrowLeft") {
          direction = "left";
        } else if (e.key === "ArrowRight") {
          direction = "right";
        } else if (e.key === "ArrowUp") {
          direction = "up";
        } else if (e.key === "ArrowDown") {
          direction = "down";
        }

        if (direction) {
          e.preventDefault();
          onArrowMove(direction, step);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    onUndo,
    onRedo,
    onSelectAll,
    onCopy,
    onPaste,
    onDelete,
    onDuplicate,
    onArrowMove,
    enabled,
  ]);
};
