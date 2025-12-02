import { memo } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { useCanvasZoom, useEditorActions } from '@/store/editorStore';

export const ZoomControls = memo(() => {
  const canvasZoom = useCanvasZoom();
  const { zoomIn, zoomOut, resetZoom } = useEditorActions();

  const zoomPercentage = Math.round(canvasZoom * 100);

  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white p-2 shadow-lg dark:bg-gray-800">
      <button
        onClick={zoomOut}
        className="rounded p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
        disabled={canvasZoom <= 0.1}
        title="Zoom out (10%)"
        aria-label="Zoom out"
      >
        <ZoomOut className="h-4 w-4" />
      </button>

      <button
        onClick={resetZoom}
        className="min-w-[60px] rounded px-2 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Reset zoom (100%)"
        aria-label="Reset zoom"
      >
        <div className="flex items-center gap-1">
          <Maximize2 className="h-3 w-3" />
          {zoomPercentage}%
        </div>
      </button>

      <button
        onClick={zoomIn}
        className="rounded p-1.5 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-700"
        disabled={canvasZoom >= 5}
        title="Zoom in (10%)"
        aria-label="Zoom in"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
    </div>
  );
});

ZoomControls.displayName = 'ZoomControls';
