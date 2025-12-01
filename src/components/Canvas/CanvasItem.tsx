import { memo } from "react";
import type { KubitoItem } from "@/types";
import { AssetRenderer } from "../AssetRenderer";
import { findAssetByCategoryAndId } from "@/data";
import {
  transformToString,
  getFilterString,
  getShadowFilter,
} from "@/utils/transform";

interface CanvasItemProps {
  item: KubitoItem;
  isSelected: boolean;
  selectedId: string | null;
}

/**
 * Individual canvas item with transform handles
 */
export const CanvasItem = memo<CanvasItemProps>(
  ({ item, isSelected, selectedId }) => {
    const assetDef = findAssetByCategoryAndId(item.category, item.assetId);
    if (!assetDef) return null;

    const filterStr = getFilterString(item);
    const shadowStr = getShadowFilter(item);
    const combinedFilter = [filterStr, shadowStr].filter(Boolean).join(" ");

    // Calculate bounding box size (asset viewBox is 80x80)
    const assetSize = 80;
    const visualSize = assetSize * item.scale;
    const halfSize = visualSize / 2;

    // Fixed visual size for handles (independent of item scale)
    const handleSize = 8;
    const handleHitArea = 18;
    const rotateHandleDistance = halfSize + 20; // 20px outside the object
    const cornerOffset = halfSize * 0.85; // 85% of half size to be near the edge

    // Backgrounds should not block pointer events (allow click-through for deselection and marquee)
    const isBackground = item.category === "Backgrounds";
    const pointerEvents = isBackground ? "none" : "all";

    return (
      <>
        {/* Main item group with transformation */}
        <g
          data-item-id={item.id}
          transform={transformToString(item)}
          opacity={item.effects.opacity}
          style={{
            cursor: item.locked
              ? "not-allowed"
              : selectedId === item.id
                ? "grabbing"
                : "grab",
            pointerEvents,
            filter: combinedFilter || undefined,
          }}
        >
          <g
            fill={item.effects.color}
            stroke={item.effects.color}
            pointerEvents={pointerEvents}
          >
            <AssetRenderer asset={assetDef} />
          </g>
        </g>

        {/* Handles rendered outside transformation - fixed visual size */}
        {isSelected && !item.locked && (
          <g
            data-ui="handles"
            transform={`translate(${item.x}, ${item.y}) rotate(${item.rotate})`}
          >
            {/* Selection ring - scales with object */}
            <ellipse
              cx={0}
              cy={0}
              rx={halfSize + 5}
              ry={halfSize + 5}
              fill="none"
              stroke="#1f6feb"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              pointerEvents="none"
            />

            {/* Rotate handle - fixed size, positioned outside object */}
            <circle
              data-handle="rotate"
              data-item-id={item.id}
              cx={0}
              cy={-rotateHandleDistance}
              r={handleSize}
              fill="#fff"
              stroke="#1f6feb"
              strokeWidth={2.5}
              style={{ cursor: "grab" }}
              pointerEvents="all"
            />

            {/* Scale handles - fixed size, positioned at corners */}
            {[
              [-cornerOffset, -cornerOffset],
              [cornerOffset, -cornerOffset],
              [cornerOffset, cornerOffset],
              [-cornerOffset, cornerOffset],
            ].map(([cx, cy], idx) => {
              const cxVal = cx ?? 0;
              const cyVal = cy ?? 0;
              return (
                <g key={idx}>
                  {/* Invisible larger hit area */}
                  <circle
                    data-handle="scale"
                    data-item-id={item.id}
                    cx={cxVal}
                    cy={cyVal}
                    r={handleHitArea}
                    fill="transparent"
                    style={{ cursor: "nwse-resize" }}
                    pointerEvents="all"
                  />
                  {/* Visible handle - fixed size */}
                  <circle
                    cx={cxVal}
                    cy={cyVal}
                    r={handleSize}
                    fill="#fff"
                    stroke="#111"
                    strokeWidth={2}
                    pointerEvents="none"
                  />
                </g>
              );
            })}
          </g>
        )}
      </>
    );
  },
);

CanvasItem.displayName = "CanvasItem";
