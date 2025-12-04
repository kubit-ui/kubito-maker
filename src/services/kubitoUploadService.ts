import { supabase, type KubitoSubmission } from "../lib/supabase";

export interface UploadKubitoData {
  authorName: string;
  authorEmail?: string;
  title: string;
  description?: string;
  imageBlob: Blob;
  kubitoData?: Record<string, unknown>; // Datos del archivo .kubito
}

export interface UploadResult {
  success: boolean;
  data?: KubitoSubmission;
  error?: string;
}

/**
 * Sube una imagen de Kubito a Supabase Storage y registra la submission en la base de datos
 */
export async function uploadKubito(
  data: UploadKubitoData,
): Promise<UploadResult> {
  try {
    const {
      authorName,
      authorEmail,
      title,
      description,
      imageBlob,
      kubitoData,
    } = data;

    // 1. Generate unique file name
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 9);
    const fileName = `kubito-${timestamp}-${randomId}.webp`;

    // 2. Upload image to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("kubitos")
      .upload(fileName, imageBlob, {
        contentType: "image/webp",
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading to storage:", uploadError);
      return {
        success: false,
        error: `Error al subir la imagen: ${uploadError.message}`,
      };
    }

    // 3. Get public URL of the image
    const {
      data: { publicUrl },
    } = supabase.storage.from("kubitos").getPublicUrl(fileName);

    // 4. Save metadata to database
    // Note: kubitoData is stored as JSONB in PostgreSQL, which automatically
    // compresses and stores JSON efficiently (no extra spaces/formatting)
    const { data: submissionData, error: dbError } = await supabase
      .from("kubito_submissions")
      .insert([
        {
          author_name: authorName,
          author_email: authorEmail || null,
          title: title,
          description: description || null,
          image_url: publicUrl,
          kubito_data: kubitoData || null, // Stored as minified JSONB
          likes: 0,
          views: 0,
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Error saving to database:", dbError);
      // Try to delete image if database save fails
      await supabase.storage.from("kubitos").remove([fileName]);
      return {
        success: false,
        error: `Error al guardar en la base de datos: ${dbError.message}`,
      };
    }

    return {
      success: true,
      data: submissionData as KubitoSubmission,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: `Error inesperado: ${error instanceof Error ? error.message : "Desconocido"}`,
    };
  }
}

/**
 * Obtiene todas las submissions de la galería comunitaria
 */
export async function getCommunityKubitos(
  limit = 50,
  offset = 0,
): Promise<KubitoSubmission[]> {
  try {
    const { data, error } = await supabase
      .from("kubito_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Error fetching community kubitos:", error);
      return [];
    }

    return (data || []) as KubitoSubmission[];
  } catch (error) {
    console.error("Unexpected error fetching kubitos:", error);
    return [];
  }
}

/**
 * Incrementa las vistas de un Kubito
 */
export async function incrementViews(id: string): Promise<void> {
  try {
    await supabase.rpc("increment_views", { kubito_id: id });
  } catch (error) {
    console.error("Error incrementing views:", error);
  }
}

/**
 * Incrementa los likes de un Kubito
 */
export async function incrementLikes(id: string): Promise<void> {
  try {
    await supabase.rpc("increment_likes", { kubito_id: id });
  } catch (error) {
    console.error("Error incrementing likes:", error);
  }
}
