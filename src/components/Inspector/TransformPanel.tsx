import { memo } from 'react';
import type { KubitoItem } from '@/types';

interface TransformPanelProps {
  item: KubitoItem;
  onUpdate: (updates: Partial<KubitoItem>) => void;
}

/**
 * Transform controls panel (position, scale, rotation, flip)
 */
export const TransformPanel = memo<TransformPanelProps>(
  ({ item, onUpdate }) => {
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Transform
        </h4>

        {/* X Position */}
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between items-center">
            <span>X Position</span>
            <input
              type="number"
              min={0}
              max={720}
              value={Math.round(item.x)}
              onChange={(e) => onUpdate({ x: Number(e.target.value) })}
              className="w-16 px-2 py-1 text-right bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-xs"
            />
          </label>
          <input
            type="range"
            min={0}
            max={720}
            value={item.x}
            onChange={(e) => onUpdate({ x: Number(e.target.value) })}
            className="w-full mt-1"
          />
        </div>

        {/* Y Position */}
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between items-center">
            <span>Y Position</span>
            <input
              type="number"
              min={0}
              max={720}
              value={Math.round(item.y)}
              onChange={(e) => onUpdate({ y: Number(e.target.value) })}
              className="w-16 px-2 py-1 text-right bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-xs"
            />
          </label>
          <input
            type="range"
            min={0}
            max={720}
            value={item.y}
            onChange={(e) => onUpdate({ y: Number(e.target.value) })}
            className="w-full mt-1"
          />
        </div>

        {/* Scale */}
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between items-center">
            <span>Scale</span>
            <input
              type="number"
              min={0.1}
              max={10}
              step={0.1}
              value={item.scale.toFixed(2)}
              onChange={(e) => onUpdate({ scale: Number(e.target.value) })}
              className="w-16 px-2 py-1 text-right bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-xs"
            />
          </label>
          <input
            type="range"
            min={0.1}
            max={10}
            step={0.01}
            value={item.scale}
            onChange={(e) => onUpdate({ scale: Number(e.target.value) })}
            className="w-full mt-1"
          />
        </div>

        {/* Rotation */}
        <div>
          <label className="text-xs text-gray-600 dark:text-gray-400 flex justify-between items-center">
            <span>Rotation</span>
            <input
              type="number"
              min={-180}
              max={180}
              value={Math.round(item.rotate)}
              onChange={(e) => onUpdate({ rotate: Number(e.target.value) })}
              className="w-16 px-2 py-1 text-right bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-xs"
            />
          </label>
          <input
            type="range"
            min={-180}
            max={180}
            value={item.rotate}
            onChange={(e) => onUpdate({ rotate: Number(e.target.value) })}
            className="w-full mt-1"
          />
        </div>

        {/* Flip Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate({ flipX: !item.flipX })}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
              item.flipX
                ? 'bg-kubito-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Flip X
          </button>
          <button
            onClick={() => onUpdate({ flipY: !item.flipY })}
            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
              item.flipY
                ? 'bg-kubito-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            Flip Y
          </button>
        </div>
      </div>
    );
  }
);

TransformPanel.displayName = 'TransformPanel';
