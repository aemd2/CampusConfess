/**
 * CampusConfess App Configuration
 * 
 * Feature flags, limits, and app-wide constants
 */

export const Config = {
  // App Info
  app: {
    name: 'CampusConfess',
    version: '1.0.0',
    environment: process.env.EXPO_PUBLIC_ENV || 'development',
  },

  // Content Limits
  content: {
    maxPostLength: 1000,        // Characters
    maxCommentLength: 500,      // Characters
    maxImageSize: 5,            // MB
    maxVideoSize: 20,           // MB (future feature)
  },

  // Rate Limits
  rateLimit: {
    maxPostsPerDay: 10,
    maxCommentsPerDay: 50,
    maxReportsPerDay: 20,
    maxReactionsPerMinute: 30,
  },

  // Feature Flags
  features: {
    enableBoostPosts: true,
    enableCampusAlerts: true,
    enableComments: true,
    enableReactions: true,
    enableReports: true,
    enablePushNotifications: true,
    enableImageUpload: true,
    enableVideoUpload: false,     // Phase 2
    enablePolls: false,           // Phase 2
    enableDirectMessages: false,  // Phase 3
  },

  // Moderation Settings
  moderation: {
    autoHideAfterReports: 5,      // Auto-hide post after N reports
    moderatorConsensusRequired: 3, // Mods needed to delete post
    strikeLimit: 3,                // Ban after N strikes
    bannedDuration: 7,             // Days (for temporary bans)
  },

  // Payment Settings
  payment: {
    boostTopFeedPrice: 0.99,      // USD
    boostCampusAlertPrice: 2.99,  // USD
    moderatorPayoutPerAction: 0.25, // USD
    minimumPayoutAmount: 5.00,    // USD
  },

  // UI Settings
  ui: {
    postsPerPage: 20,
    autoRefreshInterval: 30000,   // ms (30 seconds)
    toastDuration: 3000,          // ms (3 seconds)
    modalAnimationDuration: 300,  // ms
  },

  // Links
  links: {
    privacyPolicy: 'https://campusconfess.com/privacy',
    termsOfService: 'https://campusconfess.com/terms',
    support: 'mailto:support@campusconfess.com',
    moderatorHelp: 'mailto:mods@campusconfess.com',
  },

  // Crisis Resources (shown on mental health posts)
  crisisResources: [
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '988',
      url: 'https://988lifeline.org',
    },
    {
      name: 'Crisis Text Line',
      phone: '741741',
      text: 'Text HOME to 741741',
    },
  ],
} as const;

// Type-safe config access
export type AppConfig = typeof Config;
