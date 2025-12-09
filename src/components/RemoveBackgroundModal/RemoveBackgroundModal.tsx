import { memo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Loader2, Sparkles } from "lucide-react";

interface RemoveBackgroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (removeBackground: boolean) => Promise<void>;
  format: "PNG" | "WebP";
}

/**
 * Modal to ask user if they want to remove background before export
 * Only shown for PNG and WebP formats
 */
export const RemoveBackgroundModal = memo<RemoveBackgroundModalProps>(
  ({ isOpen, onClose, onExport, format }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingStep, setProcessingStep] = useState<
      "exporting" | "removing" | "downloading"
    >("exporting");

    const handleExport = async (removeBackground: boolean) => {
      setIsProcessing(true);
      try {
        if (removeBackground) {
          setProcessingStep("exporting");
          await new Promise((resolve) => setTimeout(resolve, 300));
          setProcessingStep("removing");
        }
        await onExport(removeBackground);
        setProcessingStep("downloading");
        await new Promise((resolve) => setTimeout(resolve, 500));
        onClose();
      } catch (error) {
        console.error("Export error:", error);
        alert("Failed to export image: " + (error as Error).message);
      } finally {
        setIsProcessing(false);
        setProcessingStep("exporting");
      }
    };

    const getProcessingMessage = () => {
      switch (processingStep) {
        case "exporting":
          return "Exporting image...";
        case "removing":
          return "Removing background...";
        case "downloading":
          return "Downloading...";
      }
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
              onClick={isProcessing ? undefined : onClose}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-[75] flex items-center justify-center p-4"
            >
              <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-kubito-primary/10 rounded-full flex items-center justify-center">
                      <Download className="h-5 w-5 text-kubito-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Export as {format}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Choose your export options
                      </p>
                    </div>
                  </div>
                  {!isProcessing && (
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  )}
                </div>

                {/* Content */}
                {isProcessing ? (
                  <div className="p-8 flex flex-col items-center gap-4">
                    <Loader2 className="h-12 w-12 text-kubito-primary animate-spin" />
                    <div className="text-center">
                      <p className="text-base font-medium text-gray-900 dark:text-white mb-1">
                        {getProcessingMessage()}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Please wait...
                      </p>
                    </div>
                    {processingStep === "removing" && (
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 3, ease: "easeInOut" }}
                          className="h-full bg-kubito-primary"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      Do you want to remove the background from your kubito
                      before exporting?
                    </p>

                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                      <p className="text-xs text-blue-800 dark:text-blue-300">
                        <strong>Note:</strong> This will remove colors similar
                        to the canvas background (corners). Works best with
                        solid, light backgrounds.
                      </p>
                    </div>

                    {/* Remove Background Option */}
                    <button
                      onClick={() => void handleExport(true)}
                      className="w-full p-4 border-2 border-kubito-primary bg-kubito-primary/5 hover:bg-kubito-primary/10 rounded-xl transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-kubito-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            Remove Background
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Transparent background (instant processing)
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Keep Background Option */}
                    <button
                      onClick={() => void handleExport(false)}
                      className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-900 dark:text-white">
                            Keep Background
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Export as-is (instant)
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Info */}
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <p className="text-xs text-blue-800 dark:text-blue-200">
                        💡 <strong>Tip:</strong> Background removal detects and
                        removes colors similar to the canvas background. The
                        result will have a transparent background.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  },
);

RemoveBackgroundModal.displayName = "RemoveBackgroundModal";
