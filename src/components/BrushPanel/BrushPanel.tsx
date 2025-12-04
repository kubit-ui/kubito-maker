import { Paintbrush, Eraser, MousePointer2 } from 'lucide-react';
import {
  useBrushMode,
  useBrushSettings,
  useEditorActions,
} from '@/store/editorStore';

const PRESET_COLORS = [
  '#000000', // Negro
  '#FFFFFF', // Blanco
  '#DF2B52', // Kubito Primary
  '#FF6B6B', // Rojo
  '#4ECDC4', // Turquesa
  '#45B7D1', // Azul
  '#96CEB4', // Verde
  '#FFEAA7', // Amarillo
  '#DFE6E9', // Gris claro
  '#74B9FF', // Azul claro
  '#A29BFE', // Púrpura
  '#FD79A8', // Rosa
];

export function BrushPanel() {
  const brushMode = useBrushMode();
  const brushSettings = useBrushSettings();
  const { setBrushMode, selectStroke, updateBrushSettings } =
    useEditorActions();

  const handleBrushMode = () => {
    setBrushMode(brushMode === 'brush' ? 'none' : 'brush');
  };

  const handleEraserMode = () => {
    setBrushMode(brushMode === 'eraser' ? 'none' : 'eraser');
  };

  const handleSelectMode = () => {
    const newMode = brushMode === 'select' ? 'none' : 'select';
    setBrushMode(newMode);
    // Deseleccionar trazo cuando se desactiva el modo de selección
    if (newMode === 'none') {
      selectStroke(null);
    }
  };

  const handleSizeChange = (size: number) => {
    updateBrushSettings({ size });
  };

  const handleColorChange = (color: string) => {
    updateBrushSettings({ color });
  };

  return (
    <div className="h-full overflow-y-auto p-4 bg-white dark:bg-gray-900">
      <h2 className="mb-4 text-sm font-semibold text-gray-800 dark:text-gray-100">
        Brush Tools
      </h2>

      {/* Herramientas de Pincel */}
      <div className="grid grid-cols-3 gap-3">
        {/* Botón Pincel */}
        <button
          onClick={handleBrushMode}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all hover:scale-105 ${
            brushMode === 'brush'
              ? 'border-kubito-primary bg-kubito-secondary-bg dark:bg-kubito-primary/20 shadow-lg'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
          title="Brush"
        >
          <Paintbrush
            size={28}
            className={
              brushMode === 'brush'
                ? 'text-kubito-primary'
                : 'text-gray-600 dark:text-gray-400'
            }
          />
          <span
            className={`text-xs font-medium ${
              brushMode === 'brush'
                ? 'text-kubito-primary'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Brush
          </span>
        </button>

        {/* Botón Goma */}
        <button
          onClick={handleEraserMode}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all hover:scale-105 ${
            brushMode === 'eraser'
              ? 'border-kubito-primary bg-kubito-secondary-bg dark:bg-kubito-primary/20 shadow-lg'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
          title="Eraser"
        >
          <Eraser
            size={28}
            className={
              brushMode === 'eraser'
                ? 'text-kubito-primary'
                : 'text-gray-600 dark:text-gray-400'
            }
          />
          <span
            className={`text-xs font-medium ${
              brushMode === 'eraser'
                ? 'text-kubito-primary'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Eraser
          </span>
        </button>

        {/* Botón Seleccionar */}
        <button
          onClick={handleSelectMode}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 p-4 transition-all hover:scale-105 ${
            brushMode === 'select'
              ? 'border-kubito-primary bg-kubito-secondary-bg dark:bg-kubito-primary/20 shadow-lg'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
          title="Select"
        >
          <MousePointer2
            size={28}
            className={
              brushMode === 'select'
                ? 'text-kubito-primary'
                : 'text-gray-600 dark:text-gray-400'
            }
          />
          <span
            className={`text-xs font-medium ${
              brushMode === 'select'
                ? 'text-kubito-primary'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            Select
          </span>
        </button>
      </div>

      {/* Tamaño del Pincel */}
      <div className="mt-6 mb-4">
        <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
          <span>Size</span>
          <span className="text-kubito-primary">{brushSettings.size}px</span>
        </label>
        <input
          type="range"
          min="1"
          max="100"
          value={brushSettings.size}
          onChange={(e) => handleSizeChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Color */}
      <div className="mb-4">
        <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
          <span>Color</span>
          <div
            className="h-5 w-5 rounded border-2 border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: brushSettings.color }}
          />
        </label>
        <div className="mb-1.5 grid grid-cols-6 gap-1.5">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`h-8 w-8 rounded border-2 transition-all ${
                brushSettings.color === color
                  ? 'border-kubito-primary scale-110'
                  : 'border-gray-300 dark:border-gray-600 hover:scale-105'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
        <input
          type="color"
          value={brushSettings.color}
          onChange={(e) => handleColorChange(e.target.value)}
          className="h-8 w-full rounded border-2 border-gray-300 dark:border-gray-600"
        />
      </div>
    </div>
  );
}
