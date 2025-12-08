import { useState, memo } from "react";
import {
  Palette,
  Layers,
  Ruler,
  Paintbrush,
  Type,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AssetPanel } from "../AssetPanel";
import { LayersPanel } from "../LayersPanel";
import { SmartGuidesControls } from "../SmartGuidesControls";
import { BrushPanel } from "../BrushPanel";
import { TextPanel } from "../TextPanel";
import { BottomSheet } from "../BottomSheet";
import {
  useSnapConfig,
  useGuides,
  useEditorActions,
  useTextSettings,
} from "@/store/editorStore";
import { useIsMobile } from "@/hooks";

type SidebarTab = "assets" | "layers" | "guides" | "brush" | "text";

const TAB_ICONS = {
  assets: Palette,
  layers: Layers,
  guides: Ruler,
  brush: Paintbrush,
  text: Type,
} as const;

const TAB_LABELS = {
  assets: "Assets",
  layers: "Layers",
  guides: "Guides",
  brush: "Brush",
  text: "Text",
} as const;

interface ResponsiveSidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

/**
 * Unified sidebar with responsive behavior
 * - Desktop: Traditional sidebar
 * - Tablet: Collapsible sidebar
 * - Mobile: Bottom sheet
 */
export const ResponsiveUnifiedSidebar = memo<ResponsiveSidebarProps>(
  ({ activeTab, onTabChange, isOpen = true, onClose }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [hoveredTab, setHoveredTab] = useState<string | null>(null);
    const isMobile = useIsMobile();

    // Smart Guides state and actions
    const snapConfig = useSnapConfig();
    const { showRulers } = useGuides();
    const textSettings = useTextSettings();
    const {
      updateSnapConfig,
      toggleRulers,
      setBrushMode,
      updateTextSettings,
      addText,
    } = useEditorActions();

    const tabs: Array<{ id: SidebarTab; label: string }> = [
      { id: "assets", label: "Assets" },
      { id: "layers", label: "Layers" },
      { id: "brush", label: "Brush" },
      { id: "text", label: "Text" },
      { id: "guides", label: "Guides" },
    ];

    const handleTabClick = (tabId: SidebarTab) => {
      if (activeTab === tabId && !isCollapsed && !isMobile) {
        setIsCollapsed(true);
        if (tabId === "brush") {
          setBrushMode("none");
        }
      } else {
        onTabChange(tabId);
        setIsCollapsed(false);
        if (tabId === "brush") {
          setBrushMode("brush");
        } else {
          setBrushMode("none");
        }
      }
    };

    // Render panel content
    const renderPanelContent = () => {
      switch (activeTab) {
        case "assets":
          return <AssetPanel onClose={onClose} />;
        case "layers":
          return <LayersPanel />;
        case "brush":
          return <BrushPanel onClose={onClose} />;
        case "text":
          return (
            <TextPanel
              textSettings={textSettings}
              onSettingsChange={updateTextSettings}
              onAddText={addText}
              onClose={onClose}
            />
          );
        case "guides":
          return (
            <SmartGuidesControls
              config={snapConfig}
              showRulers={showRulers}
              onConfigChange={updateSnapConfig}
              onToggleRulers={toggleRulers}
            />
          );
        default:
          return null;
      }
    };

    // Mobile: Bottom Sheet
    if (isMobile) {
      return (
        <BottomSheet
          isOpen={isOpen}
          onClose={() => onClose?.()}
          title={TAB_LABELS[activeTab]}
          snapPoints={[0.6, 0.85, 0.95]}
          defaultSnapPoint={1}
        >
          <div className="h-full flex flex-col">
            {/* Show tab selector for tools (brush, text, guides) */}
            {(activeTab === "brush" ||
              activeTab === "text" ||
              activeTab === "guides") && (
              <div className="flex gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700 px-1">
                {tabs
                  .filter(
                    (tab) =>
                      tab.id === "brush" ||
                      tab.id === "text" ||
                      tab.id === "guides",
                  )
                  .map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => onTabChange(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? "bg-kubito-primary text-white shadow-lg"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {(() => {
                        const Icon = TAB_ICONS[tab.id];
                        return <Icon className="h-4 w-4" />;
                      })()}
                      <span>{tab.label}</span>
                    </button>
                  ))}
              </div>
            )}
            {/* Content */}
            <div className="flex-1 overflow-y-auto">{renderPanelContent()}</div>
          </div>
        </BottomSheet>
      );
    }

    // Desktop & Tablet: Sidebar
    return (
      <div className="relative z-40 flex h-full gap-2">
        {/* Tab Bar */}
        <div className="flex flex-col gap-2 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-2">
          {tabs.map((tab) => {
            const Icon = TAB_ICONS[tab.id];
            return (
              <div key={tab.id} className="relative">
                <button
                  onClick={() => handleTabClick(tab.id)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={`
                    p-3 rounded-xl flex items-center justify-center relative transition-colors
                    ${
                      activeTab === tab.id && !isCollapsed
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                </button>

                {/* Tooltip */}
                {hoveredTab === tab.id && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                      {tab.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Collapse/Expand button - Only on tablet/desktop */}
          {!isMobile && (
            <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="relative">
                <button
                  onClick={() => {
                    const newCollapsed = !isCollapsed;
                    setIsCollapsed(newCollapsed);
                    if (newCollapsed && activeTab === "brush") {
                      setBrushMode("none");
                    }
                  }}
                  onMouseEnter={() => setHoveredTab("collapse")}
                  onMouseLeave={() => setHoveredTab(null)}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronRight className="h-5 w-5" />
                  ) : (
                    <ChevronLeft className="h-5 w-5" />
                  )}
                </button>

                {/* Tooltip for collapse button */}
                {hoveredTab === "collapse" && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                    <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                      {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Panel Content */}
        {!isCollapsed && (
          <div className="h-full overflow-hidden">{renderPanelContent()}</div>
        )}
      </div>
    );
  },
);

ResponsiveUnifiedSidebar.displayName = "ResponsiveUnifiedSidebar";
