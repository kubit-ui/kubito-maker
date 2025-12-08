import { useEffect, useState } from "react";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Canvas } from "./components/Canvas";
import { Toolbar } from "./components/Toolbar";
import { ResponsiveUnifiedSidebar } from "./components/UnifiedSidebar";
import { ResponsiveInspector } from "./components/Inspector";
import { MobileFloatingButtons } from "./components/MobileFloatingButtons";
import { useEditorStore } from "./store/editorStore";
import { useKeyboardShortcuts, useAnalytics, useIsMobile } from "./hooks";
import { AssetRenderer } from "./components/AssetRenderer";
import type { Asset, AssetCategory } from "./types";

type MobilePanel = "assets" | "layers" | "tools" | null;
type SidebarTab = "assets" | "layers" | "guides" | "brush" | "text";

export default function KubitoEditor() {
  // Analytics
  const { trackSessionStart } = useAnalytics();

  // Responsive state
  const isMobile = useIsMobile();
  const [activeMobilePanel, setActiveMobilePanel] =
    useState<MobilePanel>(null);
  const [activeSidebarTab, setActiveSidebarTab] =
    useState<SidebarTab>("assets");

  // Initialize analytics on mount
  useEffect(() => {
    trackSessionStart();
  }, [trackSessionStart]);

  // Drag and drop state
  const [activeAsset, setActiveAsset] = useState<{
    asset: Asset;
    category: AssetCategory;
  } | null>(null);

  // Sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // Requires 8px of movement before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200, // 200ms delay before touch drag starts
        tolerance: 8,
      },
    }),
  );

  // Store actions
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const selectedId = useEditorStore((state) => state.selectedId);
  const removeItem = useEditorStore((state) => state.removeItem);
  const duplicateItem = useEditorStore((state) => state.duplicateItem);
  const copyItem = useEditorStore((state) => state.copyItem);
  const pasteItem = useEditorStore((state) => state.pasteItem);
  const selectAll = useEditorStore((state) => state.selectAll);
  const items = useEditorStore((state) => state.items);
  const selectedIds = useEditorStore((state) => state.selectedIds);
  const updateItem = useEditorStore((state) => state.updateItem);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onUndo: undo,
    onRedo: redo,
    onSelectAll: selectAll,
    onCopy: () => {
      // Copy works with multiple selection (copy first selected)
      const firstSelected =
        selectedIds.length > 0 ? selectedIds[0] : selectedId;
      if (firstSelected) {
        copyItem(firstSelected);
      }
    },
    onPaste: pasteItem,
    onDelete: () => {
      // Delete works with multiple selection
      if (selectedIds.length > 0) {
        // Delete all selected items
        selectedIds.forEach((id) => removeItem(id));
      } else if (selectedId) {
        // Fallback to single selection
        removeItem(selectedId);
      }
    },
    onDuplicate: () => {
      // Duplicate works with multiple selection
      if (selectedIds.length > 0) {
        // Duplicate all selected items
        selectedIds.forEach((id) => duplicateItem(id));
      } else if (selectedId) {
        duplicateItem(selectedId);
      }
    },
    onArrowMove: (direction, step) => {
      // Move all selected items
      if (selectedIds.length === 0) return;

      selectedIds.forEach((id) => {
        const item = items.find((i) => i.id === id);
        if (!item || item.locked) return;

        const updates: { x?: number; y?: number } = {};
        if (direction === "left") updates.x = item.x - step;
        else if (direction === "right") updates.x = item.x + step;
        else if (direction === "up") updates.y = item.y - step;
        else if (direction === "down") updates.y = item.y + step;

        if (Object.keys(updates).length > 0) {
          updateItem(id, updates);
        }
      });
    },
  });

  // Drag handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current as {
      asset: Asset;
      category: AssetCategory;
    };
    setActiveAsset(data);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveAsset(null);
    // The Canvas component will handle the actual drop via useDroppable
    void event;
  };

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const state = useEditorStore.getState();
      const dataToSave = {
        items: state.items,
        config: state.config,
        selectedBodyId: state.selectedBodyId,
        timestamp: new Date().toISOString(),
      };

      try {
        localStorage.setItem("kubito-autosave", JSON.stringify(dataToSave));
        // Auto-saved successfully
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, 30000); // Every 30 seconds

    // Load auto-save on mount
    try {
      const saved = localStorage.getItem("kubito-autosave");
      if (saved) {
        const data = JSON.parse(saved) as { timestamp: number };
        // Auto-save loaded successfully
        void data.timestamp; // Use the timestamp to avoid unused variable warning
      }
    } catch (error) {
      console.error("Failed to load auto-save:", error);
    }

    return () => clearInterval(autoSaveInterval);
  }, []);

  // Handle mobile panel opening
  const handleMobilePanelClick = (panel: MobilePanel) => {
    if (panel === activeMobilePanel) {
      setActiveMobilePanel(null);
    } else {
      setActiveMobilePanel(panel);
      // Map mobile panel to sidebar tab
      if (panel === "assets") {
        setActiveSidebarTab("assets");
      } else if (panel === "layers") {
        setActiveSidebarTab("layers");
      } else if (panel === "tools") {
        // Default to brush when opening tools
        setActiveSidebarTab("brush");
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-3 flex flex-col overflow-hidden">
        <div className="max-w-[1920px] mx-auto w-full flex flex-col gap-2 sm:gap-3 h-full">
          {/* Toolbar - Always visible */}
          <Toolbar />

          {/* Main Layout */}
          <div className="flex gap-2 sm:gap-3 items-start flex-1 min-h-0">
            {/* Unified Left Sidebar - Hidden on mobile */}
            {!isMobile && (
              <ResponsiveUnifiedSidebar
                activeTab={activeSidebarTab}
                onTabChange={setActiveSidebarTab}
                isOpen={!isMobile}
              />
            )}

            {/* Canvas - takes all remaining space */}
            <div className="relative z-10 flex-1 min-w-0 h-full overflow-auto">
              <Canvas className="h-full" />
            </div>

            {/* Inspector - Right Sidebar - Hidden on mobile */}
            {!isMobile && <ResponsiveInspector />}
          </div>
        </div>

        {/* Mobile Floating Buttons */}
        {isMobile && (
          <MobileFloatingButtons
            onTabClick={(tab) => {
              handleMobilePanelClick(tab as MobilePanel);
            }}
            activeTab={activeMobilePanel}
          />
        )}
      </div>

      {/* Mobile Bottom Sheets */}
      {isMobile && (
        <>
          <ResponsiveUnifiedSidebar
            activeTab={activeSidebarTab}
            onTabChange={setActiveSidebarTab}
            isOpen={
              activeMobilePanel === "assets" ||
              activeMobilePanel === "layers" ||
              activeMobilePanel === "tools"
            }
            onClose={() => setActiveMobilePanel(null)}
          />
        </>
      )}

      {/* Drag Overlay - shows animated preview while dragging */}
      <DragOverlay dropAnimation={null}>
        {activeAsset ? (
          <div
            className="opacity-95 cursor-grabbing w-24 h-24 pointer-events-none"
            style={{
              animation:
                "drag-physics 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards, wobble 2s ease-in-out infinite",
              filter: "drop-shadow(0 10px 25px rgba(0, 0, 0, 0.3))",
            }}
          >
            <svg
              width="96"
              height="96"
              viewBox="-40 -40 80 80"
              className="w-full h-full"
            >
              <AssetRenderer asset={activeAsset.asset} />
            </svg>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
