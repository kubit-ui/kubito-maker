import { memo, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  snapPoints?: number[]; // Percentages of screen height (e.g., [0.3, 0.6, 0.9])
  defaultSnapPoint?: number; // Index of default snap point
  showHandle?: boolean;
  className?: string;
}

export const BottomSheet = memo<BottomSheetProps>(
  ({
    isOpen,
    onClose,
    title,
    children,
    snapPoints = [0.4, 0.75, 0.95],
    defaultSnapPoint = 1,
    showHandle = true,
    className = "",
  }) => {
    const [currentSnapIndex, setCurrentSnapIndex] = useState(defaultSnapPoint);
    const [isDragging, setIsDragging] = useState(false);
    const sheetRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = usePrefersReducedMotion();

    // Calculate height based on snap point
    const currentHeight = (snapPoints[currentSnapIndex] ?? 0.75) * 100;

    // Handle drag end
    const handleDragEnd = (
      _event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo,
    ) => {
      setIsDragging(false);
      const velocity = info.velocity.y;
      const offset = info.offset.y;

      // If dragging down with high velocity or far enough, close
      if (velocity > 500 || offset > 150) {
        onClose();
        return;
      }

      // If dragging up with high velocity or far enough, go to next snap point
      if (velocity < -500 || offset < -150) {
        if (currentSnapIndex < snapPoints.length - 1) {
          setCurrentSnapIndex(currentSnapIndex + 1);
        }
        return;
      }

      // Otherwise, snap to nearest point based on current position
      const currentSnapPoint = snapPoints[currentSnapIndex] ?? 0.75;
      const currentHeightPx = window.innerHeight * currentSnapPoint;
      const newHeightPx = currentHeightPx - offset;
      const newHeightPercent = newHeightPx / window.innerHeight;

      // Find closest snap point
      let closestIndex = 0;
      let closestDistance = Math.abs((snapPoints[0] ?? 0.4) - newHeightPercent);

      snapPoints.forEach((point, index) => {
        const distance = Math.abs(point - newHeightPercent);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setCurrentSnapIndex(closestIndex);
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
              className="fixed inset-0 bg-black/50 z-[50] backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Bottom Sheet */}
            <motion.div
              ref={sheetRef}
              initial={{ y: "100%" }}
              animate={{ y: `${100 - currentHeight}%` }}
              exit={{ y: "100%" }}
              transition={{
                type: prefersReducedMotion ? "tween" : "spring",
                damping: 30,
                stiffness: 300,
                duration: prefersReducedMotion ? 0.2 : undefined,
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.1, bottom: 0.2 }}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              className={`
                fixed bottom-0 left-0 right-0 z-[60]
                bg-white dark:bg-gray-900
                rounded-t-3xl shadow-2xl
                flex flex-col
                touch-none
                ${isDragging ? "cursor-grabbing" : ""}
                ${className}
              `}
              style={{
                height: `${currentHeight}vh`,
                maxHeight: "95vh",
              }}
            >
              {/* Drag Handle */}
              {showHandle && (
                <div className="flex-shrink-0 pt-3 pb-2 px-4 flex flex-col items-center gap-1">
                  <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full cursor-grab active:cursor-grabbing" />
                  {title && (
                    <div className="w-full flex items-center justify-between mt-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {title}
                      </h3>
                      <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Close"
                      >
                        <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain px-1">
                <div className="px-3 pb-safe">{children}</div>
              </div>

              {/* Snap point indicators */}
              <div className="flex-shrink-0 flex justify-center gap-1.5 pb-3">
                {snapPoints.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSnapIndex(index)}
                    className={`
                      w-2 h-2 rounded-full transition-all
                      ${
                        index === currentSnapIndex
                          ? "bg-gray-900 dark:bg-white w-6"
                          : "bg-gray-300 dark:bg-gray-600"
                      }
                    `}
                    aria-label={`Snap to position ${index + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  },
);

BottomSheet.displayName = "BottomSheet";
