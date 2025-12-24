/**
 * Supabase Browser Client
 * 
 * This client is used for client-side operations in React components.
 * It uses the anon key which is safe to expose in the browser.
 * 
 * Requirements: 3.2, 12.1
 */

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/lib/types/database';

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Get or create a singleton Supabase browser client
 * This ensures we reuse the same client instance across the application
 */
export function getSupabaseBrowserClient() {
  if (client) {
    return client;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  client = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

  return client;
}

/**
 * Export a default instance for convenience
 */
export const supabase = getSupabaseBrowserClient();
