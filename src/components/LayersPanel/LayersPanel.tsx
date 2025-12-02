import { memo, useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Smile,
  Crown,
  Sparkles,
} from "lucide-react";
import { useItems, useSelection, useEditorActions } from "@/store/editorStore";

export const LayersPanel = memo(() => {
  const items = useItems();
  const { selectedIds } = useSelection();
  const {
    setSelectedId,
    toggleSelection,
    updateItem,
    moveItemUp,
    moveItemDown,
    moveItemToTop,
    moveItemToBottom,
    toggleItemLock,
    toggleItemVisibility,
  } = useEditorActions();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  // Sort items by z-index (top to bottom in UI)
  const sortedItems = [...items].sort((a, b) => b.z - a.z);

  const handleStartEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleFinishEditing = () => {
    if (editingId && editingName.trim()) {
      updateItem(editingId, { name: editingName.trim() });
    }
    setEditingId(null);
    setEditingName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleFinishEditing();
    } else if (e.key === "Escape") {
      setEditingId(null);
      setEditingName("");
    }
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Layers
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Layers List */}
      <div className="flex-1 overflow-y-auto p-2">
        {sortedItems.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-400 dark:text-gray-500">
            No layers
            <br />
            <span className="text-xs">Drag elements to canvas</span>
          </div>
        ) : (
          <div className="space-y-1">
            {sortedItems.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const isEditing = editingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`group relative rounded-lg transition-all ${
                    isSelected
                      ? "bg-kubito-secondary-bg dark:bg-kubito-primary/20 ring-2 ring-kubito-primary"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2 p-2">
                    {/* Layer Thumbnail/Icon */}
                    <div
                      className={`w-8 h-8 rounded flex items-center justify-center text-lg ${
                        item.locked
                          ? "bg-gray-200 dark:bg-gray-700"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                      onClick={(e) => {
                        if (e.shiftKey) {
                          toggleSelection(item.id);
                        } else {
                          setSelectedId(item.id);
                        }
                      }}
                    >
                      {item.category === "Eyes" && <Eye className="h-4 w-4" />}
                      {item.category === "Mouths" && (
                        <Smile className="h-4 w-4" />
                      )}
                      {item.category === "Accessories" && (
                        <Crown className="h-4 w-4" />
                      )}
                      {item.category === "Noses" && "▪"}
                      {item.category === "Hairs" && (
                        <Sparkles className="h-4 w-4" />
                      )}
                      {item.category === "Backgrounds" && "▪"}
                    </div>

                    {/* Layer Name */}
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={handleFinishEditing}
                          onKeyDown={handleKeyDown}
                          autoFocus
                          className="w-full px-2 py-1 text-sm bg-white dark:bg-gray-800 border border-kubito-primary rounded"
                        />
                      ) : (
                        <button
                          onClick={(e) => {
                            if (e.shiftKey) {
                              toggleSelection(item.id);
                            } else {
                              setSelectedId(item.id);
                            }
                          }}
                          onDoubleClick={() =>
                            handleStartEditing(item.id, item.name)
                          }
                          className="w-full text-left"
                        >
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {item.category}
                          </div>
                        </button>
                      )}
                    </div>

                    {/* Layer Controls */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => toggleItemVisibility(item.id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        title={item.visible ? "Hide" : "Show"}
                      >
                        {item.visible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleItemLock(item.id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        title={item.locked ? "Unlock" : "Lock"}
                      >
                        {item.locked ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <Unlock className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions (visible on selection) */}
                  {isSelected && (
                    <div className="flex items-center gap-1 px-2 pb-2 text-xs">
                      <button
                        onClick={() => moveItemToTop(item.id)}
                        className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        title="Bring to front"
                      >
                        ⇈
                      </button>
                      <button
                        onClick={() => moveItemUp(item.id)}
                        className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveItemDown(item.id)}
                        className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => moveItemToBottom(item.id)}
                        className="flex-1 px-2 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        title="Send to back"
                      >
                        ⇊
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {items.length > 0 && (
        <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Double click to rename
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Shift+Click for multiple selection
          </div>
        </div>
      )}
    </aside>
  );
});

LayersPanel.displayName = "LayersPanel";
