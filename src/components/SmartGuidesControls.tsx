import { memo } from 'react';
import {
  Settings,
  Crosshair,
  Grid3x3,
  RotateCw,
  Move,
  Ruler,
  Triangle,
  ArrowLeftRight,
  ArrowUpDown,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { SnapConfig } from '@/utils/smartGuides';

interface SmartGuidesControlsProps {
  config: SnapConfig;
  showRulers: boolean;
  onConfigChange: (config: Partial<SnapConfig>) => void;
  onToggleRulers: () => void;
  onDistributeHorizontal?: () => void;
  onDistributeVertical?: () => void;
}

/**
 * Smart Guides Configuration Panel
 * Provides controls for snapping, measurements, and guide visibility
 */
export const SmartGuidesControls = memo<SmartGuidesControlsProps>(
  ({
    config,
    showRulers,
    onConfigChange,
    onToggleRulers,
    onDistributeHorizontal,
    onDistributeVertical,
  }) => {
    return (
      <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-lg dark:border-gray-600 dark:bg-gray-800">
        <div className="mb-3 flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold">Smart Guides</h3>
        </div>

        {/* Main toggle */}
        <div className="mb-4 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <Crosshair className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span>Enable snapping</span>
          </label>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={(e) => onConfigChange({ enabled: e.target.checked })}
            className="h-4 w-4 rounded"
          />
        </div>

        {config.enabled && (
          <>
            {/* Snap options */}
            <div className="mb-4 space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">
              <h4 className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                Snap to:
              </h4>

              <label className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Grid3x3 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  Edges and centers
                </span>
                <input
                  type="checkbox"
                  checked={config.snapToEdges && config.snapToCenters}
                  onChange={(e) =>
                    onConfigChange({
                      snapToEdges: e.target.checked,
                      snapToCenters: e.target.checked,
                    })
                  }
                  className="h-3 w-3 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <RotateCw className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  Magnetic angles
                </span>
                <input
                  type="checkbox"
                  checked={config.snapToAngles}
                  onChange={(e) =>
                    onConfigChange({ snapToAngles: e.target.checked })
                  }
                  className="h-3 w-3 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Move className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  Smart spacing
                </span>
                <input
                  type="checkbox"
                  checked={config.snapToSpacing}
                  onChange={(e) =>
                    onConfigChange({ snapToSpacing: e.target.checked })
                  }
                  className="h-3 w-3 rounded"
                />
              </label>
            </div>

            {/* Measurement options */}
            <div className="mb-4 space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">
              <h4 className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
                Show measurements:
              </h4>

              <label className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  Distances
                </span>
                <input
                  type="checkbox"
                  checked={config.showDistanceMeasurements}
                  onChange={(e) =>
                    onConfigChange({
                      showDistanceMeasurements: e.target.checked,
                    })
                  }
                  className="h-3 w-3 rounded"
                />
              </label>

              <label className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Triangle className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  Angles
                </span>
                <input
                  type="checkbox"
                  checked={config.showAngleMeasurements}
                  onChange={(e) =>
                    onConfigChange({ showAngleMeasurements: e.target.checked })
                  }
                  className="h-3 w-3 rounded"
                />
              </label>
            </div>

            {/* Threshold controls */}
            <div className="mb-4 space-y-3 border-t border-gray-200 pt-3 dark:border-gray-700">
              <div>
                <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">
                  Snap threshold: {config.snapThreshold}px
                </label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={config.snapThreshold}
                  onChange={(e) =>
                    onConfigChange({ snapThreshold: Number(e.target.value) })
                  }
                  className="w-full"
                />
              </div>

              {config.snapToAngles && (
                <div>
                  <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">
                    Angle threshold: {config.angleSnapThreshold}°
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    value={config.angleSnapThreshold}
                    onChange={(e) =>
                      onConfigChange({
                        angleSnapThreshold: Number(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </>
        )}

        {/* Rulers toggle */}
        <div className="mb-4 border-t border-gray-200 pt-3 dark:border-gray-700">
          <button
            onClick={onToggleRulers}
            className={`flex w-full items-center justify-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
              showRulers
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
            }`}
          >
            {showRulers ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Rulers
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Show Rulers
              </>
            )}
          </button>
        </div>

        {/* Distribution actions */}
        {(onDistributeHorizontal || onDistributeVertical) && (
          <div className="space-y-2 border-t border-gray-200 pt-3 dark:border-gray-700">
            <h4 className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-400">
              Distribute selection:
            </h4>

            {onDistributeHorizontal && (
              <button
                onClick={onDistributeHorizontal}
                className="flex w-full items-center justify-center gap-2 rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <ArrowLeftRight className="h-4 w-4" />
                Horizontal
              </button>
            )}

            {onDistributeVertical && (
              <button
                onClick={onDistributeVertical}
                className="flex w-full items-center justify-center gap-2 rounded bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <ArrowUpDown className="h-4 w-4" />
                Vertical
              </button>
            )}
          </div>
        )}
      </div>
    );
  }
);

SmartGuidesControls.displayName = 'SmartGuidesControls';
