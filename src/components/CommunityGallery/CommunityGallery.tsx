import { memo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, User, Calendar } from "lucide-react";
import {
  getCommunityKubitos,
  incrementViews,
  incrementLikes,
} from "@/services/kubitoUploadService";
import type { KubitoSubmission } from "@/lib/supabase";

export const CommunityGallery = memo(() => {
  const [kubitos, setKubitos] = useState<KubitoSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedKubitos, setLikedKubitos] = useState<Set<string>>(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem("liked-kubitos");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        return new Set(parsed);
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  const loadKubitos = async () => {
    const data = await getCommunityKubitos(50, 0);
    setKubitos(data);
    setLoading(false);
  };

  useEffect(() => {
    void loadKubitos();
  }, []);

  const handleKubitoClick = async (kubito: KubitoSubmission) => {
    await incrementViews(kubito.id);
    // Update local state
    setKubitos((prev) =>
      prev.map((k) => (k.id === kubito.id ? { ...k, views: k.views + 1 } : k)),
    );
  };

  const handleLike = async (kubito: KubitoSubmission, e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if already liked (from localStorage)
    if (likedKubitos.has(kubito.id)) {
      return;
    }

    await incrementLikes(kubito.id);

    // Update local state
    setKubitos((prev) =>
      prev.map((k) => (k.id === kubito.id ? { ...k, likes: k.likes + 1 } : k)),
    );

    // Mark as liked
    setLikedKubitos((prev) => new Set(prev).add(kubito.id));

    // Save to localStorage
    localStorage.setItem(
      "liked-kubitos",
      JSON.stringify([...likedKubitos, kubito.id]),
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 dark:text-gray-400">
          Cargando galería comunitaria...
        </div>
      </div>
    );
  }

  if (kubitos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Aún no hay Kubitos compartidos
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          ¡Sé el primero en compartir tu creación con la comunidad!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {kubitos.map((kubito) => (
        <motion.div
          key={kubito.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden 
                   cursor-pointer transition-all hover:shadow-xl"
          onClick={() => void handleKubitoClick(kubito)}
        >
          {/* Image */}
          <div className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
            <img
              src={kubito.image_url}
              alt={kubito.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
              {kubito.title}
            </h3>

            {/* Description */}
            {kubito.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {kubito.description}
              </p>
            )}

            {/* Author */}
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <User className="w-4 h-4" />
              <span>{kubito.author_name}</span>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(kubito.created_at)}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={(e) => void handleLike(kubito, e)}
                disabled={likedKubitos.has(kubito.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
                  likedKubitos.has(kubito.id)
                    ? "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${likedKubitos.has(kubito.id) ? "fill-current" : ""}`}
                />
                <span className="text-sm font-medium">{kubito.likes}</span>
              </button>

              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{kubito.views}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
});

CommunityGallery.displayName = "CommunityGallery";
