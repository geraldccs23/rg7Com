import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserProfile, AuthState } from '../types/auth';
import { getCurrentUser } from '../lib/auth';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const refreshUser = async () => {
    try {
      console.log('Refreshing user...');
      const user = await getCurrentUser();
      console.log('User refreshed:', user?.email || 'No user');
      setState(prev => ({ ...prev, user, loading: false }));
    } catch (error) {
      console.error('Error refreshing user:', error);
      setState(prev => ({ 
        ...prev, 
        user: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error loading user' 
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      console.log('Attempting to sign in with:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Supabase auth error:', error);
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error.message
        }));
        throw error;
      }
      
      console.log('Auth successful, user:', data.user?.email);
      
      // Wait a moment for the session to be established
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await refreshUser();
    } catch (error) {
      console.error('Sign in error:', error);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error signing in' 
      }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setState({ user: null, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Error signing out' 
      }));
      throw error;
    }
  };

  useEffect(() => {
    let mounted = true;
    
    // Check initial session with timeout
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Set a timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth initialization timeout')), 10000)
        );
        
        const authPromise = supabase.auth.getSession();
        
        const { data: { session } } = await Promise.race([authPromise, timeoutPromise]) as any;
        
        console.log('Initial session:', session?.user?.email || 'No session');
        
        if (!mounted) return;
        
        if (session?.user) {
          await refreshUser();
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setState(prev => ({ 
            ...prev, 
            loading: false,
            error: 'Error connecting to authentication service'
          }));
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session?.user?.email || 'No user');
        
        if (event === 'SIGNED_IN' && session) {
          await refreshUser();
        } else if (event === 'SIGNED_OUT') {
          setState({ user: null, loading: false, error: null });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}