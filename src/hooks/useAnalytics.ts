import { track } from '@vercel/analytics';

/**
 * Custom analytics hook for tracking user interactions
 * This provides comprehensive event tracking for Kubito Maker
 */
export const useAnalytics = () => {
  // Asset interactions
  const trackAssetAdded = (category: string, assetId: string) => {
    track('asset_added', {
      category,
      assetId,
      timestamp: new Date().toISOString(),
    });
  };

  const trackAssetRemoved = (category: string, assetId: string) => {
    track('asset_removed', {
      category,
      assetId,
      timestamp: new Date().toISOString(),
    });
  };

  // Body selection
  const trackBodyChanged = (bodyId: string) => {
    track('body_changed', {
      bodyId,
      timestamp: new Date().toISOString(),
    });
  };

  // Export actions
  const trackExport = (format: string, width: number, height: number) => {
    track('export', {
      format,
      width,
      height,
      timestamp: new Date().toISOString(),
    });
  };

  const trackProjectSaved = () => {
    track('project_saved', {
      timestamp: new Date().toISOString(),
    });
  };

  const trackProjectLoaded = () => {
    track('project_loaded', {
      timestamp: new Date().toISOString(),
    });
  };

  // Gallery interactions
  const trackGalleryOpened = () => {
    track('gallery_opened', {
      timestamp: new Date().toISOString(),
    });
  };

  const trackKubitoShared = (title: string, hasEmail: boolean) => {
    track('kubito_shared', {
      title,
      hasEmail,
      timestamp: new Date().toISOString(),
    });
  };

  const trackKubitoLoaded = (kubitoId: string, source: 'gallery' | 'local') => {
    track('kubito_loaded', {
      kubitoId,
      source,
      timestamp: new Date().toISOString(),
    });
  };

  const trackKubitoLiked = (kubitoId: string) => {
    track('kubito_liked', {
      kubitoId,
      timestamp: new Date().toISOString(),
    });
  };

  const trackKubitoDownloaded = (kubitoId: string) => {
    track('kubito_downloaded', {
      kubitoId,
      timestamp: new Date().toISOString(),
    });
  };

  // Canvas interactions
  const trackCanvasSizeChanged = (
    width: number,
    height: number,
    presetId?: string
  ) => {
    track('canvas_size_changed', {
      width,
      height,
      presetId: presetId || 'custom',
      timestamp: new Date().toISOString(),
    });
  };

  // Brush tool
  const trackBrushUsed = (
    brushSize: number,
    color: string,
    opacity: number
  ) => {
    track('brush_used', {
      brushSize,
      color,
      opacity,
      timestamp: new Date().toISOString(),
    });
  };

  const trackBrushStrokeFinished = (pointsCount: number) => {
    track('brush_stroke_finished', {
      pointsCount,
      timestamp: new Date().toISOString(),
    });
  };

  // Color and effects
  const trackColorChanged = (itemCategory: string, color: string) => {
    track('color_changed', {
      itemCategory,
      color,
      timestamp: new Date().toISOString(),
    });
  };

  const trackFilterApplied = (filterType: string, itemCategory: string) => {
    track('filter_applied', {
      filterType,
      itemCategory,
      timestamp: new Date().toISOString(),
    });
  };

  // User actions
  const trackUndo = () => {
    track('undo', {
      timestamp: new Date().toISOString(),
    });
  };

  const trackRedo = () => {
    track('redo', {
      timestamp: new Date().toISOString(),
    });
  };

  const trackDuplicate = (itemsCount: number) => {
    track('duplicate', {
      itemsCount,
      timestamp: new Date().toISOString(),
    });
  };

  const trackDelete = (itemsCount: number) => {
    track('delete', {
      itemsCount,
      timestamp: new Date().toISOString(),
    });
  };

  // Session metrics
  const trackSessionStart = () => {
    track('session_start', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language,
    });
  };

  const trackFeatureUsed = (featureName: string) => {
    track('feature_used', {
      featureName,
      timestamp: new Date().toISOString(),
    });
  };

  // Error tracking
  const trackError = (errorType: string, errorMessage: string) => {
    track('error', {
      errorType,
      errorMessage,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    });
  };

  return {
    // Asset tracking
    trackAssetAdded,
    trackAssetRemoved,
    trackBodyChanged,

    // Export tracking
    trackExport,
    trackProjectSaved,
    trackProjectLoaded,

    // Gallery tracking
    trackGalleryOpened,
    trackKubitoShared,
    trackKubitoLoaded,
    trackKubitoLiked,
    trackKubitoDownloaded,

    // Canvas tracking
    trackCanvasSizeChanged,

    // Brush tracking
    trackBrushUsed,
    trackBrushStrokeFinished,

    // Effects tracking
    trackColorChanged,
    trackFilterApplied,

    // User actions tracking
    trackUndo,
    trackRedo,
    trackDuplicate,
    trackDelete,

    // Session tracking
    trackSessionStart,
    trackFeatureUsed,

    // Error tracking
    trackError,
  };
};
