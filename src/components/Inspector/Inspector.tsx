import { memo, useState } from "react";
import {
  Lock,
  Unlock,
  Settings,
  Move,
  Palette,
  Sparkles,
  Layers2,
  type LucideIcon,
} from "lucide-react";
import {
  useItems,
  useSelection,
  useEditorActions,
  useHistory,
} from "@/store/editorStore";
import { TransformPanel } from "./TransformPanel";
import { StylePanel } from "./StylePanel";
import { AlignmentPanel } from "./AlignmentPanel";
import { FiltersPanel } from "../FiltersPanel";
import type { KubitoItem } from "@/types";

type InspectorTab = "transform" | "style" | "effects" | "layer";

interface TabConfig {
  id: InspectorTab;
  label: string;
  icon: LucideIcon;
}

export const Inspector = memo(() => {
  const items = useItems();
  const { selectedId, selectedIds } = useSelection();
  const { canUndo, canRedo } = useHistory();
  const {
    updateItem,
    removeItem,
    duplicateItem,
    setSelectedId,
    deselectAll,
    toggleItemLock,
    toggleItemVisibility,
    moveItemUp,
    moveItemDown,
    alignItems,
    undo,
    redo,
  } = useEditorActions();

  const [activeTab, setActiveTab] = useState<InspectorTab>("transform");

  const selected = items.find((i) => i.id === selectedId);
  const selectedItems = items.filter((i) => selectedIds.includes(i.id));

  // Multiple selection view
  if (selectedIds.length > 1) {
    return (
      <aside className="w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-3 flex flex-col gap-3 h-full overflow-hidden">
        {/* Undo/Redo buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`flex-1 p-3 rounded-xl font-medium text-sm transition-colors ${
              canUndo
                ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                : "bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed"
            }`}
            title="Undo (Cmd/Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`flex-1 p-3 rounded-xl font-medium text-sm transition-colors ${
              canRedo
                ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                : "bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed"
            }`}
            title="Redo (Cmd/Ctrl+Shift+Z)"
          >
            ↷ Redo
          </button>
        </div>

        <div className="flex items-center justify-between flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Multiple Selection
          </h3>
          <button
            onClick={deselectAll}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Deselect All
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {selectedIds.length} items selected
            </p>
            <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
              Use Cmd/Ctrl+C to copy, Cmd/Ctrl+V to paste, or Delete to remove
            </p>
          </div>

          {/* List of selected items */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
              Items
            </h4>
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs"
              >
                <span className="truncate flex-1 text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
                <button
                  onClick={() => setSelectedId(item.id)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 ml-2"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>

          {/* Alignment tools for multiple items */}
          <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
              Alignment
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => alignItems("left")}
                className="px-2 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Align Left"
              >
                ⫤
              </button>
              <button
                onClick={() => alignItems("center")}
                className="px-2 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Center Horizontally"
              >
                ⬌
              </button>
              <button
                onClick={() => alignItems("right")}
                className="px-2 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Align Right"
              >
                ⫥
              </button>
              <button
                onClick={() => alignItems("top")}
                className="px-2 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Align Top"
              >
                ⫴
              </button>
              <button
                onClick={() => alignItems("middle")}
                className="px-2 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Center Vertically"
              >
                ⬍
              </button>
              <button
                onClick={() => alignItems("bottom")}
                className="px-2 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs hover:bg-gray-200 dark:hover:bg-gray-700"
                title="Align Bottom"
              >
                ⫵
              </button>
            </div>
          </div>

          {/* Group actions */}
          <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => selectedId && duplicateItem(selectedId)}
              className="w-full px-3 py-2 bg-kubito-primary hover:bg-kubito-primary-hover text-white rounded-lg text-sm font-medium transition-colors"
            >
              Duplicate {selectedIds.length} items
            </button>
            <button
              onClick={() => selectedId && removeItem(selectedId)}
              className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Delete {selectedIds.length} items
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // No selection view
  if (!selected) {
    return (
      <aside className="w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-3 flex flex-col gap-3 h-full overflow-hidden">
        {/* Undo/Redo buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`flex-1 p-3 rounded-xl font-medium text-sm transition-colors ${
              canUndo
                ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                : "bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed"
            }`}
            title="Undo (Cmd/Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`flex-1 p-3 rounded-xl font-medium text-sm transition-colors ${
              canRedo
                ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                : "bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed"
            }`}
            title="Redo (Cmd/Ctrl+Shift+Z)"
          >
            ↷ Redo
          </button>
        </div>

        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Inspector
        </h3>

        {/* Empty state message */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <div className="mb-3 opacity-30 flex justify-center">
              <Settings className="h-12 w-12" />
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              No element selected
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Click on an element to inspect and edit its properties
            </p>
          </div>
        </div>
      </aside>
    );
  }

  const handleUpdate = (updates: Partial<KubitoItem>) => {
    updateItem(selected.id, updates);
  };

  const tabs: TabConfig[] = [
    { id: "transform", label: "Transform", icon: Move },
    { id: "style", label: "Style", icon: Palette },
    { id: "effects", label: "Effects", icon: Sparkles },
    { id: "layer", label: "Layer", icon: Layers2 },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-3 flex flex-col gap-3 h-full overflow-hidden">
      {/* Undo/Redo buttons */}
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`flex-1 p-3 rounded-xl font-medium text-sm transition-colors ${
            canUndo
              ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              : "bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed"
          }`}
          title="Undo (Cmd/Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`flex-1 p-3 rounded-xl font-medium text-sm transition-colors ${
            canRedo
              ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              : "bg-gray-50 dark:bg-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed"
          }`}
          title="Redo (Cmd/Ctrl+Shift+Z)"
        >
          ↷ Redo
        </button>
      </div>

      <div className="flex items-center justify-between flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Inspector
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
          {selected.name}
        </span>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex-shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 px-1 rounded-md transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              title={tab.label}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {/* Transform Tab */}
        {activeTab === "transform" && (
          <>
            <TransformPanel item={selected} onUpdate={handleUpdate} />
            <AlignmentPanel
              item={selected}
              onUpdate={handleUpdate}
              onAlign={alignItems}
            />
          </>
        )}

        {/* Style Tab */}
        {activeTab === "style" && (
          <StylePanel item={selected} onUpdate={handleUpdate} />
        )}

        {/* Effects Tab */}
        {activeTab === "effects" && (
          <FiltersPanel
            currentEffects={{
              brightness: selected.effects.brightness,
              contrast: selected.effects.contrast,
              saturate: selected.effects.saturate,
              hueRotate: selected.effects.hueRotate,
              grayscale: selected.effects.grayscale,
              sepia: selected.effects.sepia,
              invert: selected.effects.invert,
              blur: selected.effects.blur,
            }}
            onApplyFilter={(filterEffects) => {
              handleUpdate({
                effects: {
                  ...selected.effects,
                  ...filterEffects,
                },
              });
            }}
          />
        )}

        {/* Layer Tab */}
        {activeTab === "layer" && (
          <>
            {/* Layer Controls */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Layer Order
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => moveItemUp(selected.id)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  ↑ Forward
                </button>
                <button
                  onClick={() => moveItemDown(selected.id)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  ↓ Backward
                </button>
              </div>
            </div>

            {/* Visibility and Lock */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Item State
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => toggleItemLock(selected.id)}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-2 ${
                    selected.locked
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {selected.locked ? (
                    <>
                      <Lock className="h-4 w-4" /> Locked
                    </>
                  ) : (
                    <>
                      <Unlock className="h-4 w-4" /> Unlock
                    </>
                  )}
                </button>
                <button
                  onClick={() => toggleItemVisibility(selected.id)}
                  className={`px-3 py-2 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 ${
                    !selected.visible
                      ? "bg-gray-400 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {selected.visible ? "Visible" : "Hidden"}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Actions
              </h4>
              <button
                onClick={() => duplicateItem(selected.id)}
                className="w-full px-3 py-2 bg-kubito-primary text-white rounded-lg hover:bg-kubito-primary-hover font-medium text-sm"
              >
                Duplicate
              </button>
              <button
                onClick={() => {
                  removeItem(selected.id);
                  setSelectedId(null);
                }}
                className="w-full px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
});

Inspector.displayName = "Inspector";
