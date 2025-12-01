import { memo } from "react";
import type { Body } from "@/data";

interface BodyRendererProps {
  body: Body;
  className?: string;
}

/**
 * Component to render a body (either from SVG path or React element)
 * Supports both legacy React SVG elements and new SVG file paths
 */
export const BodyRenderer = memo<BodyRendererProps>(({ body, className }) => {
  // If body has a React SVG element, use it
  if (body.svg) {
    return <g className={className}>{body.svg}</g>;
  }

  // If body has an SVG path, use a scaled group with nested SVG
  // This works both in Canvas (centered at 0,0) and in preview (with translate)
  if (body.svgPath) {
    return (
      <g className={className}>
        <image
          href={body.svgPath}
          xlinkHref={body.svgPath}
          x="-200"
          y="-200"
          width="400"
          height="400"
          preserveAspectRatio="xMidYMid meet"
          data-svg-path={body.svgPath}
        />
      </g>
    );
  }

  // No body to render
  return null;
});

BodyRenderer.displayName = "BodyRenderer";
