import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  RotateCw,
  Palette,
  Ruler,
  Eye,
  Lock,
  Download,
  Search,
} from "lucide-react";

interface TipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TipsModal = memo<TipsModalProps>(({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Tips and Shortcuts
              </h2>
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

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
            <div className="space-y-6">
              {/* Keyboard Shortcuts */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
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
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  Keyboard Shortcuts
                </h3>
                <div className="grid gap-3">
                  <ShortcutItem
                    keys={["Cmd/Ctrl", "Z"]}
                    description="Undo last action"
                  />
                  <ShortcutItem
                    keys={["Cmd/Ctrl", "Shift", "Z"]}
                    description="Redo action"
                  />
                  <ShortcutItem
                    keys={["Cmd/Ctrl", "D"]}
                    description="Duplicate selected element"
                  />
                  <ShortcutItem
                    keys={["Delete", "/", "Backspace"]}
                    description="Delete selected element"
                  />
                  <ShortcutItem
                    keys={["←", "→", "↑", "↓"]}
                    description="Move element 1px (+ Shift for 10px)"
                  />
                  <ShortcutItem
                    keys={["Scroll"]}
                    description="Zoom with mouse wheel (selected element)"
                  />
                </div>
              </section>

              {/* Usage Tips */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
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
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Usage Tips
                </h3>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                  <TipItem
                    icon={Target}
                    text="Click or drag assets from the left panel to the canvas"
                  />
                  <TipItem
                    icon={RotateCw}
                    text="Use circular handles to scale and the top handle to rotate"
                  />
                  <TipItem
                    icon={Palette}
                    text="Change colors from the Inspector using palettes or the custom picker"
                  />
                  <TipItem
                    icon={Ruler}
                    text="You can type exact values in the Inspector's numeric fields"
                  />
                  <TipItem
                    icon={Eye}
                    text="Use the eye button to temporarily hide elements without deleting them"
                  />
                  <TipItem
                    icon={Lock}
                    text="Lock elements to protect them from accidental changes"
                  />
                  <TipItem
                    icon={Download}
                    text="Export your creation as SVG for perfect quality or PNG/JPG for images"
                  />
                  <TipItem
                    icon={Search}
                    text="Use the asset search to quickly find what you need"
                  />
                </div>
              </section>

              {/* Export Options */}
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
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
                  Export Options
                </h3>
                <div className="space-y-3">
                  <ExportOption
                    format="SVG"
                    description="Scalable vector format, ideal for logos and graphics that need perfect sizing"
                    badge="Vector"
                  />
                  <ExportOption
                    format="PNG"
                    description="Raster image with transparency support, ideal for web and social media"
                    badge="720x720"
                  />
                  <ExportOption
                    format="JPG"
                    description="Compressed image with white background, smaller file size"
                    badge="720x720"
                  />
                  <ExportOption
                    format="Project (.kubito)"
                    description="Save all your work to continue editing later"
                    badge="JSON"
                  />
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center flex items-center justify-center gap-2">
              <Palette className="h-4 w-4" />
              Have questions? Experiment and have fun creating your unique
              Kubitos
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

TipsModal.displayName = "TipsModal";

// Helper components
interface ShortcutItemProps {
  keys: string[];
  description: string;
}

const ShortcutItem = memo<ShortcutItemProps>(({ keys, description }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
    <span className="text-sm text-gray-700 dark:text-gray-300">
      {description}
    </span>
    <div className="flex gap-1">
      {keys.map((key, idx) => (
        <kbd
          key={idx}
          className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm"
        >
          {key}
        </kbd>
      ))}
    </div>
  </div>
));

ShortcutItem.displayName = "ShortcutItem";

interface TipItemProps {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

const TipItem = memo<TipItemProps>(({ icon: Icon, text }) => (
  <div className="flex gap-3 items-start">
    <Icon className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
    <p className="flex-1">{text}</p>
  </div>
));

TipItem.displayName = "TipItem";

interface ExportOptionProps {
  format: string;
  description: string;
  badge: string;
}

const ExportOption = memo<ExportOptionProps>(
  ({ format, description, badge }) => (
    <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-medium text-gray-900 dark:text-white">{format}</h4>
        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
          {badge}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  ),
);

ExportOption.displayName = "ExportOption";
