import { memo } from "react";

export interface UserGuide {
  id: string;
  type: "horizontal" | "vertical";
  position: number; // pixels from top/left
}

interface CanvasUserGuidesProps {
  guides: UserGuide[];
  onGuideMove?: (id: string, position: number) => void;
  onGuideRemove?: (id: string) => void;
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * Draggable guide lines for precise alignment
 */
export const CanvasUserGuides = memo<CanvasUserGuidesProps>(
  ({ guides, onGuideRemove }) => {
    const handleDragStart = (e: React.DragEvent, guide: UserGuide) => {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("guide-id", guide.id);
    };

    const handleDoubleClick = (guide: UserGuide) => {
      if (onGuideRemove) {
        onGuideRemove(guide.id);
      }
    };

    return (
      <div className="absolute inset-0 pointer-events-none">
        {guides.map((guide) => {
          if (guide.type === "horizontal") {
            return (
              <div
                key={guide.id}
                className="absolute left-0 right-0 pointer-events-auto cursor-ns-resize group"
                style={{ top: `${guide.position}px`, height: "1px" }}
                draggable
                onDragStart={(e) => handleDragStart(e, guide)}
                onDoubleClick={() => handleDoubleClick(guide)}
              >
                {/* Guide line */}
                <div className="absolute inset-0 bg-cyan-500 dark:bg-cyan-400 opacity-70 group-hover:opacity-100" />
                {/* Hover area for easier grabbing */}
                <div className="absolute inset-0 -top-2 -bottom-2" />
                {/* Position label */}
                <div className="absolute left-2 -top-4 bg-cyan-500 dark:bg-cyan-400 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {Math.round(guide.position)}px
                  <span className="ml-2 text-[10px]">
                    (double-click to remove)
                  </span>
                </div>
              </div>
            );
          } else {
            return (
              <div
                key={guide.id}
                className="absolute top-0 bottom-0 pointer-events-auto cursor-ew-resize group"
                style={{ left: `${guide.position}px`, width: "1px" }}
                draggable
                onDragStart={(e) => handleDragStart(e, guide)}
                onDoubleClick={() => handleDoubleClick(guide)}
              >
                {/* Guide line */}
                <div className="absolute inset-0 bg-cyan-500 dark:bg-cyan-400 opacity-70 group-hover:opacity-100" />
                {/* Hover area for easier grabbing */}
                <div className="absolute inset-0 -left-2 -right-2" />
                {/* Position label */}
                <div className="absolute top-2 left-2 bg-cyan-500 dark:bg-cyan-400 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap transform -rotate-90 origin-top-left">
                  {Math.round(guide.position)}px
                  <span className="ml-2 text-[10px]">
                    (double-click to remove)
                  </span>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  },
);

CanvasUserGuides.displayName = "CanvasUserGuides";
