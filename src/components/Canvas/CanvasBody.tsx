import { memo } from "react";
import { bodies } from "@/data";
import { BodyRenderer } from "../BodyRenderer";

interface CanvasBodyProps {
  selectedBodyId: string;
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * Kubito base character body
 */
export const CanvasBody = memo<CanvasBodyProps>(
  ({ selectedBodyId, canvasWidth, canvasHeight }) => {
    const selectedBody =
      bodies.find((b) => b.id === selectedBodyId) || bodies[0];

    if (!selectedBody) return null;

    // Calculate scale based on canvas size
    // Body SVG is approximately 394x364px
    // For standard 720px canvas, scale is ~1.0
    // For emoji 128px canvas, scale should be ~0.28
    const baseBodyWidth = 394;
    const baseBodyHeight = 364;

    // Calculate scale factor to fit body in canvas
    // Use 0.8 as max scale to leave some margin
    const scaleX = (canvasWidth * 0.8) / baseBodyWidth;
    const scaleY = (canvasHeight * 0.8) / baseBodyHeight;
    const scale = Math.min(scaleX, scaleY, 1.0); // Cap at 1.0 for large canvases

    return (
      <g
        transform={`translate(${canvasWidth / 2}, ${canvasHeight / 2}) scale(${scale})`}
        id="kubito-base"
        style={{ pointerEvents: "none" }}
      >
        <BodyRenderer body={selectedBody} />
      </g>
    );
  },
);

CanvasBody.displayName = "CanvasBody";
