
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * SUPABASE CONFIGURATION
 * 
 * This app is connected to Supabase for:
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

// Supabase project credentials
const SUPABASE_URL = 'https://kfuqsnylkhqsdavkqnbl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdXFzbnlsa2hxc2RhdmtxbmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNjE2NjAsImV4cCI6MjA3ODgzNzY2MH0.NgLYJ4Xao4XWxGpEIpJUYX7ay7X9xWSmvs_d4PNhyl0';

// Validate URL format before creating client
function validateSupabaseUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' && urlObj.hostname.includes('supabase.co');
  } catch (error) {
    console.error('Invalid Supabase URL:', error);
    return false;
  }
}

if (!SUPABASE_URL || !validateSupabaseUrl(SUPABASE_URL)) {
  console.error('Invalid Supabase URL configuration');
  throw new Error('Invalid Supabase URL. Must be a valid HTTPS URL ending with supabase.co');
}

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.length < 20) {
  console.error('Invalid Supabase anon key configuration');
  throw new Error('Invalid Supabase anon key');
}

console.log('Initializing Supabase client with URL:', SUPABASE_URL);

// Create a single supabase client for interacting with your database
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log('Supabase client initialized successfully');
