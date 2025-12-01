import { memo } from "react";

interface CanvasGridProps {
  backgroundColor: string;
}

/**
 * Canvas background grid
 */
export const CanvasGrid = memo<CanvasGridProps>(({ backgroundColor }) => {
  return (
    <rect
      data-ui="grid"
      x="0"
      y="0"
      width="100%"
      height="100%"
      fill={backgroundColor}
    />
  );
});

CanvasGrid.displayName = "CanvasGrid";
