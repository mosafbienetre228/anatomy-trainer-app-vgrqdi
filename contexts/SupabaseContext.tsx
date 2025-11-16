
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';

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

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('SupabaseProvider: Initializing auth state');
    
    // Get initial session with error handling
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('SupabaseProvider: Error getting session:', error.message);
        } else {
          console.log('SupabaseProvider: Initial session loaded:', session ? 'authenticated' : 'not authenticated');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('SupabaseProvider: Exception in getSession:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('SupabaseProvider: Auth state changed:', _event, session ? 'authenticated' : 'not authenticated');
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('SupabaseProvider: Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('SupabaseProvider: Attempting sign in for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('SupabaseProvider: Sign in error:', error.message);
      } else {
        console.log('SupabaseProvider: Sign in successful');
      }
      return { error };
    } catch (error) {
      console.error('SupabaseProvider: Sign in exception:', error);
      return { error: error as AuthError };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log('SupabaseProvider: Attempting sign up for:', email);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed'
        }
      });
      if (error) {
        console.error('SupabaseProvider: Sign up error:', error.message);
      } else {
        console.log('SupabaseProvider: Sign up successful');
      }
      return { error };
    } catch (error) {
      console.error('SupabaseProvider: Sign up exception:', error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      console.log('SupabaseProvider: Attempting sign out');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('SupabaseProvider: Sign out error:', error.message);
      } else {
        console.log('SupabaseProvider: Sign out successful');
      }
      return { error };
    } catch (error) {
      console.error('SupabaseProvider: Sign out exception:', error);
      return { error: error as AuthError };
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!session,
    // Enable full trial access for all users
    hasTrialAccess: true,
    // Premium access for all users during trial period
    hasPremiumAccess: true,
  };

  console.log('SupabaseProvider: Rendering with state:', {
    loading,
    isAuthenticated: !!session,
    hasTrialAccess: true,
    hasPremiumAccess: true,
  });

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
}
