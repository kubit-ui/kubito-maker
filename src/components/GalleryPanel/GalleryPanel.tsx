import { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import type { GalleryItem } from '@/types';
import {
  loadGalleryManifest,
  getGalleryThumbnailUrl,
  loadGalleryKubito,
} from '@/data/gallery';
import { useEditorActions } from '@/store/editorStore';

export function GalleryPanel() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { importKubito } = useEditorActions();

  useEffect(() => {
    const loadGallery = async () => {
      setLoading(true);
      const items = await loadGalleryManifest();
      setGalleryItems(items);
      setLoading(false);
    };

    void loadGallery();
  }, []);

  const handleItemClick = async (item: GalleryItem) => {
    try {
      setSelectedItem(item.id);
      const kubitoFile = await loadGalleryKubito(item);
      importKubito(kubitoFile);
    } catch (error) {
      console.error('Error loading gallery item:', error);
      alert('Error al cargar el diseño de la galería');
    } finally {
      setSelectedItem(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-gray-500">
        <div className="text-center">
          <div className="mb-2 animate-spin text-4xl">⏳</div>
          <p>Cargando galería...</p>
        </div>
      </div>
    );
  }

  if (galleryItems.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-gray-500">
        <div className="text-center">
          <Image className="mx-auto mb-2 h-12 w-12 opacity-50" />
          <p>No hay diseños en la galería</p>
          <p className="mt-2 text-xs">
            Agrega diseños en la carpeta public/kubito-gallery
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        Galería de Diseños
      </h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {galleryItems.map((item) => (
          <button
            key={item.id}
            onClick={() => void handleItemClick(item)}
            disabled={selectedItem === item.id}
            className={`
              group relative overflow-hidden rounded-lg border-2 bg-white
              transition-all duration-200 hover:scale-105 hover:shadow-lg
              ${
                selectedItem === item.id
                  ? 'cursor-wait border-blue-500 opacity-50'
                  : 'cursor-pointer border-gray-200 hover:border-blue-400'
              }
            `}
            title={item.description}
          >
            {/* Thumbnail */}
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
              <img
                src={getGalleryThumbnailUrl(item)}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
                onError={(e) => {
                  // Fallback si no existe la imagen
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                    <div class="flex h-full items-center justify-center text-gray-400">
                      <svg class="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  `;
                  }
                }}
              />
            </div>

            {/* Title and Description */}
            <div className="p-3 text-left">
              <h3 className="font-medium text-gray-800 group-hover:text-blue-600">
                {item.name}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                {item.description}
              </p>
            </div>

            {/* Loading overlay */}
            {selectedItem === item.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                <div className="animate-spin text-4xl">⏳</div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
