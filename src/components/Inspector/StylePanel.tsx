import { memo } from "react";
import type { KubitoItem } from "@/types";

interface StylePanelProps {
  item: KubitoItem;
  onUpdate: (updates: Partial<KubitoItem>) => void;
}

/**
 * Visual effects panel (opacity, shadows, filters)
 */
export const StylePanel = memo<StylePanelProps>(({ item, onUpdate }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Effects
      </h4>

      {/* Opacity */}
      <div>
        <label className="text-xs text-gray-600 dark:text-gray-400">
          Opacity
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={item.effects.opacity}
          onChange={(e) =>
            onUpdate({
              effects: {
                ...item.effects,
                opacity: Number(e.target.value),
              },
            })
          }
          className="w-full"
        />
        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
          {Math.round(item.effects.opacity * 100)}%
        </div>
      </div>

      {/* Shadow Blur */}
      <div>
        <label className="text-xs text-gray-600 dark:text-gray-400">
          Shadow Blur
        </label>
        <input
          type="range"
          min={0}
          max={20}
          value={item.effects.shadowBlur}
          onChange={(e) =>
            onUpdate({
              effects: {
                ...item.effects,
                shadowBlur: Number(e.target.value),
              },
            })
          }
          className="w-full"
        />
      </div>

      {/* Blur */}
      <div>
        <label className="text-xs text-gray-600 dark:text-gray-400">Blur</label>
        <input
          type="range"
          min={0}
          max={10}
          step={0.1}
          value={item.effects.blur}
          onChange={(e) =>
            onUpdate({
              effects: {
                ...item.effects,
                blur: Number(e.target.value),
              },
            })
          }
          className="w-full"
        />
      </div>

      {/* Brightness */}
      <div>
        <label className="text-xs text-gray-600 dark:text-gray-400">
          Brightness
        </label>
        <input
          type="range"
          min={0}
          max={2}
          step={0.01}
          value={item.effects.brightness}
          onChange={(e) =>
            onUpdate({
              effects: {
                ...item.effects,
                brightness: Number(e.target.value),
              },
            })
          }
          className="w-full"
        />
      </div>
    </div>
  );
});

StylePanel.displayName = "StylePanel";
