import { memo, useState } from "react";
import { Sparkles, RotateCcw } from "lucide-react";
import { FILTER_PRESETS, applyFilterPreset } from "@/data/filterPresets";
import type { FilterPreset } from "@/data/filterPresets";

interface FiltersPanelProps {
  currentEffects: {
    brightness?: number;
    contrast?: number;
    saturate?: number;
    hueRotate?: number;
    grayscale?: number;
    sepia?: number;
    invert?: number;
    blur?: number;
  };
  onApplyFilter: (effects: Partial<FilterPreset["effects"]>) => void;
}

const CATEGORIES: Array<{
  id: FilterPreset["category"];
  label: string;
}> = [
  { id: "photographic", label: "Photo" },
  { id: "color", label: "Color" },
  { id: "artistic", label: "Artistic" },
  { id: "special", label: "Special" },
];

export const FiltersPanel = memo<FiltersPanelProps>(
  ({ currentEffects, onApplyFilter }) => {
    const [selectedCategory, setSelectedCategory] =
      useState<FilterPreset["category"]>("photographic");
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const filteredPresets = FILTER_PRESETS.filter(
      (preset) => preset.category === selectedCategory,
    );

    const handleFilterClick = (preset: FilterPreset) => {
      const newEffects = applyFilterPreset(currentEffects, preset.id);
      onApplyFilter(newEffects);
      setActiveFilter(preset.id);
    };

    const handleReset = () => {
      const resetPreset = FILTER_PRESETS.find((p) => p.id === "none");
      if (resetPreset) {
        onApplyFilter(resetPreset.effects);
        setActiveFilter("none");
      }
    };

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Filters & Effects
            </h3>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
                ${
                  selectedCategory === category.id
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-1">
          {filteredPresets.map((preset) => {
            const IconComponent = preset.icon;
            return (
              <button
                key={preset.id}
                onClick={() => handleFilterClick(preset)}
                className={`
                  relative group flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all
                  ${
                    activeFilter === preset.id
                      ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600"
                  }
                `}
                title={preset.description}
              >
                {/* Icon */}
                <IconComponent className="w-8 h-8 text-gray-700 dark:text-gray-300" />

                {/* Name */}
                <div className="text-xs font-medium text-center text-gray-700 dark:text-gray-300 line-clamp-2">
                  {preset.name}
                </div>

                {/* Active indicator */}
                {activeFilter === preset.id && (
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-purple-500" />
                )}

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-xl bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors" />
              </button>
            );
          })}
        </div>

        {/* Fine-tune Controls */}
        <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
            Fine Tune
          </div>

          {/* Brightness */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="text-gray-700 dark:text-gray-300">
                Brightness
              </label>
              <span className="text-gray-500 dark:text-gray-400">
                {Math.round(((currentEffects.brightness || 1) - 1) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={currentEffects.brightness || 1}
              onChange={(e) =>
                onApplyFilter({
                  ...currentEffects,
                  brightness: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Contrast */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="text-gray-700 dark:text-gray-300">
                Contrast
              </label>
              <span className="text-gray-500 dark:text-gray-400">
                {Math.round(((currentEffects.contrast || 1) - 1) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={currentEffects.contrast || 1}
              onChange={(e) =>
                onApplyFilter({
                  ...currentEffects,
                  contrast: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Saturation */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="text-gray-700 dark:text-gray-300">
                Saturation
              </label>
              <span className="text-gray-500 dark:text-gray-400">
                {Math.round(((currentEffects.saturate || 1) - 1) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.01"
              value={currentEffects.saturate || 1}
              onChange={(e) =>
                onApplyFilter({
                  ...currentEffects,
                  saturate: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Hue Rotate */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="text-gray-700 dark:text-gray-300">
                Hue Shift
              </label>
              <span className="text-gray-500 dark:text-gray-400">
                {currentEffects.hueRotate || 0}°
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              step="1"
              value={currentEffects.hueRotate || 0}
              onChange={(e) =>
                onApplyFilter({
                  ...currentEffects,
                  hueRotate: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Blur */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <label className="text-gray-700 dark:text-gray-300">Blur</label>
              <span className="text-gray-500 dark:text-gray-400">
                {currentEffects.blur || 0}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.5"
              value={currentEffects.blur || 0}
              onChange={(e) =>
                onApplyFilter({
                  ...currentEffects,
                  blur: parseFloat(e.target.value),
                })
              }
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>
      </div>
    );
  },
);

FiltersPanel.displayName = "FiltersPanel";
