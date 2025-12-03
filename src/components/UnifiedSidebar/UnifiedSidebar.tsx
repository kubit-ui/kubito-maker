import { useState, memo } from 'react';
import {
  Palette,
  Layers,
  Ruler,
  Paintbrush,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { AssetPanel } from '../AssetPanel';
import { LayersPanel } from '../LayersPanel';
import { SmartGuidesControls } from '../SmartGuidesControls';
import { BrushPanel } from '../BrushPanel';
import {
  useSnapConfig,
  useGuides,
  useEditorActions,
} from '@/store/editorStore';

type SidebarTab = 'assets' | 'layers' | 'guides' | 'brush';

const TAB_ICONS = {
  assets: Palette,
  layers: Layers,
  guides: Ruler,
  brush: Paintbrush,
} as const;

/**
 * Unified left sidebar with tabs for assets and layers
 */
export const UnifiedSidebar = memo(() => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('assets');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  // Smart Guides state and actions
  const snapConfig = useSnapConfig();
  const { showRulers } = useGuides();
  const { updateSnapConfig, toggleRulers, setBrushMode } = useEditorActions();

  const tabs: Array<{ id: SidebarTab; label: string }> = [
    { id: 'assets', label: 'Assets' },
    { id: 'layers', label: 'Layers' },
    { id: 'brush', label: 'Brush' },
    { id: 'guides', label: 'Guides' },
  ];

  return (
    <div className="relative z-40 flex h-full gap-2">
      {/* Tab Bar */}
      <div className="flex flex-col gap-2 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-2">
        {tabs.map((tab) => {
          const Icon = TAB_ICONS[tab.id];
          return (
            <div key={tab.id} className="relative">
              <button
                onClick={() => {
                  if (activeTab === tab.id && !isCollapsed) {
                    setIsCollapsed(true);
                    // Al colapsar la tab de brush, desactivar el modo brush
                    if (tab.id === 'brush') {
                      setBrushMode('none');
                    }
                  } else {
                    setActiveTab(tab.id);
                    setIsCollapsed(false);
                    // Al activar la tab de brush, activar automáticamente el modo brush
                    if (tab.id === 'brush') {
                      setBrushMode('brush');
                    } else {
                      // Al cambiar a otra tab, desactivar el modo brush
                      setBrushMode('none');
                    }
                  }
                }}
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`
                p-3 rounded-xl flex items-center justify-center relative
                ${
                  activeTab === tab.id && !isCollapsed
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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

        {/* Collapse/Expand button */}
        <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="relative">
            <button
              onClick={() => {
                const newCollapsed = !isCollapsed;
                setIsCollapsed(newCollapsed);
                // Al colapsar el sidebar, desactivar el modo brush si estaba activo
                if (newCollapsed && activeTab === 'brush') {
                  setBrushMode('none');
                }
              }}
              onMouseEnter={() => setHoveredTab('collapse')}
              onMouseLeave={() => setHoveredTab(null)}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </button>

            {/* Tooltip for collapse button */}
            {hoveredTab === 'collapse' && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 pointer-events-none">
                <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                  {isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panel Content - No animations */}
      {!isCollapsed && (
        <div className="h-full">
          {activeTab === 'assets' && (
            <div className="h-full">
              <AssetPanel />
            </div>
          )}
          {activeTab === 'layers' && (
            <div className="h-full">
              <LayersPanel />
            </div>
          )}
          {activeTab === 'brush' && (
            <div className="h-full">
              <BrushPanel />
            </div>
          )}
          {activeTab === 'guides' && (
            <div className="h-full">
              <SmartGuidesControls
                config={snapConfig}
                showRulers={showRulers}
                onConfigChange={updateSnapConfig}
                onToggleRulers={toggleRulers}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
});

UnifiedSidebar.displayName = 'UnifiedSidebar';
