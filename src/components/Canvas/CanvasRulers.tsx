import { memo, useState } from "react";
import { RULER_SIZE, TICK_SMALL, TICK_MEDIUM, TICK_LARGE } from "./constants";

export interface UserGuide {
  id: string;
  type: "horizontal" | "vertical";
  position: number;
}

interface CanvasRulersProps {
  width: number;
  height: number;
  userGuides: UserGuide[];
  onGuideCreate?: (type: "horizontal" | "vertical", position: number) => void;
  onGuideMove?: (id: string, position: number) => void;
  onGuideRemove?: (id: string) => void;
}

/**
 * Canvas rulers with measurement marks and user guides
 */
export const CanvasRulers = memo<CanvasRulersProps>(
  ({
    width,
    height,
    userGuides,
    onGuideCreate,
    onGuideMove,
    onGuideRemove,
  }) => {
    const [draggingGuide, setDraggingGuide] = useState<string | null>(null);

    const handleHorizontalRulerClick = (e: React.MouseEvent<SVGSVGElement>) => {
      if (!onGuideCreate) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      onGuideCreate("vertical", x);
    };

    const handleVerticalRulerClick = (e: React.MouseEvent<SVGSVGElement>) => {
      if (!onGuideCreate) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const y = e.clientY - rect.top;
      onGuideCreate("horizontal", y);
    };

    const handleGuideMouseDown = (e: React.MouseEvent, guideId: string) => {
      e.stopPropagation();
      setDraggingGuide(guideId);
    };

    const handleGuideDoubleClick = (e: React.MouseEvent, guideId: string) => {
      e.stopPropagation();
      if (onGuideRemove) {
        onGuideRemove(guideId);
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!draggingGuide || !onGuideMove) return;

      const guide = userGuides.find((g) => g.id === draggingGuide);
      if (!guide) return;

      // Get the position relative to the canvas
      const canvasElement = e.currentTarget;
      const rect = canvasElement.getBoundingClientRect();

      if (guide.type === "horizontal") {
        const y = e.clientY - rect.top;
        onGuideMove(draggingGuide, y);
      } else {
        const x = e.clientX - rect.left;
        onGuideMove(draggingGuide, x);
      }
    };

    const handleMouseUp = () => {
      setDraggingGuide(null);
    };

    const verticalGuides = userGuides.filter((g) => g.type === "vertical");
    const horizontalGuides = userGuides.filter((g) => g.type === "horizontal");

    return (
      <div
        className="pointer-events-auto"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Horizontal Ruler (Top) */}
        <div
          className="absolute left-0 right-0 top-0 select-none border-b border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
          style={{ height: `${RULER_SIZE}px`, marginLeft: `${RULER_SIZE}px` }}
        >
          <svg
            width={width}
            height={RULER_SIZE}
            onClick={handleHorizontalRulerClick}
            className="cursor-crosshair"
          >
            {Array.from({ length: Math.ceil(width / TICK_SMALL) }).map(
              (_, i) => {
                const x = i * TICK_SMALL;
                const isLarge = x % TICK_LARGE === 0;
                const isMedium = x % TICK_MEDIUM === 0;

                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={RULER_SIZE}
                      x2={x}
                      y2={
                        isLarge
                          ? RULER_SIZE - 10
                          : isMedium
                            ? RULER_SIZE - 6
                            : RULER_SIZE - 3
                      }
                      stroke="currentColor"
                      strokeWidth={isLarge ? 1.5 : 1}
                      className="text-gray-400 dark:text-gray-500"
                    />
                    {isLarge && x > 0 && (
                      <text
                        x={x + 2}
                        y={10}
                        fontSize="9"
                        className="fill-gray-600 dark:fill-gray-400"
                      >
                        {x}
                      </text>
                    )}
                  </g>
                );
              },
            )}
            {/* Vertical guides markers on horizontal ruler */}
            {verticalGuides.map((guide) => (
              <g key={guide.id}>
                <line
                  x1={guide.position}
                  y1={0}
                  x2={guide.position}
                  y2={RULER_SIZE}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  className="cursor-move"
                  onMouseDown={(e) =>
                    handleGuideMouseDown(
                      e as unknown as React.MouseEvent,
                      guide.id,
                    )
                  }
                  onDoubleClick={(e) =>
                    handleGuideDoubleClick(
                      e as unknown as React.MouseEvent,
                      guide.id,
                    )
                  }
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Vertical Ruler (Left) */}
        <div
          className="absolute bottom-0 left-0 top-0 select-none border-r border-gray-300 bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
          style={{ width: `${RULER_SIZE}px`, marginTop: `${RULER_SIZE}px` }}
        >
          <svg
            width={RULER_SIZE}
            height={height}
            onClick={handleVerticalRulerClick}
            className="cursor-crosshair"
          >
            {Array.from({ length: Math.ceil(height / TICK_SMALL) }).map(
              (_, i) => {
                const y = i * TICK_SMALL;
                const isLarge = y % TICK_LARGE === 0;
                const isMedium = y % TICK_MEDIUM === 0;

                return (
                  <g key={i}>
                    <line
                      x1={RULER_SIZE}
                      y1={y}
                      x2={
                        isLarge
                          ? RULER_SIZE - 10
                          : isMedium
                            ? RULER_SIZE - 6
                            : RULER_SIZE - 3
                      }
                      y2={y}
                      stroke="currentColor"
                      strokeWidth={isLarge ? 1.5 : 1}
                      className="text-gray-400 dark:text-gray-500"
                    />
                    {isLarge && y > 0 && (
                      <text
                        x={3}
                        y={y - 2}
                        fontSize="9"
                        className="fill-gray-600 dark:fill-gray-400"
                        transform={`rotate(-90 3 ${y - 2})`}
                      >
                        {y}
                      </text>
                    )}
                  </g>
                );
              },
            )}
            {/* Horizontal guides markers on vertical ruler */}
            {horizontalGuides.map((guide) => (
              <g key={guide.id}>
                <line
                  x1={0}
                  y1={guide.position}
                  x2={RULER_SIZE}
                  y2={guide.position}
                  stroke="#3b82f6"
                  strokeWidth="2"
                  className="cursor-move"
                  onMouseDown={(e) =>
                    handleGuideMouseDown(
                      e as unknown as React.MouseEvent,
                      guide.id,
                    )
                  }
                  onDoubleClick={(e) =>
                    handleGuideDoubleClick(
                      e as unknown as React.MouseEvent,
                      guide.id,
                    )
                  }
                />
              </g>
            ))}
          </svg>
        </div>

        {/* Corner box */}
        <div
          className="absolute left-0 top-0 border-b border-r border-gray-300 bg-gray-200 dark:border-gray-600 dark:bg-gray-700"
          style={{ width: `${RULER_SIZE}px`, height: `${RULER_SIZE}px` }}
        >
          <svg
            width={RULER_SIZE}
            height={RULER_SIZE}
            viewBox="0 0 20 20"
            className="text-gray-500 dark:text-gray-400"
          >
            <path
              d="M3 3L17 17M3 17L17 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    );
  },
);

CanvasRulers.displayName = "CanvasRulers";
