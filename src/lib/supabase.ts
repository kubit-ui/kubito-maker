import { createClient } from '@supabase/supabase-js';

// These variables are configured in the .env file (local) or Vercel environment variables (production)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please check your .env file or Vercel settings.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface KubitoSubmission {
  id: string;
  created_at: string;
  author_name: string;
  author_email?: string;
  title: string;
  description?: string;
  image_url: string;
  thumbnail_url?: string;
  kubito_data?: Record<string, unknown>; // JSON completo del archivo .kubito
  likes: number;
  views: number;
}
