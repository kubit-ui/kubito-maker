import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Download,
  Share2,
  Users,
  Info,
  Maximize2,
  FolderOpen,
  Trash2,
  FileText,
  Image,
  Briefcase,
} from "lucide-react";
import {
  useItems,
  useConfig,
  useEditorActions,
  useBrushStrokes,
  useSelectedBodyId,
} from "@/store/editorStore";
import { TipsModal } from "../TipsModal";
import { ShareKubitoModal } from "../ShareKubitoModal";
import { CommunityGalleryModal } from "../CommunityGalleryModal";
import { CanvasSizeSelector } from "../CanvasSizeSelector";
import {
  exportSVG,
  exportPNG,
  exportJPEG,
  exportWebP,
  exportProject,
  importProject,
} from "@/utils/export";
import { ExportService } from "@/domain";
import { useAnalytics } from "@/hooks";
import { useRef } from "react";

interface MobileMenuFABProps {
  kubitoName: string;
  onNameChange: (name: string) => void;
}

/**
 * Floating Action Button menu for mobile
 * Replaces the toolbar with a cleaner floating menu
 */
export const MobileMenuFAB = memo<MobileMenuFABProps>(
  ({ kubitoName, onNameChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [showTipsModal, setShowTipsModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showCommunityGallery, setShowCommunityGallery] = useState(false);
    const [showCanvasSizeSelector, setShowCanvasSizeSelector] = useState(false);

    const items = useItems();
    const config = useConfig();
    const brushStrokes = useBrushStrokes();
    const selectedBodyId = useSelectedBodyId();
    const { clearAll, loadProject, deselectAll } = useEditorActions();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { trackExport, trackProjectSaved, trackProjectLoaded } =
      useAnalytics();

    // Export handlers
    const handleExportSVG = async () => {
      deselectAll();
      await new Promise((resolve) => setTimeout(resolve, 50));
      const svg = document.querySelector("#kubito-canvas") as SVGSVGElement;
      if (!svg) return;
      const filename = `kubito_${kubitoName}.svg`;
      await exportSVG(svg, filename);
      trackExport("SVG", config.canvasWidth, config.canvasHeight);
      setShowExportMenu(false);
      setIsOpen(false);
    };

    const handleExportPNG = async () => {
      deselectAll();
      await new Promise((resolve) => setTimeout(resolve, 50));
      const svg = document.querySelector("#kubito-canvas") as SVGSVGElement;
      if (!svg) return;
      const hasBackground = items.some(
        (item) => (item as any).category === "Backgrounds",
      );
      const options = ExportService.createDefaultOptions(
        config.canvasWidth,
        config.canvasHeight,
      );
      options.format = "png";
      options.transparentBackground = !hasBackground;
      const validation = ExportService.validateOptions(options);
      if (!validation.valid) {
        alert(`Export error: ${validation.errors.join(", ")}`);
        return;
      }
      const filename = `kubito_${kubitoName}.png`;
      await exportPNG(svg, { ...options, filename });
      trackExport("PNG", config.canvasWidth, config.canvasHeight);
      setShowExportMenu(false);
      setIsOpen(false);
    };

    const handleExportJPEG = async () => {
      deselectAll();
      await new Promise((resolve) => setTimeout(resolve, 50));
      const svg = document.querySelector("#kubito-canvas") as SVGSVGElement;
      if (!svg) return;
      const options = ExportService.createDefaultOptions(
        config.canvasWidth,
        config.canvasHeight,
      );
      options.format = "jpeg";
      options.quality = 0.98;
      const validation = ExportService.validateOptions(options);
      if (!validation.valid) {
        alert(`Export error: ${validation.errors.join(", ")}`);
        return;
      }
      const filename = `kubito_${kubitoName}.jpeg`;
      await exportJPEG(svg, { ...options, filename });
      trackExport("JPEG", config.canvasWidth, config.canvasHeight);
      setShowExportMenu(false);
      setIsOpen(false);
    };

    const handleExportWebP = async () => {
      deselectAll();
      await new Promise((resolve) => setTimeout(resolve, 50));
      const svg = document.querySelector("#kubito-canvas") as SVGSVGElement;
      if (!svg) return;
      const hasBackground = items.some(
        (item) => (item as any).category === "Backgrounds",
      );
      const options = ExportService.createDefaultOptions(
        config.canvasWidth,
        config.canvasHeight,
      );
      options.format = "webp";
      options.quality = 0.95;
      options.transparentBackground = !hasBackground;
      const validation = ExportService.validateOptions(options);
      if (!validation.valid) {
        alert(`Export error: ${validation.errors.join(", ")}`);
        return;
      }
      const filename = `kubito_${kubitoName}.webp`;
      await exportWebP(svg, { ...options, filename });
      trackExport("WebP", config.canvasWidth, config.canvasHeight);
      setShowExportMenu(false);
      setIsOpen(false);
    };

    const handleExportProject = () => {
      const kubitoItems = items.filter(
        (item): item is import("@/types").KubitoItem =>
          "category" in item && item.category !== undefined,
      );
      exportProject(kubitoItems, brushStrokes, config, selectedBodyId);
      trackProjectSaved();
      setShowExportMenu(false);
      setIsOpen(false);
    };

    const handleImportProject = async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const projectData = await importProject(file);
        loadProject(
          projectData.items,
          projectData.config,
          projectData.brushStrokes || [],
          projectData.selectedBodyId,
        );
        trackProjectLoaded();
      } catch (error) {
        alert("Failed to load project: " + (error as Error).message);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsOpen(false);
    };

    // Wrapper functions
    const handleExportSVGClick = () => void handleExportSVG();
    const handleExportPNGClick = () => void handleExportPNG();
    const handleExportJPEGClick = () => void handleExportJPEG();
    const handleExportWebPClick = () => void handleExportWebP();
    const handleImportProjectChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => void handleImportProject(e);

    return (
      <>
        {/* Main FAB Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 right-4 z-[70] w-14 h-14 bg-kubito-primary hover:bg-kubito-primary-hover text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          aria-label="Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </motion.button>

        {/* Menu Overlay & Content */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                onClick={() => setIsOpen(false)}
              />

              {/* Menu Content - Full Screen */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[65] flex items-start justify-center pt-20 px-4 overflow-y-auto pb-safe"
              >
                <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 space-y-4">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Kubito Maker
                    </h2>
                    <input
                      type="text"
                      value={kubitoName}
                      onChange={(e) => onNameChange(e.target.value)}
                      placeholder="Kubito name"
                      className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-kubito-primary"
                    />
                  </div>

                  {/* Main Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setShowExportMenu(true);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-4 px-5 py-4 bg-kubito-primary hover:bg-kubito-primary-hover text-white rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                    >
                      <Download className="h-6 w-6 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-semibold">Export</div>
                        <div className="text-xs opacity-90">
                          Save as PNG, SVG, JPEG, WebP
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setShowShareModal(true);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-4 px-5 py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Share2 className="h-6 w-6 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-semibold">Share</div>
                        <div className="text-xs opacity-70">
                          Share to community
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Secondary Actions */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                    <button
                      onClick={() => {
                        setShowCanvasSizeSelector(true);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left"
                    >
                      <Maximize2 className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Canvas Size
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        fileInputRef.current?.click();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left"
                    >
                      <FolderOpen className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Open Project
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        if (confirm("Clear all items?")) {
                          clearAll();
                          setIsOpen(false);
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left"
                    >
                      <Trash2 className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Clear Canvas
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setShowCommunityGallery(true);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left"
                    >
                      <Users className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Community Gallery
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setShowTipsModal(true);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-left"
                    >
                      <Info className="h-5 w-5 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Tips & Shortcuts
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Export Menu Modal */}
        <AnimatePresence>
          {showExportMenu && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
                onClick={() => setShowExportMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-0 z-[75] flex items-center justify-center p-4"
              >
                <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-6 space-y-3 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Export Options
                    </h3>
                    <button
                      onClick={() => setShowExportMenu(false)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <button
                    onClick={handleExportSVGClick}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all text-left"
                  >
                    <FileText className="h-6 w-6 text-kubito-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Export SVG
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Vector format, infinitely scalable
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleExportPNGClick}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all text-left"
                  >
                    <Image className="h-6 w-6 text-kubito-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Export PNG
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        High quality with transparency
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleExportJPEGClick}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all text-left"
                  >
                    <Image className="h-6 w-6 text-kubito-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Export JPEG
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Compressed, smaller file size
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={handleExportWebPClick}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all text-left"
                  >
                    <Image className="h-6 w-6 text-kubito-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Export WebP
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Modern format, best compression
                      </div>
                    </div>
                  </button>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-3" />

                  <button
                    onClick={handleExportProject}
                    className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all text-left"
                  >
                    <Briefcase className="h-6 w-6 text-kubito-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        Save Project
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Save as .kubito file to edit later
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".kubito,application/json"
          onChange={handleImportProjectChange}
          className="hidden"
        />

        {/* Modals */}
        <TipsModal
          isOpen={showTipsModal}
          onClose={() => setShowTipsModal(false)}
        />
        <ShareKubitoModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
        <CommunityGalleryModal
          isOpen={showCommunityGallery}
          onClose={() => setShowCommunityGallery(false)}
        />
        <CanvasSizeSelector
          isOpen={showCanvasSizeSelector}
          onClose={() => setShowCanvasSizeSelector(false)}
        />
      </>
    );
  },
);

MobileMenuFAB.displayName = "MobileMenuFAB";
