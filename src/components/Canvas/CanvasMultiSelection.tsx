import { memo } from "react";
import type { KubitoItem } from "@/types";

interface CanvasMultiSelectionProps {
  items: KubitoItem[];
  selectedIds: string[];
}

/**
 * Visual indicator for multiple selected items
 * Shows a bounding box around all selected items with transform handles
 */
export const CanvasMultiSelection = memo<CanvasMultiSelectionProps>(
  ({ items, selectedIds }) => {
    // Only show if multiple items are selected
    if (selectedIds.length <= 1) return null;

    const selectedItems = items.filter((item) => selectedIds.includes(item.id));

    if (selectedItems.length === 0) return null;

    // Calculate bounding box for all selected items
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    selectedItems.forEach((item) => {
      const size = 70 * item.scale; // Approximate size of each item
      const halfSize = size / 2;

      minX = Math.min(minX, item.x - halfSize);
      minY = Math.min(minY, item.y - halfSize);
      maxX = Math.max(maxX, item.x + halfSize);
      maxY = Math.max(maxY, item.y + halfSize);
    });

    const width = maxX - minX;
    const height = maxY - minY;
    const centerX = (minX + maxX) / 2;

    // Add padding
    const padding = 20;
    const boxX = minX - padding;
    const boxY = minY - padding;
    const boxWidth = width + padding * 2;
    const boxHeight = height + padding * 2;

    return (
      <g data-ui data-multi-selection>
        {/* Bounding box rectangle */}
        <rect
          x={boxX}
          y={boxY}
          width={boxWidth}
          height={boxHeight}
          fill="none"
          stroke="#1f6feb"
          strokeWidth={2}
          strokeDasharray="5 5"
          pointerEvents="none"
        />

        {/* Corner resize handles */}
        {[
          [boxX, boxY],
          [boxX + boxWidth, boxY],
          [boxX + boxWidth, boxY + boxHeight],
          [boxX, boxY + boxHeight],
        ].map(([cx, cy], idx) => (
          <g key={idx}>
            {/* Invisible larger hit area */}
            <rect
              data-handle="scale"
              data-item-id={selectedIds[0]}
              x={(cx ?? 0) - 12}
              y={(cy ?? 0) - 12}
              width={24}
              height={24}
              fill="transparent"
              style={{ cursor: "nwse-resize" }}
              pointerEvents="all"
            />
            {/* Visible handle */}
            <rect
              x={(cx ?? 0) - 6}
              y={(cy ?? 0) - 6}
              width={12}
              height={12}
              fill="#fff"
              stroke="#1f6feb"
              strokeWidth={2}
              pointerEvents="none"
            />
          </g>
        ))}

        {/* Rotate handle at top center */}
        <g>
          <line
            x1={centerX}
            y1={boxY}
            x2={centerX}
            y2={boxY - 30}
            stroke="#1f6feb"
            strokeWidth={2}
            pointerEvents="none"
          />
          <circle
            data-handle="rotate"
            data-item-id={selectedIds[0]}
            cx={centerX}
            cy={boxY - 30}
            r={10}
            fill="#fff"
            stroke="#1f6feb"
            strokeWidth={2.5}
            style={{ cursor: "grab" }}
            pointerEvents="all"
          />
        </g>

        {/* Selection count badge */}
        <g transform={`translate(${boxX + boxWidth + 10}, ${boxY - 10})`}>
          <rect
            x={0}
            y={0}
            width={30}
            height={20}
            rx={4}
            fill="#1f6feb"
            pointerEvents="none"
          />
          <text
            x={15}
            y={14}
            fontSize={12}
            fontWeight="bold"
            fill="#fff"
            textAnchor="middle"
            pointerEvents="none"
          >
            {selectedIds.length}
          </text>
        </g>
      </g>
    );
  },
);

CanvasMultiSelection.displayName = "CanvasMultiSelection";
