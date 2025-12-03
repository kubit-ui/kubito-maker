import { Circle, Trash2, Eraser, MousePointer2 } from 'lucide-react';
import {
  useBrushSettings,
  useEditorActions,
  useBrushStrokes,
  useBrushMode,
} from '@/store/editorStore';
import type { BrushType } from '@/types';

const BRUSH_TYPES: Array<{
  type: BrushType;
  icon: React.ReactNode;
  label: string;
}> = [{ type: 'round', icon: <Circle size={18} />, label: 'Pencil Round' }];

const PRESET_SIZES = [1, 2, 5, 10, 20, 30, 50];
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
  const brushSettings = useBrushSettings();
  const brushStrokes = useBrushStrokes();
  const brushMode = useBrushMode();
  const { updateBrushSettings, clearAllStrokes, setBrushMode, selectStroke } =
    useEditorActions();

  const handleTypeChange = (type: BrushType) => {
    console.warn('🎨 handleTypeChange called with type:', type);
    updateBrushSettings({ type });
    // Activar el modo brush cuando se selecciona un tipo
    setBrushMode('brush');
    console.warn("🎨 Brush mode set to 'brush'");
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

  const handleOpacityChange = (opacity: number) => {
    updateBrushSettings({ opacity });
  };

  const handleSmoothingChange = (smoothing: number) => {
    updateBrushSettings({ smoothing });
  };

  return (
    <div className="h-full overflow-y-auto p-3 bg-white dark:bg-gray-900">
      <h2 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
        Brush
      </h2>

      {/* Tipo de Pincel */}
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-medium text-gray-700 dark:text-gray-300">
          Type
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {BRUSH_TYPES.map(({ type, icon, label }) => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`flex flex-col items-center justify-center gap-0.5 rounded-md border-2 p-1.5 transition-colors ${
                brushSettings.type === type && brushMode === 'brush'
                  ? 'border-kubito-primary bg-kubito-secondary-bg dark:bg-kubito-primary/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              title={label}
            >
              {icon}
              <span className="text-[10px]">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Eraser Mode */}
      <div className="mb-4">
        <button
          onClick={handleEraserMode}
          className={`flex w-full items-center justify-center gap-2 rounded-md border-2 p-2 transition-colors ${
            brushMode === 'eraser'
              ? 'border-kubito-primary bg-kubito-secondary-bg dark:bg-kubito-primary/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <Eraser size={18} />
          <span className="text-xs font-medium">Eraser Mode</span>
        </button>
      </div>

      {/* Select Mode */}
      <div className="mb-4">
        <button
          onClick={handleSelectMode}
          className={`flex w-full items-center justify-center gap-2 rounded-md border-2 p-2 transition-colors ${
            brushMode === 'select'
              ? 'border-kubito-primary bg-kubito-secondary-bg dark:bg-kubito-primary/20'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <MousePointer2 size={18} />
          <span className="text-xs font-medium">Select Mode</span>
        </button>
      </div>

      {/* Tamaño del Pincel */}
      <div className="mb-4">
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
        <div className="mt-1.5 flex flex-wrap gap-1">
          {PRESET_SIZES.map((size) => (
            <button
              key={size}
              onClick={() => handleSizeChange(size)}
              className={`rounded px-2 py-0.5 text-xs transition-colors ${
                brushSettings.size === size
                  ? 'bg-kubito-primary text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {size}px
            </button>
          ))}
        </div>
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

      {/* Opacidad */}
      <div className="mb-4">
        <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
          <span>Opacity</span>
          <span className="text-kubito-primary">
            {Math.round(brushSettings.opacity * 100)}%
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={brushSettings.opacity}
          onChange={(e) => handleOpacityChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Suavizado */}
      <div className="mb-4">
        <label className="mb-1.5 flex items-center justify-between text-xs font-medium text-gray-700 dark:text-gray-300">
          <span>Smoothing</span>
          <span className="text-kubito-primary">
            {Math.round(brushSettings.smoothing * 100)}%
          </span>
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={brushSettings.smoothing}
          onChange={(e) => handleSmoothingChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Acciones */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
        <h3 className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
          Strokes ({brushStrokes.length})
        </h3>

        {brushStrokes.length > 0 ? (
          <button
            onClick={clearAllStrokes}
            className="flex w-full items-center justify-center gap-1.5 rounded bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        ) : (
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            No strokes
          </p>
        )}
      </div>
    </div>
  );
}
