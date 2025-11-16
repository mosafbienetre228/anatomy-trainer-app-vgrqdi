import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://kfuqsnylkhqsdavkqnbl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdXFzbnlsa2hxc2RhdmtxbmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyNjE2NjAsImV4cCI6MjA3ODgzNzY2MH0.NgLYJ4Xao4XWxGpEIpJUYX7ay7X9xWSmvs_d4PNhyl0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
