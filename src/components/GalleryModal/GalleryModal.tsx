import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image as ImageIcon } from 'lucide-react';
import type { GalleryItem } from '@/types';
import {
  loadGalleryManifest,
  getGalleryThumbnailUrl,
  loadGalleryKubito,
} from '@/data/gallery';
import { useEditorActions } from '@/store/editorStore';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GalleryModal = memo<GalleryModalProps>(({ isOpen, onClose }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { importKubito } = useEditorActions();

  useEffect(() => {
    if (isOpen) {
      const loadGallery = async () => {
        setLoading(true);
        const items = await loadGalleryManifest();
        setGalleryItems(items);
        setLoading(false);
      };

      void loadGallery();
    }
  }, [isOpen]);

  const handleItemClick = async (item: GalleryItem) => {
    try {
      setSelectedItem(item.id);
      const kubitoFile = await loadGalleryKubito(item);
      importKubito(kubitoFile);
      onClose(); // Cerrar el modal después de cargar el diseño
    } catch (error) {
      console.error('Error loading gallery item:', error);
      alert('Error al cargar el diseño de la galería');
    } finally {
      setSelectedItem(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Galería de Diseños
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Selecciona un diseño para cargarlo en el canvas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <div className="mb-2 animate-spin text-4xl">⏳</div>
                  <p>Cargando galería...</p>
                </div>
              </div>
            ) : galleryItems.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-4 h-16 w-16 opacity-50" />
                  <p className="text-lg font-medium">
                    No hay diseños en la galería
                  </p>
                  <p className="mt-2 text-sm">
                    Agrega diseños en la carpeta public/kubito-gallery
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {galleryItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => void handleItemClick(item)}
                    disabled={selectedItem === item.id}
                    className={`
                      group relative overflow-hidden rounded-xl border-2 bg-white dark:bg-gray-800
                      transition-all duration-200 hover:scale-105 hover:shadow-xl
                      ${
                        selectedItem === item.id
                          ? 'cursor-wait border-purple-500 opacity-50'
                          : 'cursor-pointer border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500'
                      }
                    `}
                    title={item.description}
                  >
                    {/* Thumbnail */}
                    <div
                      className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${getGalleryThumbnailUrl(item)})`,
                        backgroundSize: '85%',
                        backgroundPosition: 'center',
                        maxWidth: '100%',
                        backgroundRepeat: 'no-repeat',
                      }}
                    ></div>

                    {/* Title and Description */}
                    <div className="p-4 text-left">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        {item.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>

                    {/* Loading overlay */}
                    {selectedItem === item.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/90 dark:bg-gray-800/90">
                        <div className="text-center">
                          <div className="animate-spin text-4xl">⏳</div>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            Cargando...
                          </p>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>
                {galleryItems.length}{' '}
                {galleryItems.length === 1 ? 'diseño' : 'diseños'} disponibles
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

GalleryModal.displayName = 'GalleryModal';
