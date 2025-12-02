import { memo } from 'react';
import type { UserGuide } from './CanvasRulers';

interface CanvasUserGuidesProps {
  guides: UserGuide[];
  canvasWidth: number;
  canvasHeight: number;
  onGuideMove?: (id: string, position: number) => void;
  onGuideRemove?: (id: string) => void;
}

/**
 * User-created guides overlay on the canvas
 * These are persistent guidelines that users can create from rulers
 */
export const CanvasUserGuides = memo<CanvasUserGuidesProps>(
  ({ guides, canvasWidth, canvasHeight, onGuideRemove }) => {
    const handleDoubleClick = (guideId: string) => {
      if (onGuideRemove) {
        onGuideRemove(guideId);
      }
    };

    return (
      <>
        {guides.map((guide) => (
          <g key={guide.id} data-ui="user-guide">
            <line
              x1={guide.type === 'vertical' ? guide.position : 0}
              y1={guide.type === 'vertical' ? 0 : guide.position}
              x2={guide.type === 'vertical' ? guide.position : canvasWidth}
              y2={guide.type === 'vertical' ? canvasHeight : guide.position}
              stroke="#3b82f6"
              strokeWidth="1"
              strokeDasharray="8,4"
              opacity="0.6"
              className="cursor-move hover:opacity-100"
              onDoubleClick={() => handleDoubleClick(guide.id)}
            />
            <title>Double click to delete</title>
          </g>
        ))}
      </>
    );
  }
);

CanvasUserGuides.displayName = 'CanvasUserGuides';
