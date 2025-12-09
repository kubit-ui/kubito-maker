import { toPng, toJpeg, toSvg } from 'html-to-image';
import type {
  ExportOptions,
  KubitoItem,
  BrushStroke,
  EditorConfig,
} from '@/types';

// Helper function to fetch and embed Google Fonts as base64
const embedGoogleFonts = async (): Promise<string> => {
  const fonts = [
    'Inter:wght@300;400;500;600;700;800;900',
    'Roboto:wght@300;400;500;700;900',
    'Open+Sans:wght@300;400;600;700;800',
    'Lato:wght@300;400;700;900',
    'Montserrat:wght@300;400;500;600;700;800;900',
    'Poppins:wght@300;400;500;600;700;800;900',
    'Raleway:wght@300;400;500;600;700;800;900',
    'Playfair+Display:wght@400;700;900',
    'Merriweather:wght@300;400;700;900',
    'Bebas+Neue',
    'Pacifico',
    'Lobster',
    'Dancing+Script:wght@400;700',
    'Caveat:wght@400;700',
    'Permanent+Marker',
    'Indie+Flower',
    'Comic+Neue:wght@300;400;700',
    'Courier+Prime:wght@400;700',
  ];

  try {
    // Fetch the CSS from Google Fonts
    const fontUrl = `https://fonts.googleapis.com/css2?${fonts.map((f) => `family=${f}`).join('&')}&display=swap`;
    // eslint-disable-next-line no-undef
    const response = await fetch(fontUrl);
    const css = await response.text();

    // Extract all font URLs and convert to base64
    let embeddedCss = css;
    const urlMatches = css.match(/url\([^)]+\)/g) || [];

    for (const urlMatch of urlMatches) {
      const url = urlMatch.match(/url\(([^)]+)\)/)?.[1]?.replace(/['"]/g, '');
      if (url && url.startsWith('http')) {
        try {
          // eslint-disable-next-line no-undef
          const fontResponse = await fetch(url);
          const fontBlob = await fontResponse.blob();
          const reader = new FileReader();

          const base64 = await new Promise<string>((resolve) => {
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(fontBlob);
          });

          embeddedCss = embeddedCss.replace(url, base64);
        } catch (err) {
          console.warn('Failed to embed font:', url, err);
        }
      }
    }

    return embeddedCss;
  } catch (error) {
    console.error('Failed to embed Google Fonts:', error);
    return '';
  }
};

// Helper function to inject fonts into SVG
const injectFontsIntoSVG = async (
  svgElement: SVGSVGElement
): Promise<() => void> => {
  const fontCss = await embedGoogleFonts();

  if (!fontCss) return () => {};

  // Create a style element with the embedded fonts
  const styleElement = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'style'
  );
  styleElement.textContent = fontCss;

  // Insert at the beginning of SVG
  svgElement.insertBefore(styleElement, svgElement.firstChild);

  // Return cleanup function
  return () => {
    if (styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
    }
  };
};

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

  // Wait for fonts to load and give rendering time
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Inject fonts into SVG
  const cleanupFonts = await injectFontsIntoSVG(svgElement);

  // Hide all foreignObject elements during export
  const foreignObjects = svgElement.querySelectorAll('foreignObject');
  const originalDisplays: string[] = [];
  foreignObjects.forEach((fo, index) => {
    originalDisplays[index] = fo.style.display;
    fo.style.display = 'none';
  });

  try {
    const dataUrl = await toPng(svgElement as unknown as HTMLElement, {
      width,
      height,
      pixelRatio: 3,
      backgroundColor: transparentBackground ? undefined : '#ffffff',
      skipFonts: false,
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
        // Exclude foreignObject from export
        if (node instanceof SVGForeignObjectElement) return false;
        return true;
      },
    });

    downloadDataUrl(dataUrl, filename);
  } finally {
    // Restore foreignObject visibility
    foreignObjects.forEach((fo, index) => {
      fo.style.display = originalDisplays[index] || '';
    });

    // Remove injected fonts
    cleanupFonts();
  }
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

/**
 * Remove white/light background from an image blob using canvas processing
 * This creates transparency by removing pixels similar to the background color
 * Uses flood fill to only remove background connected to edges, preserving internal areas
 * @param blob - The image blob to process
 * @param threshold - Color similarity threshold (0-255, default 30)
 * @returns Blob with transparent background
 */
export const removeBackgroundFromBlob = async (
  blob: Blob,
  threshold = 30
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      const url = URL.createObjectURL(blob);

      img.onload = () => {
        try {
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          if (!ctx) {
            throw new Error('Could not get canvas context');
          }

          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image
          ctx.drawImage(img, 0, 0);

          // Get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;

          // Sample background color from corners (assume corners are background)
          const corners = [
            { x: 0, y: 0 }, // top-left
            { x: canvas.width - 1, y: 0 }, // top-right
            { x: 0, y: canvas.height - 1 }, // bottom-left
            { x: canvas.width - 1, y: canvas.height - 1 }, // bottom-right
          ];

          let avgR = 0,
            avgG = 0,
            avgB = 0;

          corners.forEach(({ x, y }) => {
            const idx = (y * canvas.width + x) * 4;
            avgR += data[idx] ?? 0;
            avgG += data[idx + 1] ?? 0;
            avgB += data[idx + 2] ?? 0;
          });

          const bgR = avgR / 4;
          const bgG = avgG / 4;
          const bgB = avgB / 4;

          // Helper function to check if color is similar to background
          const isSimilarToBackground = (
            r: number,
            g: number,
            b: number
          ): boolean => {
            const distance = Math.sqrt(
              Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
            );
            return distance < threshold;
          };

          // Track visited pixels
          const visited = new Set<number>();

          // Flood fill function to mark background pixels connected to edges
          const floodFill = (startX: number, startY: number) => {
            const queue: Array<{ x: number; y: number }> = [
              { x: startX, y: startY },
            ];

            while (queue.length > 0) {
              const point = queue.shift();
              if (!point) continue;

              const { x, y } = point;

              // Check bounds
              if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) {
                continue;
              }

              const pixelIndex = y * canvas.width + x;

              // Skip if already visited
              if (visited.has(pixelIndex)) {
                continue;
              }

              const idx = pixelIndex * 4;
              const r = data[idx] ?? 0;
              const g = data[idx + 1] ?? 0;
              const b = data[idx + 2] ?? 0;

              // Only continue flood fill if pixel is similar to background
              if (!isSimilarToBackground(r, g, b)) {
                continue;
              }

              // Mark as visited and make transparent
              visited.add(pixelIndex);
              data[idx + 3] = 0; // Set alpha to 0

              // Add neighbors to queue
              queue.push({ x: x + 1, y });
              queue.push({ x: x - 1, y });
              queue.push({ x, y: y + 1 });
              queue.push({ x, y: y - 1 });
            }
          };

          // Start flood fill from all edges
          // Top and bottom edges
          for (let x = 0; x < canvas.width; x++) {
            floodFill(x, 0); // Top edge
            floodFill(x, canvas.height - 1); // Bottom edge
          }

          // Left and right edges
          for (let y = 0; y < canvas.height; y++) {
            floodFill(0, y); // Left edge
            floodFill(canvas.width - 1, y); // Right edge
          }

          // Put modified image data back
          ctx.putImageData(imageData, 0, 0);

          // Convert to blob
          canvas.toBlob(
            (resultBlob) => {
              URL.revokeObjectURL(url);
              if (resultBlob) {
                resolve(resultBlob);
              } else {
                reject(new Error('Failed to create blob from canvas'));
              }
            },
            'image/png',
            1.0
          );
        } catch (err) {
          URL.revokeObjectURL(url);
          reject(
            err instanceof Error
              ? err
              : new Error('Unknown error during background removal')
          );
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };

      img.src = url;
    } catch (error) {
      console.error('Background removal failed:', error);
      reject(
        new Error('Failed to remove background: ' + (error as Error).message)
      );
    }
  });
};

/**
 * Export canvas as PNG with optional background removal
 */
export const exportPNGWithBackgroundRemoval = async (
  svgElement: SVGSVGElement,
  options: Partial<ExportOptions> & {
    filename?: string;
    removeBackground?: boolean;
  } = {}
): Promise<void> => {
  const {
    width = 720,
    height = 720,
    transparentBackground = false,
    filename = 'kubito.png',
    removeBackground: shouldRemoveBackground = false,
  } = options;

  // Wait for fonts to load and give rendering time
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Inject fonts into SVG
  const cleanupFonts = await injectFontsIntoSVG(svgElement);

  // Hide all foreignObject elements during export
  const foreignObjects = svgElement.querySelectorAll('foreignObject');
  const originalDisplays: string[] = [];
  foreignObjects.forEach((fo, index) => {
    originalDisplays[index] = fo.style.display;
    fo.style.display = 'none';
  });

  try {
    const dataUrl = await toPng(svgElement as unknown as HTMLElement, {
      width,
      height,
      pixelRatio: 3,
      backgroundColor: transparentBackground ? undefined : '#ffffff',
      skipFonts: false,
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
        // Exclude foreignObject from export
        if (node instanceof SVGForeignObjectElement) return false;
        return true;
      },
    });

    // If background removal is requested
    if (shouldRemoveBackground) {
      // Convert data URL to blob
      const response = await window.fetch(dataUrl);
      const blob = await response.blob();

      // Remove background
      const processedBlob = await removeBackgroundFromBlob(blob);

      // Download the processed image
      downloadBlob(processedBlob, filename);
    } else {
      // Download without processing
      downloadDataUrl(dataUrl, filename);
    }
  } finally {
    // Restore foreignObject visibility
    foreignObjects.forEach((fo, index) => {
      fo.style.display = originalDisplays[index] || '';
    });

    // Remove injected fonts
    cleanupFonts();
  }
};

/**
 * Export canvas as WebP with optional background removal
 */
export const exportWebPWithBackgroundRemoval = async (
  svgElement: SVGSVGElement,
  options: Partial<ExportOptions> & {
    filename?: string;
    removeBackground?: boolean;
  } = {}
): Promise<void> => {
  const {
    width = 720,
    height = 720,
    quality = 0.95,
    transparentBackground = false,
    filename = 'kubito.webp',
    removeBackground: shouldRemoveBackground = false,
  } = options;

  // Wait for fonts to load and give rendering time
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Inject fonts into SVG
  const cleanupFonts = await injectFontsIntoSVG(svgElement);

  // Hide all foreignObject elements during export
  const foreignObjects = svgElement.querySelectorAll('foreignObject');
  const originalDisplays: string[] = [];
  foreignObjects.forEach((fo, index) => {
    originalDisplays[index] = fo.style.display;
    fo.style.display = 'none';
  });

  try {
    const pngDataUrl = await toPng(svgElement as unknown as HTMLElement, {
      width,
      height,
      pixelRatio: 3,
      backgroundColor: transparentBackground ? undefined : '#ffffff',
      skipFonts: false,
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
        // Exclude foreignObject from export
        if (node instanceof SVGForeignObjectElement) return false;
        return true;
      },
    });

    // If background removal is requested, first convert to blob
    let finalBlob: Blob;

    if (shouldRemoveBackground) {
      // Convert PNG to blob
      const pngResponse = await window.fetch(pngDataUrl);
      const pngBlob = await pngResponse.blob();

      // Remove background (this will return PNG)
      const processedBlob = await removeBackgroundFromBlob(pngBlob);

      // Now convert the processed PNG to WebP
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load processed image'));
        img.src = URL.createObjectURL(processedBlob);
      });

      // Create canvas and convert to WebP
      const canvas = document.createElement('canvas');
      canvas.width = width * 3;
      canvas.height = height * 3;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(img, 0, 0);

      // Convert to WebP blob
      const webpBlob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, 'image/webp', quality);
      });

      if (!webpBlob) throw new Error('Failed to create WebP blob');

      finalBlob = webpBlob;
    } else {
      // Normal WebP conversion without background removal
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

      finalBlob = blob;
    }

    downloadBlob(finalBlob, filename);
  } finally {
    // Restore foreignObject visibility
    foreignObjects.forEach((fo, index) => {
      fo.style.display = originalDisplays[index] || '';
    });

    // Remove injected fonts
    cleanupFonts();
  }
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

  // Wait for fonts to load and give rendering time
  await document.fonts.ready;
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Inject fonts into SVG
  const cleanupFonts = await injectFontsIntoSVG(svgElement);

  // Hide all foreignObject elements during export
  const foreignObjects = svgElement.querySelectorAll('foreignObject');
  const originalDisplays: string[] = [];
  foreignObjects.forEach((fo, index) => {
    originalDisplays[index] = fo.style.display;
    fo.style.display = 'none';
  });

  try {
    const pngDataUrl = await toPng(svgElement as unknown as HTMLElement, {
      width,
      height,
      pixelRatio: 3,
      backgroundColor: transparentBackground ? undefined : '#ffffff',
      skipFonts: false,
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
        // Exclude foreignObject from export
        if (node instanceof SVGForeignObjectElement) return false;
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

    downloadBlob(blob, filename);
  } finally {
    // Restore foreignObject visibility
    foreignObjects.forEach((fo, index) => {
      fo.style.display = originalDisplays[index] || '';
    });

    // Remove injected fonts
    cleanupFonts();
  }
};

export const exportSVG = async (
  svgElement: SVGSVGElement,
  filename = 'kubito.svg'
): Promise<void> => {
  // Wait for fonts to load
  await document.fonts.ready;

  const dataUrl = await toSvg(svgElement as unknown as HTMLElement, {
    skipFonts: false,
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
