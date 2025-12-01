import { memo } from "react";
import type { Guide } from "@/utils/smartGuides";

interface CanvasGuidesProps {
  guides: Guide[];
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * Smart alignment guides overlay
 * Supports: vertical, horizontal, distance, angle, and spacing guides
 */
export const CanvasGuides = memo<CanvasGuidesProps>(
  ({ guides, canvasWidth, canvasHeight }) => {
    return (
      <>
        {guides.map((guide, i) => {
          // Vertical and Horizontal alignment guides
          if (guide.type === "vertical" || guide.type === "horizontal") {
            return (
              <line
                key={i}
                data-ui="guide"
                x1={guide.type === "vertical" ? guide.position : 0}
                y1={guide.type === "vertical" ? 0 : guide.position}
                x2={guide.type === "vertical" ? guide.position : canvasWidth}
                y2={guide.type === "vertical" ? canvasHeight : guide.position}
                stroke="#FF00FF"
                strokeWidth="1"
                strokeDasharray="5,5"
                opacity="0.8"
                pointerEvents="none"
              />
            );
          }

          // Distance measurement guides
          if (
            guide.type === "distance" &&
            guide.metadata?.startPoint &&
            guide.metadata?.endPoint
          ) {
            const { startPoint, endPoint, label } = guide.metadata;
            const midX = (startPoint.x + endPoint.x) / 2;
            const midY = (startPoint.y + endPoint.y) / 2;

            return (
              <g key={i} data-ui="distance-guide">
                {/* Distance line */}
                <line
                  x1={startPoint.x}
                  y1={startPoint.y}
                  x2={endPoint.x}
                  y2={endPoint.y}
                  stroke="#3b82f6"
                  strokeWidth="1"
                  pointerEvents="none"
                />
                {/* End caps */}
                <line
                  x1={startPoint.x}
                  y1={startPoint.y - 5}
                  x2={startPoint.x}
                  y2={startPoint.y + 5}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  pointerEvents="none"
                />
                <line
                  x1={endPoint.x}
                  y1={endPoint.y - 5}
                  x2={endPoint.x}
                  y2={endPoint.y + 5}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  pointerEvents="none"
                />
                {/* Label */}
                {label && (
                  <text
                    x={midX}
                    y={midY - 5}
                    fill="#3b82f6"
                    fontSize="11"
                    fontWeight="600"
                    textAnchor="middle"
                    pointerEvents="none"
                    className="select-none"
                  >
                    {label}
                  </text>
                )}
              </g>
            );
          }

          // Spacing guides
          if (
            guide.type === "spacing" &&
            guide.metadata?.startPoint &&
            guide.metadata?.endPoint
          ) {
            const { startPoint, endPoint, label } = guide.metadata;
            const midX = (startPoint.x + endPoint.x) / 2;
            const midY = (startPoint.y + endPoint.y) / 2;

            return (
              <g key={i} data-ui="spacing-guide">
                {/* Spacing line */}
                <line
                  x1={startPoint.x}
                  y1={startPoint.y}
                  x2={endPoint.x}
                  y2={endPoint.y}
                  stroke="#10b981"
                  strokeWidth="1"
                  strokeDasharray="3,3"
                  pointerEvents="none"
                />
                {/* Label with background */}
                {label && (
                  <>
                    <rect
                      x={midX - 20}
                      y={midY - 10}
                      width="40"
                      height="16"
                      fill="#10b981"
                      fillOpacity="0.9"
                      rx="3"
                      pointerEvents="none"
                    />
                    <text
                      x={midX}
                      y={midY + 4}
                      fill="white"
                      fontSize="10"
                      fontWeight="600"
                      textAnchor="middle"
                      pointerEvents="none"
                      className="select-none"
                    >
                      {label}
                    </text>
                  </>
                )}
              </g>
            );
          }

          // Angle guides
          if (guide.type === "angle" && guide.metadata?.angle !== undefined) {
            return (
              <g key={i} data-ui="angle-guide">
                <text
                  x={canvasWidth / 2}
                  y={20}
                  fill="#f59e0b"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                  pointerEvents="none"
                  className="select-none"
                >
                  {guide.metadata.label || `${guide.metadata.angle}°`}
                </text>
              </g>
            );
          }

          return null;
        })}
      </>
    );
  },
);

CanvasGuides.displayName = "CanvasGuides";
