import { memo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface ContextMenuItem {
  id: string;
  label: string;
  icon?: string | React.ReactNode;
  shortcut?: string;
  disabled?: boolean;
  separator?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

interface ContextMenuProps {
  isOpen: boolean;
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

/**
 * Context menu that appears on right-click
 */
export const ContextMenu = memo<ContextMenuProps>(
  ({ isOpen, x, y, items, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!isOpen) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      document.addEventListener("keydown", handleEscape);

      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }, [isOpen, onClose]);

    // Adjust position if menu would go off-screen
    useEffect(() => {
      if (!isOpen || !menuRef.current) return;

      const menu = menuRef.current;
      const rect = menu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = x;
      let adjustedY = y;

      // Adjust X if menu goes beyond right edge
      if (rect.right > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }

      // Adjust Y if menu goes beyond bottom edge
      if (rect.bottom > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }

      if (adjustedX !== x || adjustedY !== y) {
        menu.style.left = `${adjustedX}px`;
        menu.style.top = `${adjustedY}px`;
      }
    }, [isOpen, x, y]);

    const handleItemClick = (item: ContextMenuItem) => {
      if (item.disabled) return;
      item.onClick?.();
      onClose();
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            data-context-menu
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="fixed z-[9999] min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 py-1"
            style={{ left: x, top: y }}
          >
            {items.map((item, index) => {
              if (item.separator) {
                return (
                  <div
                    key={`separator-${index}`}
                    className="h-px bg-gray-200 dark:bg-gray-700 my-1"
                  />
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={`w-full text-left px-4 py-2 flex items-center justify-between gap-3 transition-colors ${
                    item.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : item.danger
                        ? "hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 flex-1">
                    {item.icon && (
                      <span className="text-base flex items-center">
                        {item.icon}
                      </span>
                    )}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  {item.shortcut && (
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                      {item.shortcut}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    );
  },
);

ContextMenu.displayName = "ContextMenu";
