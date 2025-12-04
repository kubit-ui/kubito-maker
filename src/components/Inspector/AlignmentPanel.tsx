import { memo } from "react";
import type { KubitoItem } from "@/types";
import { TransformService } from "@/domain/services/TransformService";

interface AlignmentPanelProps {
  item: KubitoItem;
  onUpdate: (updates: Partial<KubitoItem>) => void;
  onAlign: (
    type: "left" | "center" | "right" | "top" | "middle" | "bottom",
  ) => void;
}

/**
 * Alignment tools panel
 */
export const AlignmentPanel = memo<AlignmentPanelProps>(
  ({ item, onUpdate, onAlign }) => {
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Alignment
        </h4>

        {/* Align Horizontal */}
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => onAlign("left")}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs flex flex-col items-center gap-1"
            title="Align left"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h2v18H3V3zm4 4h10v4H7V7zm0 6h14v4H7v-4z" />
            </svg>
            <span className="text-[10px]">Left</span>
          </button>
          <button
            onClick={() => onAlign("center")}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs flex flex-col items-center gap-1"
            title="Center horizontal"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11 3h2v18h-2V3zm-4 4h10v4H7V7zm-2 6h14v4H5v-4z" />
            </svg>
            <span className="text-[10px]">Center</span>
          </button>
          <button
            onClick={() => onAlign("right")}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs flex flex-col items-center gap-1"
            title="Align right"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3h2v18h-2V3zM3 7h10v4H3V7zm0 6h14v4H3v-4z" />
            </svg>
            <span className="text-[10px]">Right</span>
          </button>
        </div>

        {/* Align Vertical */}
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => onAlign("top")}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs flex flex-col items-center gap-1"
            title="Align top"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h18v2H3V3zm4 4h4v10H7V7zm6 0h4v14h-4V7z" />
            </svg>
            <span className="text-[10px]">Top</span>
          </button>
          <button
            onClick={() => onAlign("middle")}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs flex flex-col items-center gap-1"
            title="Center vertical"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 11h18v2H3v-2zM7 3h4v18H7V3zm6 2h4v14h-4V5z" />
            </svg>
            <span className="text-[10px]">Middle</span>
          </button>
          <button
            onClick={() => onAlign("bottom")}
            className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs flex flex-col items-center gap-1"
            title="Align bottom"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 19h18v2H3v-2zM7 3h4v14H7V3zm6 0h4v10h-4V3z" />
            </svg>
            <span className="text-[10px]">Bottom</span>
          </button>
        </div>

        {/* Snap to Grid */}
        <button
          onClick={() => {
            const snappedPoint = TransformService.snapPointToGrid(
              item.x,
              item.y,
              10,
            );
            onUpdate(snappedPoint);
          }}
          className="w-full p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-xs flex items-center justify-center gap-2"
          title="Snap to grid (10px)"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
            />
          </svg>
          Snap to grid
        </button>
      </div>
    );
  },
);

AlignmentPanel.displayName = "AlignmentPanel";
