import { memo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Image, Briefcase } from "lucide-react";
import {
  useItems,
  useConfig,
  useKubitoName,
  useEditorActions,
} from "@/store/editorStore";
import { TipsModal } from "../TipsModal";
import { GalleryModal } from "../GalleryModal";
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

export const Toolbar = memo(() => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [showCanvasSizeSelector, setShowCanvasSizeSelector] = useState(false);
  const items = useItems();
  const config = useConfig();
  const kubitoName = useKubitoName();
  const { clearAll, loadProject, setKubitoName, deselectAll } =
    useEditorActions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportSVG = async () => {
    // Deselect all items to hide selection UI
    deselectAll();

    // Small delay to ensure UI updates before export
    await new Promise((resolve) => setTimeout(resolve, 50));

    const svg = document.querySelector("#kubito-canvas") as SVGSVGElement;
    if (!svg) return;

    // Generate filename with kubito name
    const filename = `kubito_${kubitoName}.svg`;
    await exportSVG(svg, filename);
    setShowExportMenu(false);
  };

  const handleExportPNG = async () => {
    // Deselect all items to hide selection UI
    deselectAll();

    // Small delay to ensure UI updates before export
    await new Promise((resolve) => setTimeout(resolve, 50));

    const svg = document.querySelector("#kubito-canvas") as SVGSVGElement;
    if (!svg) return;

    // Create options for export
    const options = ExportService.createDefaultOptions(
      config.canvasWidth,
      config.canvasHeight,
    );
    options.format = "png";

    // Validate options
    const validation = ExportService.validateOptions(options);
    if (!validation.valid) {
      alert(`Export error: ${validation.errors.join(", ")}`);
      return;
    }

    const filename = `kubito_${kubitoName}.png`;
    await exportPNG(svg, { ...options, filename });
    setShowExportMenu(false);
  };

  const handleExportJPEG = async () => {
    // Deselect all items to hide selection UI
    deselectAll();

    // Small delay to ensure UI updates before export
    await new Promise((resolve) => setTimeout(resolve, 50));

    const svg = document.querySelector("#kubito-canvas") as SVGSVGElement;
    if (!svg) return;

    // Create options for export
    const options = ExportService.createDefaultOptions(
      config.canvasWidth,
      config.canvasHeight,
    );
    options.format = "jpeg";
    options.quality = 0.98; // High quality JPEG (0-1 range)

    // Validate options
    const validation = ExportService.validateOptions(options);
    if (!validation.valid) {
      alert(`Export error: ${validation.errors.join(", ")}`);
      return;
    }

    const filename = `kubito_${kubitoName}.jpeg`;
    await exportJPEG(svg, { ...options, filename });
    setShowExportMenu(false);
  };

  const handleExportWebP = async () => {
    // Deselect all items to hide selection UI
    deselectAll();

    // Small delay to ensure UI updates before export
    await new Promise((resolve) => setTimeout(resolve, 50));

    const svg = document.querySelector("#kubito-canvas") as SVGSVGElement;
    if (!svg) return;

    // Create options for export
    const options = ExportService.createDefaultOptions(
      config.canvasWidth,
      config.canvasHeight,
    );
    options.format = "webp";
    options.quality = 0.95; // High quality WebP (0-1 range)

    // Validate options
    const validation = ExportService.validateOptions(options);
    if (!validation.valid) {
      alert(`Export error: ${validation.errors.join(", ")}`);
      return;
    }

    const filename = `kubito_${kubitoName}.webp`;
    await exportWebP(svg, { ...options, filename });
    setShowExportMenu(false);
  };

  const handleExportProject = () => {
    exportProject(items);
    setShowExportMenu(false);
  };

  const handleImportProject = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const projectItems = await importProject(file);
      loadProject(projectItems);
    } catch (error) {
      alert("Failed to load project: " + (error as Error).message);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Wrapper functions to handle async operations in event handlers
  const handleExportSVGClick = () => {
    void handleExportSVG();
  };

  const handleExportPNGClick = () => {
    void handleExportPNG();
  };

  const handleExportJPEGClick = () => {
    void handleExportJPEG();
  };

  const handleExportWebPClick = () => {
    void handleExportWebP();
  };

  const handleImportProjectChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    void handleImportProject(e);
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-3 flex items-center gap-3 flex-wrap"
    >
      {/* Title */}
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
        Kubito Maker
      </h1>

      {/* Kubito Name Input */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="kubito-name"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Name:
        </label>
        <input
          id="kubito-name"
          type="text"
          value={kubitoName}
          onChange={(e) => setKubitoName(e.target.value)}
          placeholder="my-kubito"
          className="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm min-w-[150px]"
        />
      </div>

      <div className="flex-1" />

      {/* Canvas Size - Icon only */}
      <div className="relative group">
        <button
          onClick={() => setShowCanvasSizeSelector(true)}
          className="p-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </button>
        {/* Tooltip */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-gray-200 dark:border-gray-600">
            Canvas Size
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-white dark:border-b-gray-700" />
          </div>
        </div>
      </div>

      {/* Load Project - Icon only */}
      <div className="relative group">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
        </button>
        {/* Tooltip */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-gray-200 dark:border-gray-600">
            Open Project
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-white dark:border-b-gray-700" />
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".kubito,application/json"
        onChange={handleImportProjectChange}
        className="hidden"
      />

      {/* Gallery - Icon only */}
      <div className="relative group">
        <button
          onClick={() => setShowGalleryModal(true)}
          className="p-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors shadow-md"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
        {/* Tooltip */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-gray-200 dark:border-gray-600">
            Gallery
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-white dark:border-b-gray-700" />
          </div>
        </div>
      </div>

      {/* Clear Canvas - Icon only */}
      <div className="relative group">
        <button
          onClick={() => {
            if (confirm("Clear all items?")) clearAll();
          }}
          className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
        {/* Tooltip */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-gray-200 dark:border-gray-600">
            Clear Canvas
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-white dark:border-b-gray-700" />
          </div>
        </div>
      </div>

      {/* Info/Tips - Icon only */}
      <div className="relative group">
        <button
          onClick={() => setShowTipsModal(true)}
          className="p-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        {/* Tooltip */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-gray-200 dark:border-gray-600">
            Tips & Shortcuts
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-white dark:border-b-gray-700" />
          </div>
        </div>
      </div>

      {/* Export Menu */}
      <div className="relative">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium"
        >
          Export
        </button>

        {showExportMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-2 space-y-1">
              <button
                onClick={handleExportSVGClick}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> Export SVG
              </button>
              <button
                onClick={handleExportPNGClick}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Image className="h-4 w-4" /> Export PNG
              </button>
              <button
                onClick={handleExportJPEGClick}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Image className="h-4 w-4" /> Export JPEG
              </button>
              <button
                onClick={handleExportWebPClick}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Image className="h-4 w-4" /> Export WebP
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
              <button
                onClick={handleExportProject}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" /> Save Project (.kubito)
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Close export menu when clicking outside */}
      {showExportMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowExportMenu(false)}
        />
      )}

      {/* Tips Modal */}
      <TipsModal
        isOpen={showTipsModal}
        onClose={() => setShowTipsModal(false)}
      />

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={showGalleryModal}
        onClose={() => setShowGalleryModal(false)}
      />

      {/* Canvas Size Selector */}
      <CanvasSizeSelector
        isOpen={showCanvasSizeSelector}
        onClose={() => setShowCanvasSizeSelector(false)}
      />
    </motion.div>
  );
});

Toolbar.displayName = "Toolbar";
