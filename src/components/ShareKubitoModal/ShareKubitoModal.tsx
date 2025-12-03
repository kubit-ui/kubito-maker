import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadKubito } from '@/services/kubitoUploadService';
import { exportToWebPBlob } from '@/utils/export';
import { useEditorStore } from '@/store/editorStore';

interface ShareKubitoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareKubitoModal = memo<ShareKubitoModalProps>(
  ({ isOpen, onClose }) => {
    const [authorName, setAuthorName] = useState('');
    const [authorEmail, setAuthorEmail] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<
      'idle' | 'success' | 'error'
    >('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const editorStore = useEditorStore();

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      void handleUpload();
    };

    const handleUpload = async () => {
      if (!authorName.trim() || !title.trim()) {
        setErrorMessage('Please complete all required fields');
        setUploadStatus('error');
        return;
      }

      setIsUploading(true);
      setUploadStatus('idle');
      setErrorMessage('');

      try {
        // Deselect all items to hide selection UI
        editorStore.deselectAll();

        // Small delay to ensure UI updates before export
        await new Promise((resolve) => setTimeout(resolve, 50));

        // Get SVG element
        const svg = document.querySelector('#kubito-canvas') as SVGSVGElement;
        if (!svg) {
          throw new Error('Canvas not found');
        }

        // Export canvas as WebP blob
        const blob = await exportToWebPBlob(svg, {
          width: editorStore.config.canvasWidth,
          height: editorStore.config.canvasHeight,
          quality: 0.95,
          transparentBackground: false,
        });

        if (!blob) {
          throw new Error('Could not generate image');
        }

        // Get state data to save as .kubito
        // Data will be stored minified (without spaces) to save space
        const kubitoData = {
          items: editorStore.items,
          brushStrokes: editorStore.brushStrokes,
          selectedBodyId: editorStore.selectedBodyId,
          config: editorStore.config,
        };

        // Upload to Supabase
        const result = await uploadKubito({
          authorName: authorName.trim(),
          authorEmail: authorEmail.trim() || undefined,
          title: title.trim(),
          description: description.trim() || undefined,
          imageBlob: blob,
          kubitoData,
        });

        if (result.success) {
          setUploadStatus('success');
          // Clear form
          setTimeout(() => {
            setAuthorName('');
            setAuthorEmail('');
            setTitle('');
            setTitle('');
            setDescription('');
            setUploadStatus('idle');
            onClose();
          }, 2000);
        } else {
          setUploadStatus('error');
          setErrorMessage(result.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Error sharing kubito:', error);
        setUploadStatus('error');
        setErrorMessage(
          error instanceof Error ? error.message : 'Unexpected error'
        );
      } finally {
        setIsUploading(false);
      }
    };

    const handleClose = () => {
      if (!isUploading) {
        setAuthorName('');
        setTitle('');
        setDescription('');
        setUploadStatus('idle');
        setErrorMessage('');
        onClose();
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
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Upload className="w-6 h-6" />
                Share to Gallery
              </h2>
              <button
                onClick={handleClose}
                disabled={isUploading}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Author Name */}
              <div>
                <label
                  htmlFor="authorName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="authorName"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  disabled={isUploading}
                  placeholder="e.g. John Doe"
                  maxLength={50}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Author Email */}
              <div>
                <label
                  htmlFor="authorEmail"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Your Email (optional)
                </label>
                <input
                  type="email"
                  id="authorEmail"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  disabled={isUploading}
                  placeholder="e.g. you@email.com"
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                  placeholder="e.g. My Favorite Kubito"
                  maxLength={100}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isUploading}
                  placeholder="Tell us about your creation..."
                  maxLength={500}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           disabled:opacity-50 disabled:cursor-not-allowed resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {description.length}/500 characters
                </p>
              </div>

              {/* Status Messages */}
              {uploadStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 
                           border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Your Kubito has been shared successfully!
                  </span>
                </motion.div>
              )}

              {uploadStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 
                           border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  <span className="text-sm text-red-700 dark:text-red-300">
                    {errorMessage || 'Error sharing'}
                  </span>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isUploading || uploadStatus === 'success'}
                className="w-full py-3 px-4 bg-kubito-primary 
                         hover:bg-kubito-primary-hover
                         text-white font-medium rounded-lg
                         transition-all duration-300
                         disabled:opacity-50 disabled:cursor-not-allowed
                         shadow-md hover:shadow-lg
                         flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sharing...
                  </>
                ) : uploadStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Shared
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Share to Gallery
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Al compartir, aceptas que tu creación sea visible públicamente
                en la galería comunitaria.
              </p>
            </form>
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }
);

ShareKubitoModal.displayName = 'ShareKubitoModal';
