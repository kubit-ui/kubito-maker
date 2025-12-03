import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings } from 'lucide-react';
import { CANVAS_PRESETS } from '@/data';
import { useConfig, useEditorActions } from '@/store/editorStore';
import { useAnalytics } from '@/hooks';

interface CanvasSizeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CanvasSizeSelector = memo<CanvasSizeSelectorProps>(
  ({ isOpen, onClose }) => {
    const config = useConfig();
    const { setCanvasSize } = useEditorActions();
    const { trackCanvasSizeChanged } = useAnalytics();
    const [customWidth, setCustomWidth] = useState(720);
    const [customHeight, setCustomHeight] = useState(720);
    const [showCustom, setShowCustom] = useState(false);

    const handlePresetSelect = (presetId: string) => {
      const preset = CANVAS_PRESETS.find((p) => p.id === presetId);
      if (preset) {
        setCanvasSize(preset.width, preset.height, preset.id);

        // Track canvas size change
        trackCanvasSizeChanged(preset.width, preset.height, preset.id);

        onClose();
      }
    };

    const handleCustomSize = () => {
      setCanvasSize(customWidth, customHeight, 'custom');

      // Track canvas size change
      trackCanvasSizeChanged(customWidth, customHeight, 'custom');

      onClose();
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            >
              {/* Modal */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Canvas Size
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Current: {config.canvasWidth} × {config.canvasHeight}px
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(80vh-180px)]">
                  {/* Presets Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {CANVAS_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                          config.canvasPreset === preset.id
                            ? 'border-kubito-primary bg-kubito-secondary-bg dark:bg-kubito-primary/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-kubito-primary dark:hover:border-kubito-primary'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{preset.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {preset.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {preset.width} × {preset.height}px
                            </p>
                            {preset.description && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {preset.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Custom Size */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <button
                      onClick={() => setShowCustom(!showCustom)}
                      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">
                          Custom Size
                        </span>
                      </div>
                      <svg
                        className={`w-5 h-5 text-gray-500 transition-transform ${
                          showCustom ? 'rotate-180' : ''
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
                    </button>

                    {showCustom && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-4 space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Width (px)
                            </label>
                            <input
                              type="number"
                              min={100}
                              max={3840}
                              value={customWidth}
                              onChange={(e) =>
                                setCustomWidth(Number(e.target.value))
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Height (px)
                            </label>
                            <input
                              type="number"
                              min={100}
                              max={3840}
                              value={customHeight}
                              onChange={(e) =>
                                setCustomHeight(Number(e.target.value))
                              }
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleCustomSize}
                          className="w-full px-4 py-2 bg-kubito-primary hover:bg-kubito-primary-hover text-white rounded-lg font-medium transition-colors"
                        >
                          Apply Custom Size
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

CanvasSizeSelector.displayName = 'CanvasSizeSelector';
