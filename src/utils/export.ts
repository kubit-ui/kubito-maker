import { toPng, toJpeg, toSvg } from 'html-to-image';
import type {
  ExportOptions,
  KubitoItem,
  BrushStroke,
  EditorConfig,
} from '@/types';

const downloadDataUrl = (dataUrl: string, filename: string) => {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  downloadDataUrl(url, filename);
  URL.revokeObjectURL(url);
};

export const exportPNG = async (
  svgElement: SVGSVGElement,
  options: Partial<ExportOptions> & { filename?: string } = {}
): Promise<void> => {
  const {
    width = 720,
    height = 720,
    transparentBackground = false,
    filename = 'kubito.png',
  } = options;

  const dataUrl = await toPng(svgElement as unknown as HTMLElement, {
    width,
    height,
    pixelRatio: 3,
    backgroundColor: transparentBackground ? undefined : '#ffffff',
    filter: (node: Element) => {
      if (node instanceof Element) {
        const dataUi = node.getAttribute('data-ui');
        const dataHandle = node.getAttribute('data-handle');
        if (dataHandle) return false;
        if (dataUi) {
          if (dataUi === 'grid' && !transparentBackground) return true;
          return false;
        }
      }
      return true;
    },
  });

  downloadDataUrl(dataUrl, filename);
};

/**
 * Export canvas as PNG Blob (for uploading to server)
 */
export const exportToPNGBlob = async (
  svgElement: SVGSVGElement,
  options: Partial<ExportOptions> = {}
): Promise<Blob> => {
  const { width = 720, height = 720, transparentBackground = false } = options;

  const dataUrl = await toPng(svgElement as unknown as HTMLElement, {
    width,
    height,
    pixelRatio: 3,
    backgroundColor: transparentBackground ? undefined : '#ffffff',
    filter: (node: Element) => {
      if (node instanceof Element) {
        const dataUi = node.getAttribute('data-ui');
        const dataHandle = node.getAttribute('data-handle');
        if (dataHandle) return false;
        if (dataUi) {
          if (dataUi === 'grid' && !transparentBackground) return true;
          return false;
        }
      }
      return true;
    },
  });

  // Convert data URL to Blob
  const response = await window.fetch(dataUrl);
  const blob = await response.blob();
  return blob;
};

/**
 * Export canvas as WebP Blob (for uploading to server)
 * WebP provides better compression than PNG while maintaining quality
 */
export const exportToWebPBlob = async (
  svgElement: SVGSVGElement,
  options: Partial<ExportOptions> = {}
): Promise<Blob> => {
  const {
    width = 720,
    height = 720,
    quality = 0.95,
    transparentBackground = false,
  } = options;

  // First, convert to PNG data URL
  const pngDataUrl = await toPng(svgElement as unknown as HTMLElement, {
    width,
    height,
    pixelRatio: 3,
    backgroundColor: transparentBackground ? undefined : '#ffffff',
    filter: (node: Element) => {
      if (node instanceof Element) {
        const dataUi = node.getAttribute('data-ui');
        const dataHandle = node.getAttribute('data-handle');
        if (dataHandle) return false;
        if (dataUi) {
          if (dataUi === 'grid' && !transparentBackground) return true;
          return false;
        }
      }
      return true;
    },
  });

  // Load image from data URL
  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = pngDataUrl;
  });

  // Create canvas and convert to WebP
  const canvas = document.createElement('canvas');
  canvas.width = width * 3;
  canvas.height = height * 3;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(img, 0, 0);

  // Convert to WebP blob
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', quality);
  });

  if (!blob) throw new Error('Failed to create WebP blob');

  return blob;
};

export const exportJPEG = async (
  svgElement: SVGSVGElement,
  options: Partial<ExportOptions> & { filename?: string } = {}
): Promise<void> => {
  const {
    width = 720,
    height = 720,
    quality = 0.95,
    filename = 'kubito.jpg',
  } = options;

  const dataUrl = await toJpeg(svgElement as unknown as HTMLElement, {
    width,
    height,
    quality,
    pixelRatio: 3,
    backgroundColor: '#ffffff',
    filter: (node: Element) => {
      if (node instanceof Element) {
        const dataUi = node.getAttribute('data-ui');
        const dataHandle = node.getAttribute('data-handle');
        if (dataHandle) return false;
        if (dataUi && dataUi !== 'grid') return false;
      }
      return true;
    },
  });

  downloadDataUrl(dataUrl, filename);
};

export const exportWebP = async (
  svgElement: SVGSVGElement,
  options: Partial<ExportOptions> & { filename?: string } = {}
): Promise<void> => {
  const {
    width = 720,
    height = 720,
    quality = 0.95,
    transparentBackground = false,
    filename = 'kubito.webp',
  } = options;

  const pngDataUrl = await toPng(svgElement as unknown as HTMLElement, {
    width,
    height,
    pixelRatio: 3,
    backgroundColor: transparentBackground ? undefined : '#ffffff',
    filter: (node: Element) => {
      if (node instanceof Element) {
        const dataUi = node.getAttribute('data-ui');
        const dataHandle = node.getAttribute('data-handle');
        if (dataHandle) return false;
        if (dataUi) {
          if (dataUi === 'grid' && !transparentBackground) return true;
          return false;
        }
      }
      return true;
    },
  });

  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = pngDataUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = width * 3;
  canvas.height = height * 3;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(img, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/webp', quality);
  });

  if (!blob) throw new Error('Failed to create WebP blob');

  downloadBlob(blob, filename);
};

export const exportSVG = async (
  svgElement: SVGSVGElement,
  filename = 'kubito.svg'
): Promise<void> => {
  const dataUrl = await toSvg(svgElement as unknown as HTMLElement, {
    filter: (node: Element) => {
      if (node instanceof Element) {
        const dataUi = node.getAttribute('data-ui');
        const dataHandle = node.getAttribute('data-handle');
        if (dataHandle) return false;
        if (dataUi && dataUi !== 'grid') return false;
      }
      return true;
    },
  });

  downloadDataUrl(dataUrl, filename);
};

export const exportProject = (
  items: KubitoItem[],
  brushStrokes: BrushStroke[] = [],
  config?: EditorConfig,
  selectedBodyId?: string,
  projectName = 'kubito-project'
): void => {
  const projectData = {
    version: '1.0.0',
    name: projectName,
    items,
    brushStrokes,
    config,
    selectedBodyId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const json = JSON.stringify(projectData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, `${projectName}.kubito`);
};

export const importProject = async (
  file: File
): Promise<{
  items: KubitoItem[];
  brushStrokes?: BrushStroke[];
  config?: EditorConfig;
  selectedBodyId?: string;
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const projectData = JSON.parse(json) as {
          items?: unknown;
          brushStrokes?: unknown;
          config?: unknown;
          selectedBodyId?: unknown;
          [key: string]: unknown;
        };

        if (projectData.items && Array.isArray(projectData.items)) {
          resolve({
            items: projectData.items as KubitoItem[],
            brushStrokes:
              projectData.brushStrokes &&
              Array.isArray(projectData.brushStrokes)
                ? (projectData.brushStrokes as BrushStroke[])
                : undefined,
            config: projectData.config
              ? (projectData.config as EditorConfig)
              : undefined,
            selectedBodyId:
              typeof projectData.selectedBodyId === 'string'
                ? projectData.selectedBodyId
                : undefined,
          });
        } else {
          reject(new Error('Invalid project file format'));
        }
      } catch (error) {
        reject(
          error instanceof Error ? error : new Error('Failed to parse file')
        );
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const svgToString = (svgNode: SVGSVGElement): string => {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgNode);
};
