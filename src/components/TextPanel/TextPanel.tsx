import { Type, Italic, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useState } from 'react';
import type { FontFamily, FontWeight, TextAlign, TextSettings } from '@/types';
import { useSelectedId, useItems, useEditorActions } from '@/store/editorStore';

const FONT_FAMILIES: FontFamily[] = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Raleway',
  'Playfair Display',
  'Merriweather',
  'Bebas Neue',
  'Pacifico',
  'Lobster',
  'Dancing Script',
  'Caveat',
  'Permanent Marker',
  'Indie Flower',
  'Comic Neue',
  'Courier Prime',
];

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 64, 72, 96];
const FONT_WEIGHTS: Array<{ value: FontWeight; label: string }> = [
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semi Bold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' },
  { value: 900, label: 'Black' },
];

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

interface TextPanelProps {
  textSettings: TextSettings;
  onSettingsChange: (settings: Partial<TextSettings>) => void;
  onAddText: () => void;
  onClose?: () => void;
}

export function TextPanel({
  textSettings,
  onSettingsChange,
  onAddText,
  onClose,
}: TextPanelProps) {
  const selectedId = useSelectedId();
  const items = useItems();
  const { updateTextStyle } = useEditorActions();

  // Find selected text item
  const selectedTextItem = items.find(
    (item) =>
      item.id === selectedId && 'type' in item && (item as any).type === 'text'
  );

  // Determine which settings to display (selected text or global defaults)
  const displaySettings = selectedTextItem
    ? (selectedTextItem as any).settings
    : textSettings;

  const [customColor, setCustomColor] = useState(displaySettings.color);

  const handleFontFamilyChange = (fontFamily: FontFamily) => {
    if (selectedTextItem) {
      updateTextStyle(selectedTextItem.id, { fontFamily });
    } else {
      onSettingsChange({ fontFamily });
    }
  };

  const handleFontSizeChange = (fontSize: number) => {
    if (selectedTextItem) {
      updateTextStyle(selectedTextItem.id, { fontSize });
    } else {
      onSettingsChange({ fontSize });
    }
  };

  const handleFontWeightChange = (fontWeight: FontWeight) => {
    if (selectedTextItem) {
      updateTextStyle(selectedTextItem.id, { fontWeight });
    } else {
      onSettingsChange({ fontWeight });
    }
  };

  const handleColorChange = (color: string) => {
    setCustomColor(color);
    if (selectedTextItem) {
      updateTextStyle(selectedTextItem.id, { color });
    } else {
      onSettingsChange({ color });
    }
  };

  const handleAlignChange = (textAlign: TextAlign) => {
    if (selectedTextItem) {
      updateTextStyle(selectedTextItem.id, { textAlign });
    } else {
      onSettingsChange({ textAlign });
    }
  };

  const handleOpacityChange = (opacity: number) => {
    if (selectedTextItem) {
      updateTextStyle(selectedTextItem.id, { opacity });
    } else {
      onSettingsChange({ opacity });
    }
  };

  const handleItalicToggle = () => {
    if (selectedTextItem) {
      updateTextStyle(selectedTextItem.id, {
        italic: !(selectedTextItem as any).settings.italic,
      });
    } else {
      onSettingsChange({ italic: !displaySettings.italic });
    }
  };

  const handleLineHeightChange = (lineHeight: number) => {
    if (selectedTextItem) {
      updateTextStyle(selectedTextItem.id, { lineHeight });
    } else {
      onSettingsChange({ lineHeight });
    }
  };

  const handleLetterSpacingChange = (letterSpacing: number) => {
    if (selectedTextItem) {
      updateTextStyle(selectedTextItem.id, { letterSpacing });
    } else {
      onSettingsChange({ letterSpacing });
    }
  };

  return (
    <div className="h-full overflow-y-auto p-3 bg-white dark:bg-gray-900">
      <h2 className="mb-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
        Text
      </h2>

      {/* Add Text Button */}
      <button
        onClick={() => {
          onAddText();
          // Close panel in mobile after adding text
          if (onClose) {
            onClose();
          }
        }}
        className="w-full mb-4 px-4 py-3 bg-kubito-primary text-white rounded-lg hover:bg-kubito-primary-dark transition-colors flex items-center justify-center gap-2 font-medium"
      >
        <Type size={18} />
        Add Text
      </button>

      {/* Font Family */}
      <div className="mb-4">
        <label className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          Font Family
        </label>
        <select
          value={displaySettings.fontFamily}
          onChange={(e) => handleFontFamilyChange(e.target.value as FontFamily)}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          style={{ fontFamily: displaySettings.fontFamily }}
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div className="mb-4">
        <label className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          Font Size: {displaySettings.fontSize}px
        </label>
        <select
          value={displaySettings.fontSize}
          onChange={(e) => handleFontSizeChange(Number(e.target.value))}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {FONT_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}px
            </option>
          ))}
        </select>
      </div>

      {/* Font Weight */}
      <div className="mb-4">
        <label className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          Font Weight
        </label>
        <select
          value={displaySettings.fontWeight}
          onChange={(e) =>
            handleFontWeightChange(Number(e.target.value) as FontWeight)
          }
          className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {FONT_WEIGHTS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Text Alignment */}
      <div className="mb-4">
        <label className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          Alignment
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => handleAlignChange('left')}
            className={`flex-1 p-2 border rounded transition-colors ${
              displaySettings.textAlign === 'left'
                ? 'border-kubito-primary bg-kubito-secondary-bg dark:bg-kubito-primary/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            title="Align Left"
          >
            <AlignLeft size={18} className="mx-auto" />
          </button>
          <button
            onClick={() => handleAlignChange('center')}
            className={`flex-1 p-2 border rounded transition-colors ${
              displaySettings.textAlign === 'center'
                ? 'border-kubito-primary bg-kubito-secondary-bg dark:bg-kubito-primary/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            title="Align Center"
          >
            <AlignCenter size={18} className="mx-auto" />
          </button>
          <button
            onClick={() => handleAlignChange('right')}
            className={`flex-1 p-2 border rounded transition-colors ${
              displaySettings.textAlign === 'right'
                ? 'border-kubito-primary bg-kubito-secondary-bg dark:bg-kubito-primary/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            title="Align Right"
          >
            <AlignRight size={18} className="mx-auto" />
          </button>
        </div>
      </div>

      {/* Style Toggles */}
      <div className="mb-4">
        <label className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          Style
        </label>
        <div className="flex gap-2">
          <button
            onClick={handleItalicToggle}
            className={`flex-1 p-2 border rounded transition-colors flex items-center justify-center ${
              displaySettings.italic
                ? 'border-kubito-primary bg-kubito-secondary-bg dark:bg-kubito-primary/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            title="Italic"
          >
            <Italic size={18} />
          </button>
        </div>
      </div>

      {/* Color Picker */}
      <div className="mb-4">
        <label className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          Color
        </label>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="color"
            value={customColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="h-8 w-12 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="#000000"
          />
        </div>
        <div className="grid grid-cols-6 gap-1.5">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-full h-8 rounded border-2 transition-transform hover:scale-105 ${
                displaySettings.color === color
                  ? 'border-kubito-primary scale-110'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Opacity */}
      <div className="mb-4">
        <label className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          Opacity: {Math.round(displaySettings.opacity * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={displaySettings.opacity}
          onChange={(e) => handleOpacityChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Line Height */}
      <div className="mb-4">
        <label className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          Line Height: {displaySettings.lineHeight.toFixed(1)}
        </label>
        <input
          type="range"
          min="0.8"
          max="3"
          step="0.1"
          value={displaySettings.lineHeight}
          onChange={(e) => handleLineHeightChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Letter Spacing */}
      <div className="mb-4">
        <label className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          Letter Spacing: {displaySettings.letterSpacing}px
        </label>
        <input
          type="range"
          min="-5"
          max="20"
          step="0.5"
          value={displaySettings.letterSpacing}
          onChange={(e) => handleLetterSpacingChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Preview */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
        <label className="block mb-1.5 text-xs font-medium text-gray-700 dark:text-gray-300">
          Preview
        </label>
        <div
          className="p-4 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          style={{
            fontFamily: displaySettings.fontFamily,
            fontSize: `${displaySettings.fontSize}px`,
            fontWeight: displaySettings.fontWeight,
            color: displaySettings.color,
            textAlign: displaySettings.textAlign,
            fontStyle: displaySettings.italic ? 'italic' : 'normal',
            lineHeight: displaySettings.lineHeight,
            letterSpacing: `${displaySettings.letterSpacing}px`,
            opacity: displaySettings.opacity,
          }}
        >
          Sample Text
        </div>
      </div>
    </div>
  );
}
