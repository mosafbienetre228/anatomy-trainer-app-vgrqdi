
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';

// Import supabase lazily to avoid circular dependencies
let supabaseInstance: any = null;

const getSupabase = () => {
  if (!supabaseInstance) {
    const { supabase } = require('@/utils/supabase');
    supabaseInstance = supabase;
  }
  return supabaseInstance;
};

interface SupabaseContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  isAuthenticated: boolean;
  hasTrialAccess: boolean;
  hasPremiumAccess: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    console.error('useSupabase must be used within a SupabaseProvider');
    // Return a safe fallback to prevent crashes
    return {
      session: null,
      user: null,
      loading: false,
      signIn: async () => ({ error: null }),
      signUp: async () => ({ error: null }),
      signOut: async () => ({ error: null }),
      isAuthenticated: false,
      hasTrialAccess: true,
      hasPremiumAccess: false,
    };
  }
  return context;
}

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    console.log('SupabaseProvider: Initializing');
    
    const initializeAuth = async () => {
      try {
        const supabase = getSupabase();
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('SupabaseProvider: Error getting session:', error);
        } else {
          console.log('SupabaseProvider: Initial session loaded', initialSession ? 'authenticated' : 'not authenticated');
          setSession(initialSession);
        }
        
        setLoading(false);
        setInitialized(true);

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, newSession: Session | null) => {
          console.log('SupabaseProvider: Auth state changed:', _event);
          setSession(newSession);
          setLoading(false);
        });

        return () => {
          console.log('SupabaseProvider: Cleaning up auth subscription');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('SupabaseProvider: Fatal error during initialization:', error);
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error('SupabaseProvider: Error signing in:', error);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });
      return { error };
    } catch (error) {
      console.error('SupabaseProvider: Error signing up:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('SupabaseProvider: Error signing out:', error);
      return { error: error as AuthError };
    }
  };

  const value: SupabaseContextType = {
    session,
    user: session?.user ?? null,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!session,
    hasTrialAccess: true, // Full trial access enabled
    hasPremiumAccess: !!session,
  };

  // Don't render children until initialized
  if (!initialized) {
    console.log('SupabaseProvider: Waiting for initialization');
    return null;
  }

  console.log('SupabaseProvider: Rendering children');
  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}
