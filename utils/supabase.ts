
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * SUPABASE SETUP INSTRUCTIONS
 * 
 * To connect your app to Supabase:
 * 
 * 1. Enable Supabase in the Natively editor by clicking the Supabase button
 * 2. Create a Supabase project at https://app.supabase.com if you don't have one
 * 3. Get your project credentials from Settings > API in your Supabase dashboard
 * 4. Create a .env file in the root of your project (copy from .env.example)
 * 5. Add your credentials to the .env file:
 *    EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
 *    EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
 * 
 * Features available:
 * - Authentication (Email/Password, OAuth providers)
 * - Database (PostgreSQL with real-time subscriptions)
 * - Storage (File uploads and downloads)
 * - Edge Functions (Serverless functions)
 * 
 * Usage example:
 * import { supabase } from '@/utils/supabase';
 * 
 * // Sign in
 * const { data, error } = await supabase.auth.signInWithPassword({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * 
 * // Query data
 * const { data, error } = await supabase
 *   .from('table_name')
 *   .select('*')
 *   .eq('column', 'value');
 */

// Replace these with your actual Supabase project credentials
// You can find these in your Supabase project settings at https://app.supabase.com
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
