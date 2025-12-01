import { memo } from "react";
import type { Asset } from "@/types";

interface AssetRendererProps {
  asset: Asset;
  className?: string;
}

/**
 * Component to render an asset (either from SVG path or React element)
 * Supports both legacy React SVG elements and new SVG file paths
 */
export const AssetRenderer = memo<AssetRendererProps>(
  ({ asset, className }) => {
    // If asset has a React SVG element, use it
    if (asset.svg) {
      return <g className={className}>{asset.svg}</g>;
    }

    // If asset has an SVG path, use image element for display
    // (During export, these will be replaced with actual SVG content)
    if (asset.svgPath) {
      return (
        <image
          href={asset.svgPath}
          xlinkHref={asset.svgPath}
          x="-40"
          y="-40"
          width="80"
          height="80"
          preserveAspectRatio="xMidYMid meet"
          className={className}
          data-svg-path={asset.svgPath}
        />
      );
    }

    // No asset to render
    return null;
  },
);

AssetRenderer.displayName = "AssetRenderer";
