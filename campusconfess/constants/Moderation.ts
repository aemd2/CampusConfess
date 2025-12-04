/**
 * Content Moderation Configuration
 * 
 * Keyword-based filtering for AI content scanning.
 * Used by ai-scan-content Edge Function to detect inappropriate content.
 */

export const BANNED_KEYWORDS = {
  violence: [
    'kill', 'murder', 'stab', 'shoot', 'gun', 'weapon', 'bomb', 'explosive',
    'attack', 'assault', 'beat up', 'hurt', 'harm', 'injure', 'torture',
    'death threat', 'shooting', 'massacre', 'slaughter',
  ],

  hate_speech: [
    'racist', 'racism', 'nazi', 'hitler', 'supremacist', 'kkk',
    'genocide', 'ethnic cleansing', 'bigot', 'slur',
  ],

  self_harm: [
    'suicide', 'suicidal', 'kill myself', 'end my life', 'end it all',
    'want to die', 'better off dead', 'cutting', 'self harm',
    'slit my wrists', 'overdose', 'hang myself',
  ],

  explicit: [
    'porn', 'pornography', 'nude', 'nudes', 'naked', 'sex tape',
    'send nudes', 'rape', 'molest', 'pedophile',
  ],

  harassment: [
    'doxx', 'dox', 'leak address', 'leak phone', 'expose',
    'swat', 'stalk', 'stalker', 'cyberbully', 'harass',
  ],

  illegal: [
    'cocaine', 'heroin', 'meth', 'drug dealer', 'sell drugs',
    'fake id', 'stolen', 'theft', 'robbery', 'scam',
  ],
} as const;

export const PII_PATTERNS = {
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  credit_card: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,
  address: /\b\d+\s+[A-Za-z\s]+\s+(Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Drive|Dr)\b/gi,
  dorm_room: /\b(room|rm|dorm)\s*#?\s*\d{3,4}\b/gi,
} as const;

export const MODERATION_THRESHOLDS = {
  AUTO_REJECT_THRESHOLD: 0.9,
  AUTO_APPROVE_THRESHOLD: 0.3,
  HUMAN_REVIEW_MIN: 0.3,
  HUMAN_REVIEW_MAX: 0.9,
  MAX_KEYWORD_MATCHES: 3,
  SELF_HARM_FLAG: true,
} as const;

export function scanForBannedKeywords(text: string) {
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
  const confidence = Math.min(matchCount / MODERATION_THRESHOLDS.MAX_KEYWORD_MATCHES, 1);
  
  const categoryCount: Record<string, number> = {};
  allMatches.forEach(({ category }) => {
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  
  const primaryCategory = Object.entries(categoryCount)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'unknown';
  
  return {
    flagged: allMatches.length > 0,
    matches: allMatches.map(m => m.word),
    category: primaryCategory,
    confidence,
    matchCount,
  };
}

export function scanForPII(text: string) {
  const foundTypes: string[] = [];
  
  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    if (pattern.test(text)) {
      foundTypes.push(type);
    }
  }
  
  return {
    hasPII: foundTypes.length > 0,
    types: foundTypes,
  };
}

export const CRISIS_RESOURCES = {
  suicide_hotline: {
    name: 'National Suicide Prevention Lifeline',
    phone: '988',
    website: 'https://988lifeline.org/',
  },
  crisis_text: {
    name: 'Crisis Text Line',
    text: 'Text HOME to 741741',
    website: 'https://www.crisistextline.org/',
  },
  trevor: {
    name: 'The Trevor Project',
    phone: '1-866-488-7386',
    website: 'https://www.thetrevorproject.org/',
  },
} as const;
