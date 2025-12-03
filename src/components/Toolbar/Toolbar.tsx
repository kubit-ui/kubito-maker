import { memo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Briefcase, Share2, Users } from 'lucide-react';
import {
  useItems,
  useConfig,
  useKubitoName,
  useEditorActions,
  useBrushStrokes,
  useSelectedBodyId,
} from '@/store/editorStore';
import { TipsModal } from '../TipsModal';
import { ShareKubitoModal } from '../ShareKubitoModal';
import { CommunityGalleryModal } from '../CommunityGalleryModal';
import { CanvasSizeSelector } from '../CanvasSizeSelector';
import {
  exportSVG,
  exportPNG,
  exportJPEG,
  exportWebP,
  exportProject,
  importProject,
} from '@/utils/export';
import { ExportService } from '@/domain';

export const Toolbar = memo(() => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showTipsModal, setShowTipsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommunityGallery, setShowCommunityGallery] = useState(false);
  const [showCanvasSizeSelector, setShowCanvasSizeSelector] = useState(false);
  const items = useItems();
  const config = useConfig();
  const kubitoName = useKubitoName();
  const brushStrokes = useBrushStrokes();
  const selectedBodyId = useSelectedBodyId();
  const { clearAll, loadProject, setKubitoName, deselectAll } =
    useEditorActions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportSVG = async () => {
    // Deselect all items to hide selection UI
    deselectAll();

    // Small delay to ensure UI updates before export
    await new Promise((resolve) => setTimeout(resolve, 50));

    const svg = document.querySelector('#kubito-canvas') as SVGSVGElement;
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

    const svg = document.querySelector('#kubito-canvas') as SVGSVGElement;
    if (!svg) return;

    // Check if there's a background item
    const hasBackground = items.some((item) => item.category === 'Backgrounds');

    // Create options for export
    const options = ExportService.createDefaultOptions(
      config.canvasWidth,
      config.canvasHeight
    );
    options.format = 'png';
    // Set transparent background if no background item exists
    options.transparentBackground = !hasBackground;

    // Validate options
    const validation = ExportService.validateOptions(options);
    if (!validation.valid) {
      alert(`Export error: ${validation.errors.join(', ')}`);
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

    const svg = document.querySelector('#kubito-canvas') as SVGSVGElement;
    if (!svg) return;

    // Create options for export
    const options = ExportService.createDefaultOptions(
      config.canvasWidth,
      config.canvasHeight
    );
    options.format = 'jpeg';
    options.quality = 0.98; // High quality JPEG (0-1 range)

    // Validate options
    const validation = ExportService.validateOptions(options);
    if (!validation.valid) {
      alert(`Export error: ${validation.errors.join(', ')}`);
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

    const svg = document.querySelector('#kubito-canvas') as SVGSVGElement;
    if (!svg) return;

    // Check if there's a background item
    const hasBackground = items.some((item) => item.category === 'Backgrounds');

    // Create options for export
    const options = ExportService.createDefaultOptions(
      config.canvasWidth,
      config.canvasHeight
    );
    options.format = 'webp';
    options.quality = 0.95; // High quality WebP (0-1 range)
    // Set transparent background if no background item exists
    options.transparentBackground = !hasBackground;

    // Validate options
    const validation = ExportService.validateOptions(options);
    if (!validation.valid) {
      alert(`Export error: ${validation.errors.join(', ')}`);
      return;
    }

    const filename = `kubito_${kubitoName}.webp`;
    await exportWebP(svg, { ...options, filename });
    setShowExportMenu(false);
  };

  const handleExportProject = () => {
    exportProject(items, brushStrokes, config, selectedBodyId);
    setShowExportMenu(false);
  };

  const handleImportProject = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const projectData = await importProject(file);
      loadProject(
        projectData.items,
        projectData.config,
        projectData.brushStrokes || [],
        projectData.selectedBodyId
      );
    } catch (error) {
      alert('Failed to load project: ' + (error as Error).message);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    void handleImportProject(e);
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="relative z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-3 flex items-center gap-3 flex-wrap"
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
          className="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-kubito-primary shadow-sm min-w-[150px]"
        />
      </div>

      <div className="flex-1" />

      {/* Canvas Size - Icon only */}
      <div className="relative group">
        <button
          onClick={() => setShowCanvasSizeSelector(true)}
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

      {/* Clear Canvas - Icon only */}
      <div className="relative group">
        <button
          onClick={() => {
            if (confirm('Clear all items?')) clearAll();
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
      <div className="relative group">
        <button
          onClick={() => setShowExportMenu(!showExportMenu)}
          className="p-2.5 bg-kubito-primary text-white rounded-lg hover:bg-kubito-primary-hover transition-colors"
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
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
        {/* Tooltip */}
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap border border-gray-200 dark:border-gray-600">
            Export
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-white dark:border-b-gray-700" />
          </div>
        </div>

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

      {/* Share to Community - Secondary style with primary color hover */}
      <button
        onClick={() => setShowShareModal(true)}
        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-kubito-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 font-medium"
      >
        <Share2 className="w-4 h-4" />
        <span className="text-sm">Share</span>
      </button>

      {/* Community Gallery - Secondary style with primary color hover */}
      <button
        onClick={() => setShowCommunityGallery(true)}
        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-kubito-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2 font-medium"
      >
        <Users className="w-4 h-4" />
        <span className="text-sm">Gallery</span>
      </button>

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

      {/* Share Kubito Modal */}
      <ShareKubitoModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* Community Gallery Modal */}
      <CommunityGalleryModal
        isOpen={showCommunityGallery}
        onClose={() => setShowCommunityGallery(false)}
      />

      {/* Canvas Size Selector */}
      <CanvasSizeSelector
        isOpen={showCanvasSizeSelector}
        onClose={() => setShowCanvasSizeSelector(false)}
      />
    </motion.div>
  );
});

Toolbar.displayName = 'Toolbar';
