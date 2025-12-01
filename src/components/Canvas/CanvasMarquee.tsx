import { memo } from "react";

interface CanvasMarqueeProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
}

/**
 * Visual marquee selection rectangle shown when dragging on empty canvas
 * Renders as SVG elements to work within the canvas coordinate system
 */
export const CanvasMarquee = memo<CanvasMarqueeProps>(({ start, end }) => {
  // Calculate rectangle bounds
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  // Don't render if too small (less than 3 pixels)
  if (width < 3 || height < 3) return null;

  return (
    <g data-ui="marquee" pointerEvents="none">
      {/* Selection rectangle with dashed border */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="rgba(59, 130, 246, 0.1)"
        stroke="#3B82F6"
        strokeWidth={2}
        strokeDasharray="5 3"
        strokeLinecap="round"
      />

      {/* Corner indicators for better visibility */}
      <circle cx={x} cy={y} r={4} fill="#3B82F6" />
      <circle cx={x + width} cy={y} r={4} fill="#3B82F6" />
      <circle cx={x} cy={y + height} r={4} fill="#3B82F6" />
      <circle cx={x + width} cy={y + height} r={4} fill="#3B82F6" />

      {/* Size label */}
      <text
        x={x + width / 2}
        y={y - 8}
        textAnchor="middle"
        fill="#3B82F6"
        fontSize={12}
        fontWeight="600"
      >
        {Math.round(width)} × {Math.round(height)}
      </text>
    </g>
  );
});

CanvasMarquee.displayName = "CanvasMarquee";
