import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xxnibumdtxqbazpbeisl.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Detect whether valid public anon key has been supplied
export const isSupabaseConfigured = () => {
  return Boolean(
    supabaseAnonKey && 
    supabaseAnonKey.length > 20 && 
    !supabaseAnonKey.includes('placeholder')
  );
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  if (!supabaseInstance) {
    // If not configured, provide a safe client to avoid runtime crashes
    const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy';
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey || fallbackKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return supabaseInstance;
};

export const supabase = getSupabaseClient();
