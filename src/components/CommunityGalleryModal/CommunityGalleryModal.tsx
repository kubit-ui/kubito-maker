import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Heart,
  Eye,
  User,
  Calendar,
  Download,
  Mail,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  getCommunityKubitos,
  incrementViews,
  incrementLikes,
} from '@/services/kubitoUploadService';
import type { KubitoSubmission } from '@/lib/supabase';
import { useEditorStore } from '@/store/editorStore';
import { useAnalytics } from '@/hooks';

interface CommunityGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityGalleryModal = memo<CommunityGalleryModalProps>(
  ({ isOpen, onClose }) => {
    const [kubitos, setKubitos] = useState<KubitoSubmission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedKubito, setSelectedKubito] =
      useState<KubitoSubmission | null>(null);
    const [likedKubitos, setLikedKubitos] = useState<Set<string>>(new Set());
    const editorStore = useEditorStore();
    const {
      trackGalleryOpened,
      trackKubitoLoaded,
      trackKubitoLiked,
      trackKubitoDownloaded,
    } = useAnalytics();

    useEffect(() => {
      if (isOpen) {
        void loadKubitos();

        // Track gallery opened
        trackGalleryOpened();

        // Load likes from localStorage
        const stored = localStorage.getItem('kubito-likes');
        if (stored) {
          setLikedKubitos(new Set(JSON.parse(stored)));
        }
      }
    }, [isOpen]);

    const loadKubitos = async () => {
      setIsLoading(true);
      try {
        const data = await getCommunityKubitos(100);
        setKubitos(data);
      } catch (error) {
        console.error('Error loading kubitos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    };

    const handleLoadKubito = (kubito: KubitoSubmission) => {
      if (!kubito.kubito_data) {
        alert('This Kubito has no data to load');
        return;
      }

      try {
        const data = kubito.kubito_data as {
          items?: unknown[];
          brushStrokes?: unknown[];
          selectedBodyId?: string;
          config?: unknown;
        };

        // Restore editor state
        if (data.items) {
          // Use loadProject to restore everything properly
          editorStore.loadProject?.(
            data.items as any[],
            data.config as any,
            data.brushStrokes as any[],
            typeof data.selectedBodyId === 'string'
              ? data.selectedBodyId
              : undefined
          );

          // Track kubito loaded
          trackKubitoLoaded(kubito.id, 'gallery');

          // Close modal and show confirmation
          onClose();
          setSelectedKubito(null);

          // Notify user
          setTimeout(() => {
            alert(`✅ Kubito "${kubito.title}" loaded successfully!`);
          }, 300);
        }
      } catch (error) {
        console.error('Error loading kubito data:', error);
        alert('Error loading Kubito. The data format may be invalid.');
      }
    };

    const handleDownloadKubito = (kubito: KubitoSubmission) => {
      if (!kubito.kubito_data) {
        alert('This Kubito has no data to download');
        return;
      }

      try {
        // Create a blob with the data
        const dataStr = JSON.stringify(kubito.kubito_data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        // Create a download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `${kubito.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.kubito`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up the URL
        URL.revokeObjectURL(url);

        // Track kubito download
        trackKubitoDownloaded(kubito.id);
      } catch (error) {
        console.error('Error downloading kubito:', error);
        alert('Error downloading .kubito file');
      }
    };

    const handleKubitoClick = (kubito: KubitoSubmission) => {
      setSelectedKubito(kubito);
      // Automatically increment views
      void incrementViews(kubito.id);
      // Update counter locally
      setKubitos((prev) =>
        prev.map((k) => (k.id === kubito.id ? { ...k, views: k.views + 1 } : k))
      );
    };

    const handleLike = (kubito: KubitoSubmission) => {
      const isLiked = likedKubitos.has(kubito.id);

      if (isLiked) {
        // Already liked, do nothing or remove like
        return;
      }

      // Add like
      const newLiked = new Set(likedKubitos);
      newLiked.add(kubito.id);
      setLikedKubitos(newLiked);

      // Save to localStorage
      localStorage.setItem('kubito-likes', JSON.stringify([...newLiked]));

      // Increment in database
      void incrementLikes(kubito.id);

      // Track like
      trackKubitoLiked(kubito.id);

      // Update counter locally
      setKubitos((prev) =>
        prev.map((k) => (k.id === kubito.id ? { ...k, likes: k.likes + 1 } : k))
      );
    };

    if (!isOpen) return null;

    return (
      <AnimatePresence>
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-6 h-6" />
                Community Gallery
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin text-blue-500 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading gallery...
                  </p>
                </div>
              ) : kubitos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    No Kubitos in the gallery yet
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                    Be the first to share one!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {kubitos.map((kubito) => (
                    <motion.div
                      key={kubito.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                      onClick={() => handleKubitoClick(kubito)}
                    >
                      {/* Image */}
                      <div className="aspect-square bg-gray-100 dark:bg-gray-600 overflow-hidden">
                        <img
                          src={kubito.image_url}
                          alt={kubito.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 truncate">
                          {kubito.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-3">
                          <User className="w-3 h-3" />
                          {kubito.author_name}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(kubito);
                            }}
                            className={`flex items-center gap-1 transition-colors ${
                              likedKubitos.has(kubito.id)
                                ? 'text-red-500'
                                : 'hover:text-red-500'
                            }`}
                            disabled={likedKubitos.has(kubito.id)}
                          >
                            <Heart
                              className={`w-3 h-3 ${
                                likedKubitos.has(kubito.id)
                                  ? 'fill-current'
                                  : ''
                              }`}
                            />
                            {kubito.likes}
                          </button>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {kubito.views}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Detail Modal */}
          <AnimatePresence>
            {selectedKubito && (
              <div
                className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                onClick={(e) => {
                  if (e.target === e.currentTarget) {
                    setSelectedKubito(null);
                  }
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedKubito(null)}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors shadow-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="grid md:grid-cols-2 gap-6 p-6">
                    {/* Image */}
                    <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                      <img
                        src={selectedKubito.image_url}
                        alt={selectedKubito.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex flex-col">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {selectedKubito.title}
                      </h2>

                      {/* Author */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          Created by
                        </p>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-400" />
                          <p className="text-lg text-gray-900 dark:text-white">
                            {selectedKubito.author_name}
                          </p>
                        </div>
                        {selectedKubito.author_email && (
                          <div className="flex items-center gap-2 mt-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <a
                              href={`mailto:${selectedKubito.author_email}`}
                              className="text-sm text-blue-500 hover:underline"
                            >
                              {selectedKubito.author_email}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Date */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {formatDate(selectedKubito.created_at)}
                        </p>
                      </div>

                      {/* Description */}
                      {selectedKubito.description && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            Description
                          </p>
                          <p className="text-gray-700 dark:text-gray-300">
                            {selectedKubito.description}
                          </p>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-6 mb-6 py-4 border-y border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => handleLike(selectedKubito)}
                          disabled={likedKubitos.has(selectedKubito.id)}
                          className={`flex items-center gap-2 transition-all ${
                            likedKubitos.has(selectedKubito.id)
                              ? 'text-red-500'
                              : 'hover:text-red-500 cursor-pointer'
                          }`}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              likedKubitos.has(selectedKubito.id)
                                ? 'fill-current'
                                : ''
                            }`}
                          />
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {selectedKubito.likes}
                          </span>
                          <span className="text-sm text-gray-500">
                            {likedKubitos.has(selectedKubito.id)
                              ? 'You like this'
                              : 'Like'}
                          </span>
                        </button>
                        <div className="flex items-center gap-2">
                          <Eye className="w-5 h-5 text-blue-500" />
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {selectedKubito.views}
                          </span>
                          <span className="text-sm text-gray-500">views</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto space-y-3">
                        {selectedKubito.kubito_data && (
                          <>
                            <button
                              onClick={() => handleLoadKubito(selectedKubito)}
                              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 
                                     text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 
                                     transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <ImageIcon className="w-5 h-5" />
                              Load in Editor
                            </button>
                            <button
                              onClick={() =>
                                handleDownloadKubito(selectedKubito)
                              }
                              className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 
                                     text-gray-900 dark:text-white font-semibold rounded-lg 
                                     hover:bg-gray-300 dark:hover:bg-gray-600 
                                     transition-all duration-300 flex items-center justify-center gap-2"
                            >
                              <Download className="w-5 h-5" />
                              Download .kubito
                            </button>
                          </>
                        )}
                        {!selectedKubito.kubito_data && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                            This Kubito has no data for loading
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </AnimatePresence>
    );
  }
);

CommunityGalleryModal.displayName = 'CommunityGalleryModal';
