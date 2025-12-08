import { memo, useState, useRef } from "react";
import { Palette, Layers, Menu, X, Wand2 } from "lucide-react";
import { motion, AnimatePresence, useDragControls } from "framer-motion";

type MobileTab = "assets" | "layers" | "tools";

interface MobileFloatingButtonsProps {
  onTabClick: (tab: MobileTab) => void;
  activeTab: MobileTab | null;
}

/**
 * Draggable Floating Action Button for mobile
 * Can be dragged around the screen and expands to show panel options
 */
export const MobileFloatingButtons = memo<MobileFloatingButtonsProps>(
  ({ onTabClick, activeTab }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dragControls = useDragControls();
    const constraintsRef = useRef(null);

    const buttons: Array<{
      id: MobileTab;
      icon: typeof Palette;
      label: string;
      description: string;
    }> = [
      {
        id: "assets",
        icon: Palette,
        label: "Assets",
        description: "Bodies, Eyes, Hairs...",
      },
      {
        id: "layers",
        icon: Layers,
        label: "Layers",
        description: "Manage elements",
      },
      {
        id: "tools",
        icon: Wand2,
        label: "Tools",
        description: "Brush, Text, Filters",
      },
    ];

    const handleOptionClick = (tab: MobileTab) => {
      onTabClick(tab);
      setIsOpen(false);
    };

    return (
      <>
        {/* Drag constraints container */}
        <div
          ref={constraintsRef}
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: -1 }}
        />

        {/* Main FAB Button - Draggable */}
        <motion.button
          drag
          dragControls={dragControls}
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          dragMomentum={false}
          whileDrag={{ scale: 1.1, cursor: "grabbing" }}
          initial={{ x: 0, y: 0, scale: 0 }}
          animate={{ x: 0, y: 0, scale: 1 }}
          transition={{
            scale: { delay: 0.2, type: "spring", stiffness: 260, damping: 20 },
          }}
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed bottom-6 left-6 z-[80] w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-colors cursor-grab ${
            activeTab
              ? "bg-kubito-primary text-white"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
          }`}
          aria-label="Menu"
        >
          {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </motion.button>

        {/* Expanded Options - Quick Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[75]"
                onClick={() => setIsOpen(false)}
              />

              {/* Options Panel - Shows above the FAB */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed bottom-28 left-6 z-[85] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-2 space-y-1 border border-gray-200 dark:border-gray-700 min-w-[180px]"
              >
                {buttons.map(({ id, icon: Icon, label, description }) => (
                  <button
                    key={id}
                    onClick={() => handleOptionClick(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      activeTab === id
                        ? "bg-kubito-primary text-white shadow-lg"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{label}</div>
                      <div
                        className={`text-xs ${
                          activeTab === id
                            ? "text-white/80"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {description}
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  },
);

MobileFloatingButtons.displayName = "MobileFloatingButtons";



