
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * SUPABASE CONFIGURATION
 * 
 * This is the SINGLE source of truth for Supabase client.
 * Import this file everywhere you need Supabase:
 * 
 * import { supabase } from '@/utils/supabase';
 */

console.log('Initializing Supabase client');

// Supabase project credentials
const SUPABASE_URL = 'https://kfuqsnylkhqsdavkqnbl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdXFzbnlsa2hxc2RhdmtxbmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNjE2NjAsImV4cCI6MjA3ODgzNzY2MH0.NgLYJ4Xao4XWxGpEIpJUYX7ay7X9xWSmvs_d4PNhyl0';

// Validate URL
if (!SUPABASE_URL || !SUPABASE_URL.startsWith('http')) {
  console.error('Invalid Supabase URL:', SUPABASE_URL);
  throw new Error('Invalid Supabase URL configuration');
}

if (!SUPABASE_ANON_KEY) {
  console.error('Missing Supabase anon key');
  throw new Error('Missing Supabase anon key configuration');
}

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

export default supabase;
