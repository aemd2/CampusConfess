/**
 * Authentication Service
 * 
 * This file contains all authentication-related business logic:
 * - Campus email verification (.edu emails)
 * - 6-digit code verification
 * - User session management
 * - Campus verification
 * 
 * FLOW:
 * 1. User enters .edu email → sends verification code
 * 2. User enters 6-digit code → verifies and creates account
 * 3. User is authenticated and redirected to main app
 */

import { supabase } from './supabase';
import * as Crypto from 'expo-crypto';
import type {
  CampusVerificationInput,
  VerifyCodeInput,
  Campus,
  User,
  AuthSession,
} from '@/types/database.types';

// ===========================
// Constants
// ===========================

const VERIFICATION_CODE_LENGTH = 6;
const VERIFICATION_CODE_EXPIRY_MINUTES = 15;

// ===========================
// Helper Functions
// ===========================

/**
 * Hash email for privacy (SHA-256)
 * Stores hashed email in database, never plaintext
 */
async function hashEmail(email: string): Promise<string> {
  const normalized = email.toLowerCase().trim();
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    normalized
  );
  return hash;
}

/**
 * Generate 6-digit verification code
 */
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Validate .edu email format
 */
function validateEduEmail(email: string): { valid: boolean; error?: string } {
  console.log('🔵 [Auth] Validating email:', email);
  
  const trimmed = email.toLowerCase().trim();
  
  // Check basic email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  // Check .edu domain
  if (!trimmed.endsWith('.edu')) {
    return {
      valid: false,
      error: 'Must use a .edu email address from your campus',
    };
  }
  
  console.log('✅ [Auth] Email validation passed');
  return { valid: true };
}

// ===========================
// Campus Email Verification
// ===========================

/**
 * Send verification code to .edu email
 * 
 * Steps:
 * 1. Validate email format (.edu)
 * 2. Check if campus exists in database
 * 3. Generate 6-digit code
 * 4. Store code in database (hashed email)
 * 5. Send email via Supabase Edge Function
 */
export async function sendVerificationCode(
  input: CampusVerificationInput
): Promise<{ success: boolean; error?: string }> {
  console.log('🔵 [Auth] Sending verification code...');
  console.log('📧 [Auth] Email:', input.email);
  console.log('🏛️ [Auth] Campus ID:', input.campus_id);
  
  try {
    // 1. Validate email
    const validation = validateEduEmail(input.email);
    if (!validation.valid) {
      console.error('❌ [Auth] Email validation failed:', validation.error);
      return { success: false, error: validation.error };
    }
    
    // 2. Check if campus exists
    const { data: campus, error: campusError } = await supabase
      .from('campuses')
      .select('id, name, domain')
      .eq('id', input.campus_id)
      .eq('is_active', true)
      .single();
    
    if (campusError || !campus) {
      console.error('❌ [Auth] Campus not found:', campusError);
      return { success: false, error: 'Campus not found or inactive' };
    }
    
    // 3. Verify email domain matches campus
    const emailDomain = input.email.split('@')[1];
    if (emailDomain !== campus.domain) {
      console.error('❌ [Auth] Email domain mismatch');
      return {
        success: false,
        error: `Email must be from ${campus.domain}`,
      };
    }
    
    // 4. Hash email for privacy
    const emailHash = await hashEmail(input.email);
    
    // 5. Generate verification code
    const code = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + VERIFICATION_CODE_EXPIRY_MINUTES);
    
    console.log('🔑 [Auth] Generated code:', code);
    console.log('⏰ [Auth] Expires at:', expiresAt.toISOString());
    
    // 6. Store verification code in database
    const { error: insertError } = await supabase
      .from('email_verifications')
      .insert({
        email: emailHash,
        verification_code: code,
        expires_at: expiresAt.toISOString(),
        is_used: false,
      });
    
    if (insertError) {
      console.error('❌ [Auth] Error storing verification code:', insertError);
      return { success: false, error: 'Failed to generate verification code' };
    }
    
    // 7. Send email via Edge Function
    const { error: emailError } = await supabase.functions.invoke(
      'verify-campus-email',
      {
        body: {
          email: input.email,
          code: code,
          campus_name: campus.name,
        },
      }
    );
    
    if (emailError) {
      console.error('❌ [Auth] Error sending email:', emailError);
      return {
        success: false,
        error: 'Failed to send verification email. Please try again.',
      };
    }
    
    console.log('✅ [Auth] Verification code sent successfully');
    return { success: true };
    
  } catch (error: any) {
    console.error('🚨 [Auth] Unexpected error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

// ===========================
// Code Verification & Account Creation
// ===========================

/**
 * Verify 6-digit code and create user account
 * 
 * Steps:
 * 1. Hash email to match database
 * 2. Find verification code in database
 * 3. Check if code is valid (not expired, not used)
 * 4. Create Supabase auth user
 * 5. Create user profile in database
 * 6. Mark verification code as used
 * 7. Return auth session
 */
export async function verifyCodeAndCreateAccount(
  input: VerifyCodeInput
): Promise<{ success: boolean; session?: AuthSession; error?: string }> {
  console.log('🔵 [Auth] Verifying code...');
  console.log('📧 [Auth] Email:', input.email);
  console.log('🔑 [Auth] Code:', input.code);
  
  try {
    // 1. Validate code format
    if (input.code.length !== VERIFICATION_CODE_LENGTH) {
      return { success: false, error: 'Invalid verification code format' };
    }
    
    // 2. Hash email
    const emailHash = await hashEmail(input.email);
    
    // 3. Find verification code in database
    const { data: verification, error: verificationError } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', emailHash)
      .eq('verification_code', input.code)
      .eq('is_used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (verificationError || !verification) {
      console.error('❌ [Auth] Verification code not found');
      return { success: false, error: 'Invalid verification code' };
    }
    
    // 4. Check if code is expired
    const now = new Date();
    const expiresAt = new Date(verification.expires_at);
    
    if (now > expiresAt) {
      console.error('❌ [Auth] Verification code expired');
      return {
        success: false,
        error: 'Verification code expired. Please request a new one.',
      };
    }
    
    console.log('✅ [Auth] Verification code is valid');
    
    // 5. Get campus info
    const emailDomain = input.email.split('@')[1];
    const { data: campus, error: campusError } = await supabase
      .from('campuses')
      .select('id')
      .eq('domain', emailDomain)
      .single();
    
    if (campusError || !campus) {
      console.error('❌ [Auth] Campus not found for domain:', emailDomain);
      return { success: false, error: 'Campus not found' };
    }
    
    // 6. Create Supabase auth user (magic link - passwordless)
    const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
      email: input.email,
      options: {
        shouldCreateUser: true,
        data: {
          campus_id: campus.id,
          email_hash: emailHash,
        },
      },
    });
    
    if (authError || !authData) {
      console.error('❌ [Auth] Error creating auth user:', authError);
      return { success: false, error: 'Failed to create account' };
    }
    
    // 7. Mark verification code as used
    await supabase
      .from('email_verifications')
      .update({ is_used: true })
      .eq('id', verification.id);
    
    console.log('✅ [Auth] Account created successfully');
    
    // 8. Get session to return user info
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    // 9. Return session info
    return {
      success: true,
      session: {
        user_id: session?.user?.id || '',
        campus_id: campus.id,
        email: input.email,
        role: 'student',
        is_moderator: false,
        access_token: session?.access_token || '',
        refresh_token: session?.refresh_token || '',
        expires_at: session?.expires_at || 0,
      },
    };
    
  } catch (error: any) {
    console.error('🚨 [Auth] Unexpected error:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
}

// ===========================
// Session Management
// ===========================

/**
 * Get current user session
 */
export async function getCurrentAuthSession(): Promise<AuthSession | null> {
  console.log('🔵 [Auth] Getting current session...');
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    console.log('⚠️ [Auth] No active session');
    return null;
  }
  
  // Get user profile from database
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('campus_id, email, role')
    .eq('id', session.user.id)
    .single();
  
  if (userError || !user) {
    console.error('❌ [Auth] User profile not found');
    return null;
  }
  
  console.log('✅ [Auth] Session found');
  
  return {
    user_id: session.user.id,
    campus_id: user.campus_id,
    email: user.email,
    role: user.role,
    is_moderator: user.role === 'moderator' || user.role === 'admin',
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_at: session.expires_at || 0,
  };
}

/**
 * Sign out current user
 */
export async function signOutUser(): Promise<void> {
  console.log('🔵 [Auth] Signing out user...');
  
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('❌ [Auth] Error signing out:', error);
    throw error;
  }
  
  console.log('✅ [Auth] User signed out successfully');
}

// ===========================
// Campus Management
// ===========================

/**
 * Get all active campuses
 */
export async function getActiveCampuses(): Promise<Campus[]> {
  console.log('🔵 [Auth] Fetching active campuses...');
  
  const { data, error } = await supabase
    .from('campuses')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });
  
  if (error) {
    console.error('❌ [Auth] Error fetching campuses:', error);
    return [];
  }
  
  console.log('✅ [Auth] Fetched', data?.length || 0, 'campuses');
  return data || [];
}
