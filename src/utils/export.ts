import type { ExportOptions, KubitoItem } from '@/types';

/**
 * Expand SVG image references to inline SVG content
 * This replaces <image> elements that have data-svg-path with actual SVG content
 */
const expandSvgImages = async (svgElement: SVGSVGElement): Promise<void> => {
  const imageElements = svgElement.querySelectorAll('image[data-svg-path]');

  const promises = Array.from(imageElements).map(async (imageEl) => {
    const svgPath = imageEl.getAttribute('data-svg-path');
    if (!svgPath) return;

    try {
      const response = await window.fetch(svgPath);
      const text = await response.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'image/svg+xml');
      const svgContent = doc.querySelector('svg');

      if (svgContent) {
        // Create a group element to replace the image
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

        // Copy transform and other attributes from image to group
        const transform = imageEl.getAttribute('transform');
        if (transform) g.setAttribute('transform', transform);

        const className = imageEl.getAttribute('class');
        if (className) g.setAttribute('class', className);

        // Get position from image element
        const x = imageEl.getAttribute('x') || '0';
        const y = imageEl.getAttribute('y') || '0';
        const width = imageEl.getAttribute('width') || '100';
        const height = imageEl.getAttribute('height') || '100';

        // Get the viewBox to determine scaling
        const viewBox = svgContent.getAttribute('viewBox');
        const [, , vbWidth, vbHeight] = viewBox
          ? viewBox.split(' ').map(Number)
          : [0, 0, 100, 100];

        // Create a nested SVG to maintain proper sizing and position
        const nestedSvg = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg'
        );
        nestedSvg.setAttribute('x', x);
        nestedSvg.setAttribute('y', y);
        nestedSvg.setAttribute('width', width);
        nestedSvg.setAttribute('height', height);
        nestedSvg.setAttribute('viewBox', `0 0 ${vbWidth} ${vbHeight}`);
        nestedSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        // Copy all children from the loaded SVG
        Array.from(svgContent.children).forEach((child) => {
          const imported = document.importNode(child, true);
          nestedSvg.appendChild(imported);
        });

        g.appendChild(nestedSvg);

        // Replace the image element with the group
        imageEl.parentNode?.replaceChild(g, imageEl);
      }
    } catch (error) {
      console.error('Error loading SVG for export:', error);
    }
  });

  await Promise.all(promises);
};

export const svgToString = (svgNode: SVGSVGElement): string => {
  const serializer = new XMLSerializer();
  return serializer.serializeToString(svgNode);
};

export const downloadFile = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportSVG = async (
  svgElement: SVGSVGElement,
  filename = 'kubito.svg'
): Promise<void> => {
  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

  // Expand image references to inline SVG content
  await expandSvgImages(clonedSvg);

  // Remove UI-only elements (handles, selection rings, guides, marquee, etc)
  // These are marked with data-ui but DON'T have data-item-id
  // EXCEPT: Keep "grid" (background) and other elements that should be exported
  const uiElements = clonedSvg.querySelectorAll('[data-ui]');
  uiElements.forEach((element) => {
    const uiType = element.getAttribute('data-ui');

    // Keep grid (background) - it should be exported
    if (uiType === 'grid') {
      return;
    }

    // Remove UI elements (handles, guides, selection rings, etc)
    element.remove();
  });

  // Remove all elements with data-handle attribute (transform handles)
  const handleElements = clonedSvg.querySelectorAll('[data-handle]');
  handleElements.forEach((element) => {
    element.remove();
  });

  // Clean up style attributes that might interfere
  clonedSvg.querySelectorAll('[style]').forEach((element) => {
    const style = (element as HTMLElement).style;
    // Keep important styles but remove interactive ones
    if (style.pointerEvents) {
      style.pointerEvents = '';
    }
    if (style.cursor) {
      style.cursor = '';
    }
  });

  // Remove data attributes used for editing
  clonedSvg.querySelectorAll('[data-item-id]').forEach((element) => {
    element.removeAttribute('data-item-id');
  });

  const svgString = svgToString(clonedSvg);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  downloadFile(blob, filename);
};

export const exportPNG = async (
  svgElement: SVGSVGElement,
  options: Partial<ExportOptions> & { filename?: string } = {}
): Promise<void> => {
  const {
    width = 720,
    height = 720,
    quality = 1,
    transparentBackground = false,
    filename = 'kubito.png',
  } = options;

  // Export at 3x resolution for high quality (2160x2160 for default 720x720)
  const exportScale = 3;
  const exportWidth = width * exportScale;
  const exportHeight = height * exportScale;

  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

  // Expand image references to inline SVG content
  await expandSvgImages(clonedSvg);

  // Remove background rect if transparent background requested
  if (transparentBackground) {
    const bgRect = clonedSvg.querySelector('[data-ui="grid"]');
    if (bgRect) bgRect.remove();
  }

  // Remove UI-only elements (handles, selection rings, guides, marquee, etc)
  // EXCEPT: Keep "grid" (background) unless transparentBackground is true
  const uiElements = clonedSvg.querySelectorAll('[data-ui]');
  uiElements.forEach((element) => {
    const uiType = element.getAttribute('data-ui');

    // Keep grid (background) unless transparent background requested
    if (uiType === 'grid' && !transparentBackground) {
      return;
    }

    // Remove UI elements (handles, guides, selection rings, etc)
    element.remove();
  });

  // Remove all elements with data-handle attribute (transform handles)
  const handleElements = clonedSvg.querySelectorAll('[data-handle]');
  handleElements.forEach((element) => {
    element.remove();
  });

  // Clean up style attributes
  clonedSvg.querySelectorAll('[style]').forEach((element) => {
    const style = (element as HTMLElement).style;
    if (style.pointerEvents) style.pointerEvents = '';
    if (style.cursor) style.cursor = '';
  });

  // Remove data attributes
  clonedSvg.querySelectorAll('[data-item-id]').forEach((element) => {
    element.removeAttribute('data-item-id');
  });

  // Remove any default stroke attributes that might cause black borders
  clonedSvg.querySelectorAll('[stroke]').forEach((element) => {
    // Only remove stroke if it's the default black and not explicitly set
    const stroke = element.getAttribute('stroke');
    if (stroke === '#000000' || stroke === 'black' || stroke === '#000') {
      // Check if this is an intentional stroke or just a default
      const strokeWidth = element.getAttribute('stroke-width');
      if (!strokeWidth || strokeWidth === '0') {
        element.removeAttribute('stroke');
      }
    }
  });

  const svgString = svgToString(clonedSvg);
  const svgBlob = new Blob([svgString], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = exportWidth;
      canvas.height = exportHeight;

      const ctx = canvas.getContext('2d', {
        alpha: transparentBackground,
        willReadFrequently: false,
      });
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Enable high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (!transparentBackground) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, exportWidth, exportHeight);
      }

      ctx.drawImage(img, 0, 0, exportWidth, exportHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            downloadFile(blob, filename);
            URL.revokeObjectURL(url);
            resolve();
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };

    img.src = url;
  });
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

  // Export at 3x resolution for high quality (2160x2160 for default 720x720)
  const exportScale = 3;
  const exportWidth = width * exportScale;
  const exportHeight = height * exportScale;

  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

  // Expand image references to inline SVG content
  await expandSvgImages(clonedSvg);

  // Remove background rect if transparent background requested
  if (transparentBackground) {
    const bgRect = clonedSvg.querySelector('[data-ui="grid"]');
    if (bgRect) bgRect.remove();
  }

  // Remove UI-only elements (handles, selection rings, guides, marquee, etc)
  // EXCEPT: Keep "grid" (background) unless transparentBackground is true
  const uiElements = clonedSvg.querySelectorAll('[data-ui]');
  uiElements.forEach((element) => {
    const uiType = element.getAttribute('data-ui');

    // Keep grid (background) unless transparent background requested
    if (uiType === 'grid' && !transparentBackground) {
      return;
    }

    // Remove UI elements (handles, guides, selection rings, etc)
    element.remove();
  });

  // Remove all elements with data-handle attribute (transform handles)
  const handleElements = clonedSvg.querySelectorAll('[data-handle]');
  handleElements.forEach((element) => {
    element.remove();
  });

  // Clean up style attributes
  clonedSvg.querySelectorAll('[style]').forEach((element) => {
    const style = (element as HTMLElement).style;
    if (style.pointerEvents) style.pointerEvents = '';
    if (style.cursor) style.cursor = '';
  });

  // Remove data attributes
  clonedSvg.querySelectorAll('[data-item-id]').forEach((element) => {
    element.removeAttribute('data-item-id');
  });

  // Remove any default stroke attributes that might cause black borders
  clonedSvg.querySelectorAll('[stroke]').forEach((element) => {
    // Only remove stroke if it's the default black and not explicitly set
    const stroke = element.getAttribute('stroke');
    if (stroke === '#000000' || stroke === 'black' || stroke === '#000') {
      // Check if this is an intentional stroke or just a default
      const strokeWidth = element.getAttribute('stroke-width');
      if (!strokeWidth || strokeWidth === '0') {
        element.removeAttribute('stroke');
      }
    }
  });

  const svgString = svgToString(clonedSvg);
  const svgBlob = new Blob([svgString], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = exportWidth;
      canvas.height = exportHeight;

      const ctx = canvas.getContext('2d', {
        alpha: transparentBackground,
        willReadFrequently: false,
      });
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Enable high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (!transparentBackground) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, exportWidth, exportHeight);
      }

      ctx.drawImage(img, 0, 0, exportWidth, exportHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            downloadFile(blob, filename);
            URL.revokeObjectURL(url);
            resolve();
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };

    img.src = url;
  });
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

  // Export at 3x resolution for high quality (2160x2160 for default 720x720)
  const exportScale = 3;
  const exportWidth = width * exportScale;
  const exportHeight = height * exportScale;

  const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;

  // Expand image references to inline SVG content
  await expandSvgImages(clonedSvg);

  // Remove UI-only elements (handles, selection rings, guides, marquee, etc)
  // EXCEPT: Keep "grid" (background) - JPEG always has background
  const uiElements = clonedSvg.querySelectorAll('[data-ui]');
  uiElements.forEach((element) => {
    const uiType = element.getAttribute('data-ui');

    // Keep grid (background) - JPEG needs background
    if (uiType === 'grid') {
      return;
    }

    // Remove UI elements (handles, guides, selection rings, etc)
    element.remove();
  });

  // Remove all elements with data-handle attribute (transform handles)
  const handleElements = clonedSvg.querySelectorAll('[data-handle]');
  handleElements.forEach((element) => {
    element.remove();
  });

  // Clean up style attributes
  clonedSvg.querySelectorAll('[style]').forEach((element) => {
    const style = (element as HTMLElement).style;
    if (style.pointerEvents) style.pointerEvents = '';
    if (style.cursor) style.cursor = '';
  });

  // Remove data attributes
  clonedSvg.querySelectorAll('[data-item-id]').forEach((element) => {
    element.removeAttribute('data-item-id');
  });

  // Remove any default stroke attributes that might cause black borders
  clonedSvg.querySelectorAll('[stroke]').forEach((element) => {
    // Only remove stroke if it's the default black and not explicitly set
    const stroke = element.getAttribute('stroke');
    if (stroke === '#000000' || stroke === 'black' || stroke === '#000') {
      // Check if this is an intentional stroke or just a default
      const strokeWidth = element.getAttribute('stroke-width');
      if (!strokeWidth || strokeWidth === '0') {
        element.removeAttribute('stroke');
      }
    }
  });

  const svgString = svgToString(clonedSvg);
  const svgBlob = new Blob([svgString], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(svgBlob);

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = exportWidth;
      canvas.height = exportHeight;

      const ctx = canvas.getContext('2d', {
        alpha: false,
        willReadFrequently: false,
      });
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Enable high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, exportWidth, exportHeight);
      ctx.drawImage(img, 0, 0, exportWidth, exportHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            downloadFile(blob, filename);
            URL.revokeObjectURL(url);
            resolve();
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load SVG'));
    };

    img.src = url;
  });
};

export const exportProject = (
  items: KubitoItem[],
  projectName = 'kubito-project'
): void => {
  const projectData = {
    version: '1.0.0',
    name: projectName,
    items,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const json = JSON.stringify(projectData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadFile(blob, `${projectName}.kubito`);
};

export const importProject = async (file: File): Promise<KubitoItem[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const projectData = JSON.parse(json) as {
          items?: unknown;
          [key: string]: unknown;
        };

        if (projectData.items && Array.isArray(projectData.items)) {
          resolve(projectData.items as KubitoItem[]);
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
