/**
 * useAuth Hook
 * 
 * Manages authentication state throughout the app.
 * 
 * FEATURES:
 * - Current user session
 * - Authentication status
 * - Sign in/out functions
 * - Real-time auth state changes
 * - Campus information
 * 
 * USAGE:
 * ```tsx
 * const { user, isAuthenticated, isLoading, signOut } = useAuth();
 * ```
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { supabase, onAuthStateChange } from '@/lib/supabase';
import { getCurrentAuthSession, signOutUser } from '@/lib/auth';
import type { AuthSession } from '@/types/database.types';

// ===========================
// Auth Context Type
// ===========================

interface AuthContextType {
  user: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isModerator: boolean;
  campusId: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// ===========================
// Create Context
// ===========================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===========================
// Auth Provider Component
// ===========================

export function AuthProvider({ children }: { children: ReactNode }) {
  console.log('🎬 [AuthProvider] Initializing');
  
  const [user, setUser] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // ===========================
  // Load Session on Mount
  // ===========================
  useEffect(() => {
    console.log('🔄 [AuthProvider] Loading initial session');
    loadSession();
  }, []);
  
  // ===========================
  // Listen to Auth State Changes
  // ===========================
  useEffect(() => {
    console.log('🔄 [AuthProvider] Setting up auth listener');
    
    const subscription = onAuthStateChange((event, session) => {
      console.log('🔔 [AuthProvider] Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ [AuthProvider] User signed in');
        loadSession();
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 [AuthProvider] User signed out');
        setUser(null);
        setIsLoading(false);
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 [AuthProvider] Token refreshed');
        loadSession();
      }
    });
    
    return () => {
      console.log('🛑 [AuthProvider] Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);
  
  // ===========================
  // Load Session Function
  // ===========================
  async function loadSession() {
    console.log('🔵 [AuthProvider] Loading session...');
    setIsLoading(true);
    
    try {
      const session = await getCurrentAuthSession();
      
      if (session) {
        console.log('✅ [AuthProvider] Session loaded');
        console.log('👤 [AuthProvider] User ID:', session.user_id);
        console.log('🏛️ [AuthProvider] Campus ID:', session.campus_id);
        console.log('👮 [AuthProvider] Is Moderator:', session.is_moderator);
        setUser(session);
      } else {
        console.log('⚠️ [AuthProvider] No session found');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ [AuthProvider] Error loading session:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }
  
  // ===========================
  // Sign Out Function
  // ===========================
  async function signOut() {
    console.log('🔵 [AuthProvider] Signing out...');
    setIsLoading(true);
    
    try {
      await signOutUser();
      setUser(null);
      console.log('✅ [AuthProvider] Signed out successfully');
    } catch (error) {
      console.error('❌ [AuthProvider] Error signing out:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }
  
  // ===========================
  // Refresh Session Function
  // ===========================
  async function refreshSession() {
    console.log('🔵 [AuthProvider] Refreshing session...');
    await loadSession();
  }
  
  // ===========================
  // Computed Values
  // ===========================
  const isAuthenticated = !!user;
  const isModerator = user?.is_moderator || false;
  const campusId = user?.campus_id || null;
  
  console.log('📊 [AuthProvider] Current state:', {
    isAuthenticated,
    isModerator,
    isLoading,
  });
  
  // ===========================
  // Provide Context
  // ===========================
  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isModerator,
    campusId,
    signOut,
    refreshSession,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ===========================
// useAuth Hook
// ===========================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// ===========================
// Convenience Hooks
// ===========================

/**
 * Hook to get current user ID
 */
export function useUserId(): string | null {
  const { user } = useAuth();
  return user?.user_id || null;
}

/**
 * Hook to get current campus ID
 */
export function useCampusId(): string | null {
  const { campusId } = useAuth();
  return campusId;
}

/**
 * Hook to check if user is moderator
 */
export function useIsModerator(): boolean {
  const { isModerator } = useAuth();
  return isModerator;
}

/**
 * Hook to require authentication (throws if not authenticated)
 */
export function useRequireAuth(): AuthSession {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    throw new Error('Authentication loading...');
  }
  
  if (!isAuthenticated || !user) {
    throw new Error('Authentication required');
  }
  
  return user;
}
