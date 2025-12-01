import type { GalleryItem, KubitoFile } from '@/types';

const GALLERY_BASE_PATH = '/kubito-gallery';
const GALLERY_MANIFEST_PATH = `${GALLERY_BASE_PATH}/gallery-manifest.json`;

/**
 * Load the gallery manifest from the public folder
 * @returns Promise with array of gallery items
 */
export const loadGalleryManifest = async (): Promise<GalleryItem[]> => {
  try {
    const response = await window.fetch(GALLERY_MANIFEST_PATH);
    if (!response.ok) {
      throw new Error(
        `Failed to load gallery manifest: ${response.statusText}`
      );
    }
    const items = (await response.json()) as GalleryItem[];
    return items;
  } catch (error) {
    console.error('Error loading gallery manifest:', error);
    return [];
  }
};

/**
 * Get the full URL for a gallery item's thumbnail
 * @param item Gallery item
 * @returns Full URL to the thumbnail image
 */
export const getGalleryThumbnailUrl = (item: GalleryItem): string => {
  return `${GALLERY_BASE_PATH}/${item.folder}/${item.thumbnail}`;
};

/**
 * Get the full URL for a gallery item's kubito file
 * @param item Gallery item
 * @returns Full URL to the kubito file
 */
export const getGalleryKubitoUrl = (item: GalleryItem): string => {
  return `${GALLERY_BASE_PATH}/${item.folder}/${item.kubito}`;
};

/**
 * Load a kubito file from the gallery
 * @param item Gallery item to load
 * @returns Promise with the kubito file content
 */
export const loadGalleryKubito = async (
  item: GalleryItem
): Promise<KubitoFile> => {
  try {
    const url = getGalleryKubitoUrl(item);
    const response = await window.fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load kubito file: ${response.statusText}`);
    }
    return (await response.json()) as KubitoFile;
  } catch (error) {
    console.error('Error loading kubito file:', error);
    throw error;
  }
};
