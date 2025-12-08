import React, { memo, useState, useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import type { Asset, AssetCategory } from "@/types";
import { ASSETS_LIBRARY, bodies } from "@/data";
import {
  useConfig,
  useSelectedBodyId,
  useEditorActions,
} from "@/store/editorStore";
import { useAnalytics } from "@/hooks";
import { AssetRenderer } from "../AssetRenderer";
import { BodyRenderer } from "../BodyRenderer";

interface AssetPanelProps {
  onClose?: () => void;
}

type Tab = "assets" | "bodies";

// Draggable Asset Component with @dnd-kit
const DraggableAsset = ({
  category,
  asset,
  onClick,
}: {
  category: AssetCategory;
  asset: Asset;
  onClick: () => void;
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `${category}-${asset.id}`,
    data: {
      asset,
      category,
    },
  });

  const handleClick = () => {
    // Only trigger onClick if not dragging
    if (!isDragging) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      className={`
        border border-gray-200 dark:border-gray-700 rounded-lg p-2 md:p-2
        flex flex-col items-center gap-1 
        hover:shadow-md cursor-pointer
        transition-all bg-white dark:bg-gray-800 
        hover:scale-105 active:scale-95
        min-h-[60px] md:min-h-[48px]
      `}
      title={`Click or drag ${asset.name}`}
    >
      <svg
        width="56"
        height="56"
        viewBox="-40 -40 80 80"
        className="w-full h-auto pointer-events-none md:w-12 md:h-12"
      >
        <AssetRenderer
          asset={asset}
          className="text-gray-800 dark:text-gray-200"
        />
      </svg>
    </div>
  );
};

export const AssetPanel = memo<AssetPanelProps>(({ onClose }) => {
  const config = useConfig();
  const selectedBodyId = useSelectedBodyId();
  const { addItem, setSelectedBodyId, clearAll } = useEditorActions();
  const { trackAssetAdded, trackBodyChanged } = useAnalytics();
  const [activeTab, setActiveTab] = useState<Tab>("assets");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(
      Object.keys(ASSETS_LIBRARY).filter((category) => category !== "Bodies"),
    ),
  );

  const handleAssetClick = (category: AssetCategory, asset: Asset) => {
    addItem({
      category,
      assetId: asset.id,
      name: asset.name,
      x: config.canvasWidth / 2,
      y: config.canvasHeight / 2,
      scale: 1,
      rotate: 0,
      flipX: false,
      flipY: false,
    });

    // Track analytics
    trackAssetAdded(category, asset.id);

    // Close panel in mobile after adding asset
    if (onClose) {
      onClose();
    }
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Filter assets based on search term (excluding Bodies and Noses)
  const filteredAssets = useMemo(() => {
    // Exclude Bodies and Noses categories from assets library
    const assetsWithoutBodies = Object.entries(ASSETS_LIBRARY)
      .filter(([category]) => category !== "Bodies" && category !== "Noses")
      .reduce(
        (acc, [category, assets]) => {
          acc[category] = assets;
          return acc;
        },
        {} as Record<string, Asset[]>,
      );

    if (!searchTerm.trim()) return assetsWithoutBodies;

    const term = searchTerm.toLowerCase();
    const filtered: Record<string, Asset[]> = {};

    Object.entries(assetsWithoutBodies).forEach(([category, assets]) => {
      const matchingAssets = assets.filter(
        (asset) =>
          asset.name.toLowerCase().includes(term) ||
          category.toLowerCase().includes(term),
      );
      if (matchingAssets.length > 0) {
        filtered[category] = matchingAssets;
      }
    });

    return filtered;
  }, [searchTerm]);

  // Auto-expand categories when searching
  React.useEffect(() => {
    if (searchTerm.trim()) {
      setExpandedCategories(new Set(Object.keys(filteredAssets)));
    }
  }, [searchTerm, filteredAssets]);

  const handleBodySelect = (bodyId: string) => {
    if (
      window.confirm("Change body? All elements from the canvas will be lost.")
    ) {
      clearAll();
      setSelectedBodyId(bodyId);

      // Track analytics
      trackBodyChanged(bodyId);

      // Close panel in mobile after selecting body
      if (onClose) {
        onClose();
      }
    }
  };

  return (
    <aside className="w-full md:w-64 bg-white dark:bg-gray-900 md:rounded-2xl md:shadow-xl p-3 flex flex-col gap-3 h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {activeTab === "assets" ? "Assets" : "Bodies"}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <button
          onClick={() => setActiveTab("assets")}
          className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeTab === "assets"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Assets
        </button>
        <button
          onClick={() => setActiveTab("bodies")}
          className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            activeTab === "bodies"
              ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          }`}
        >
          Bodies
        </button>
      </div>

      {/* Assets Tab Content */}
      {activeTab === "assets" && (
        <>
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assets..."
              className="w-full px-3 py-2 pl-8 text-sm bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-kubito-primary dark:text-white"
            />
            <svg
              className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-2 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Assets by category with accordions */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {Object.keys(filteredAssets).length === 0 ? (
              <div className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
                No assets found
              </div>
            ) : (
              Object.entries(filteredAssets).map(([category, assets]) => {
                const isExpanded = expandedCategories.has(category);
                return (
                  <div
                    key={category}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                  >
                    {/* Category header */}
                    <button
                      onClick={() => toggleCategory(category)}
                      className="w-full px-3 py-2 flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {category}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {assets.length}
                        </span>
                        <svg
                          className={`w-4 h-4 text-gray-500 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </button>

                    {/* Assets grid */}
                    {isExpanded && (
                      <div className="overflow-y-auto max-h-[288px] md:max-h-[288px]">
                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-3 gap-2 md:gap-1.5 p-2 bg-white dark:bg-gray-900">
                          {assets.map((asset) => (
                            <DraggableAsset
                              key={asset.id}
                              category={category as AssetCategory}
                              asset={asset}
                              onClick={() =>
                                handleAssetClick(
                                  category as AssetCategory,
                                  asset,
                                )
                              }
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Bodies Tab Content */}
      {activeTab === "bodies" && (
        <div className="flex-1 overflow-y-auto pr-1">
          <p className="text-xs text-gray-500 dark:text-gray-400 px-1 mb-3">
            Select a body. Current items will be removed.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2">
            {bodies.map((body) => (
              <button
                key={body.id}
                onClick={() => handleBodySelect(body.id)}
                className={`w-full border-2 rounded-lg p-3 transition-colors ${
                  selectedBodyId === body.id
                    ? "border-kubito-primary bg-kubito-secondary-bg dark:bg-kubito-primary/20"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  {/* Preview */}
                  <div className="w-full h-32 flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <svg
                      viewBox="0 0 400 400"
                      className="w-full h-full"
                      style={{ maxWidth: "120px", maxHeight: "120px" }}
                    >
                      <g transform="translate(200, 200)">
                        <BodyRenderer body={body} />
                      </g>
                    </svg>
                  </div>
                  {/* Name */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {body.name}
                    </span>
                    {selectedBodyId === body.id && (
                      <span className="text-blue-500 text-xs">✓</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
});

AssetPanel.displayName = "AssetPanel";
