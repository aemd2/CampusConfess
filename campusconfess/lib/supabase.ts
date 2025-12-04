/**
 * Supabase Client Configuration
 * 
 * This file initializes the Supabase client for CampusConfess.
 * It handles authentication, database queries, storage, and real-time subscriptions.
 * 
 * IMPORTANT:
 * - Uses AsyncStorage for session persistence (React Native)
 * - Auto-refresh tokens enabled
 * - Secure storage for auth tokens
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ===========================
// Environment Variables Check
// ===========================
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    '❌ Missing Supabase credentials!\n\n' +
    'Please set up your .env.local file with:\n' +
    '- EXPO_PUBLIC_SUPABASE_URL\n' +
    '- EXPO_PUBLIC_SUPABASE_ANON_KEY\n\n' +
    'See ENV_SETUP.md for instructions.'
  );
}

// ===========================
// Secure Storage Adapter
// ===========================
/**
 * Custom storage adapter that uses SecureStore for sensitive data
 * and AsyncStorage for non-sensitive data
 */
class SupabaseStorage {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key);
    }
    
    // Use SecureStore for auth tokens on mobile
    if (key.includes('auth-token') || key.includes('session')) {
      return await SecureStore.getItemAsync(key);
    }
    
    return await AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.setItem(key, value);
    }
    
    // Use SecureStore for auth tokens on mobile
    if (key.includes('auth-token') || key.includes('session')) {
      return await SecureStore.setItemAsync(key, value);
    }
    
    return await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      return AsyncStorage.removeItem(key);
    }
    
    if (key.includes('auth-token') || key.includes('session')) {
      return await SecureStore.deleteItemAsync(key);
    }
    
    return await AsyncStorage.removeItem(key);
  }
}

// ===========================
// Supabase Client Instance
// ===========================
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: new SupabaseStorage(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable for mobile
  },
  global: {
    headers: {
      'x-app-name': 'campusconfess',
      'x-app-version': '1.0.0',
    },
  },
});

// ===========================
// Helper Functions
// ===========================

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  console.log('🔵 [Supabase] Checking authentication status...');
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('❌ [Supabase] Error checking auth:', error);
    return false;
  }
  
  const isAuth = !!session;
  console.log('✅ [Supabase] Auth status:', isAuth ? 'Authenticated' : 'Not authenticated');
  
  return isAuth;
}

/**
 * Get current user session
 */
export async function getCurrentSession() {
  console.log('🔵 [Supabase] Getting current session...');
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('❌ [Supabase] Error getting session:', error);
    return null;
  }
  
  if (session) {
    console.log('✅ [Supabase] Session found for user:', session.user.id);
  } else {
    console.log('⚠️ [Supabase] No active session');
  }
  
  return session;
}

/**
 * Get current user
 */
export async function getCurrentUser() {
  console.log('🔵 [Supabase] Getting current user...');
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('❌ [Supabase] Error getting user:', error);
    return null;
  }
  
  if (user) {
    console.log('✅ [Supabase] User found:', user.email);
  } else {
    console.log('⚠️ [Supabase] No user found');
  }
  
  return user;
}

/**
 * Sign out current user
 */
export async function signOut() {
  console.log('🔵 [Supabase] Signing out...');
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('❌ [Supabase] Error signing out:', error);
    throw error;
  }
  
  console.log('✅ [Supabase] Successfully signed out');
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  console.log('🔵 [Supabase] Setting up auth state listener...');
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔄 [Supabase] Auth state changed:', event);
    callback(event, session);
  });
  
  return subscription;
}

// ===========================
// Development Helpers
// ===========================

if (__DEV__) {
  console.log('🔧 [Supabase] Development mode - Client initialized');
  console.log('📍 [Supabase] URL:', SUPABASE_URL);
  console.log('🔑 [Supabase] Anon key:', SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
}
