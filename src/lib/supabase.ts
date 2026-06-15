import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('🚨 Supabase URL or Anon Key is missing from environment variables!');
}

// Export the supabase client so you can import it in your components/hooks
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
