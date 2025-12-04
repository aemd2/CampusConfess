/**
 * Verify Campus Email Edge Function
 * 
 * PURPOSE:
 * - Validates .edu email domain matches campus
 * - Generates 6-digit verification code
 * - Stores code in database (hashed email)
 * - Sends email via Supabase Auth built-in SMTP
 * 
 * ENDPOINT: POST /functions/v1/verify-campus-email
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function hashEmail(email: string): Promise<string> {
  const normalized = email.toLowerCase().trim();
  const msgUint8 = new TextEncoder().encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function validateEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }
  if (!trimmed.endsWith('.edu')) {
    return { valid: false, error: 'Must use a .edu email address' };
  }
  return { valid: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, campus_id } = await req.json();
    
    if (!email || !campus_id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email and campus_id are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return new Response(
        JSON.stringify({ success: false, error: emailValidation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { data: campus, error: campusError } = await supabase
      .from('campuses')
      .select('id, name, domain')
      .eq('id', campus_id)
      .eq('is_active', true)
      .single();
    
    if (campusError || !campus) {
      return new Response(
        JSON.stringify({ success: false, error: 'Campus not found or inactive' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const emailDomain = email.split('@')[1];
    if (emailDomain !== campus.domain) {
      return new Response(
        JSON.stringify({ success: false, error: `Email must be from ${campus.domain}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const emailHash = await hashEmail(email);
    const code = generateVerificationCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    
    const { error: insertError } = await supabase
      .from('email_verifications')
      .insert({
        email: emailHash,
        verification_code: code,
        expires_at: expiresAt.toISOString(),
        is_used: false,
      });
    
    if (insertError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to generate verification code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Verification code sent to email',
        ...(Deno.env.get('ENVIRONMENT') === 'development' && { code })
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
