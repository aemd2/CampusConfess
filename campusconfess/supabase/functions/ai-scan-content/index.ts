/**
 * AI Content Scan Edge Function
 * 
 * PURPOSE:
 * - Scans post/comment content for policy violations
 * - Keyword-based filtering (Phase 1)
 * - Detects banned words, PII, self-harm indicators
 * - Returns moderation recommendation
 * 
 * ENDPOINT: POST /functions/v1/ai-scan-content
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BANNED_KEYWORDS = {
  violence: ['kill', 'murder', 'stab', 'shoot', 'gun', 'weapon', 'bomb', 'attack', 'assault', 'death threat'],
  hate_speech: ['racist', 'racism', 'nazi', 'hitler', 'supremacist', 'genocide', 'bigot'],
  self_harm: ['suicide', 'suicidal', 'kill myself', 'end my life', 'want to die', 'cutting', 'self harm'],
  explicit: ['porn', 'pornography', 'nude', 'nudes', 'naked', 'rape', 'molest'],
  harassment: ['doxx', 'dox', 'leak address', 'stalk', 'stalker', 'cyberbully', 'harass'],
};

const PII_PATTERNS = {
  phone: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
};

function scanForBannedKeywords(text: string) {
  const normalizedText = text.toLowerCase();
  const allMatches: { word: string; category: string }[] = [];
  
  for (const [category, keywords] of Object.entries(BANNED_KEYWORDS)) {
    for (const keyword of keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        allMatches.push({ word: keyword, category });
      }
    }
  }
  
  const matchCount = allMatches.length;
  const confidence = Math.min(matchCount / 3, 1);
  
  const categoryCount: Record<string, number> = {};
  allMatches.forEach(({ category }) => {
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  
  const primaryCategory = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'unknown';
  
  return { flagged: allMatches.length > 0, matches: allMatches.map(m => m.word), category: primaryCategory, confidence, matchCount };
}

function scanForPII(text: string) {
  const foundTypes: string[] = [];
  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    if (pattern.test(text)) foundTypes.push(type);
  }
  return { hasPII: foundTypes.length > 0, types: foundTypes };
}

function getModerationRecommendation(keywordScan: ReturnType<typeof scanForBannedKeywords>, piiScan: ReturnType<typeof scanForPII>) {
  if (piiScan.hasPII) return { status: 'rejected' as const, reason: 'Contains personal information', confidence: 1.0 };
  if (keywordScan.category === 'self_harm' && keywordScan.flagged) return { status: 'flagged' as const, reason: 'Self-harm content detected', confidence: keywordScan.confidence };
  if (keywordScan.confidence >= 0.9) return { status: 'rejected' as const, reason: `High confidence violation (${keywordScan.category})`, confidence: keywordScan.confidence };
  if (keywordScan.confidence >= 0.3) return { status: 'review' as const, reason: `Requires human review (${keywordScan.category})`, confidence: keywordScan.confidence };
  return { status: 'approved' as const, reason: 'No violations detected', confidence: 1.0 - keywordScan.confidence };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { content, type } = await req.json();
    
    if (!content || typeof content !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const maxLength = type === 'comment' ? 500 : 1000;
    if (content.length > maxLength) {
      return new Response(
        JSON.stringify({ success: false, error: `Content exceeds ${maxLength} characters` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const keywordScan = scanForBannedKeywords(content);
    const piiScan = scanForPII(content);
    const recommendation = getModerationRecommendation(keywordScan, piiScan);
    
    return new Response(
      JSON.stringify({ 
        success: true,
        result: {
          status: recommendation.status,
          reason: recommendation.reason,
          confidence: recommendation.confidence,
          details: {
            keywords_found: keywordScan.matches,
            category: keywordScan.category,
            has_pii: piiScan.hasPII,
          }
        }
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
