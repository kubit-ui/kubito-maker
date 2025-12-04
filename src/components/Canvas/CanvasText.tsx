import { useEffect, useRef, useState } from "react";
import type { TextItem } from "@/types";
import { useEditorActions } from "@/store/editorStore";

interface CanvasTextProps {
  textItem: TextItem;
  isSelected: boolean;
}

export function CanvasText({ textItem, isSelected }: CanvasTextProps) {
  const { updateText, toggleTextEditing, setSelectedId } = useEditorActions();
  const [editingContent, setEditingContent] = useState(textItem.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEditing = textItem.isEditing;

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!textItem.locked && !isEditing) {
      setSelectedId(textItem.id);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!textItem.locked) {
      toggleTextEditing(textItem.id, true);
      setEditingContent(textItem.content);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      updateText(textItem.id, editingContent);
      toggleTextEditing(textItem.id, false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditingContent(textItem.content); // Revert changes
      toggleTextEditing(textItem.id, false);
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleBlur();
    }
  };

  if (!textItem.visible) {
    return null;
  }

  const scaleX = textItem.scale * (textItem.flipX ? -1 : 1);
  const scaleY = textItem.scale * (textItem.flipY ? -1 : 1);

  // Split content into lines
  const lines = (textItem.content || "Double click to edit").split("\n");
  const lineHeightPx =
    textItem.settings.fontSize * textItem.settings.lineHeight;

  // Calculate text anchor based on alignment
  const textAnchor =
    textItem.settings.textAlign === "center"
      ? "middle"
      : textItem.settings.textAlign === "right"
        ? "end"
        : "start";

  // Calculate x offset based on alignment
  const textX =
    textItem.settings.textAlign === "center"
      ? textItem.width / 2
      : textItem.settings.textAlign === "right"
        ? textItem.width
        : 0;

  return (
    <>
      <g
        data-item-id={textItem.id}
        style={{
          cursor: isEditing ? "text" : "move",
          pointerEvents: textItem.locked ? "none" : "auto",
        }}
      >
        {/* Invisible rectangle for selection and dragging */}
        <rect
          x={textItem.x}
          y={textItem.y}
          width={textItem.width}
          height={Math.max(100, lines.length * lineHeightPx + 10)}
          fill="transparent"
          stroke={isSelected && !isEditing ? "#DF2B52" : "transparent"}
          strokeWidth={isSelected && !isEditing ? 2 : 0}
          strokeDasharray={isSelected && !isEditing ? "5,5" : undefined}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          style={{
            pointerEvents: isEditing ? "none" : "all",
          }}
        />

        {/* Always render text as SVG for proper export */}
        <g
          transform={`translate(${textItem.x}, ${textItem.y}) scale(${scaleX}, ${scaleY}) rotate(${textItem.rotate})`}
          style={{
            opacity: isEditing ? 0.3 : 1,
          }}
        >
          {lines.map((line, index) => (
            <text
              key={index}
              x={textX}
              y={textItem.settings.fontSize + index * lineHeightPx}
              fontFamily={textItem.settings.fontFamily}
              fontSize={textItem.settings.fontSize}
              fontWeight={textItem.settings.fontWeight}
              fontStyle={textItem.settings.italic ? "italic" : "normal"}
              textDecoration={textItem.settings.textDecoration}
              fill={textItem.settings.color}
              opacity={textItem.settings.opacity}
              letterSpacing={textItem.settings.letterSpacing}
              textAnchor={textAnchor}
              dominantBaseline="text-before-edge"
              style={{
                userSelect: "none",
                pointerEvents: "none",
              }}
            >
              {line || " "}
            </text>
          ))}
        </g>
      </g>

      {/* Editing overlay - outside SVG, won't be exported */}
      {isEditing && (
        <foreignObject
          x={textItem.x}
          y={textItem.y}
          width={textItem.width}
          height={Math.max(100, lines.length * lineHeightPx + 40)}
          style={{
            overflow: "visible",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              width: "100%",
              pointerEvents: "auto",
            }}
          >
            <textarea
              ref={textareaRef}
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              style={{
                fontFamily: textItem.settings.fontFamily,
                fontSize: `${textItem.settings.fontSize}px`,
                fontWeight: textItem.settings.fontWeight,
                color: textItem.settings.color,
                textAlign: textItem.settings.textAlign,
                fontStyle: textItem.settings.italic ? "italic" : "normal",
                lineHeight: textItem.settings.lineHeight,
                letterSpacing: `${textItem.settings.letterSpacing}px`,
                width: `${textItem.width}px`,
                border: "2px solid #DF2B52",
                outline: "none",
                background: "rgba(255, 255, 255, 0.95)",
                padding: "4px",
                resize: "both",
                minHeight: "40px",
                minWidth: "100px",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
              rows={editingContent.split("\n").length}
            />
          </div>
        </foreignObject>
      )}
    </>
  );
}
