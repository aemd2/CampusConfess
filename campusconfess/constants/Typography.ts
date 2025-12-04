/**
 * CampusConfess Typography System
 * 
 * CRITICAL RULES:
 * - Use these tokens for ALL text styling
 * - Don't hardcode font sizes or weights
 * - Ensures consistent typography across app
 * 
 * Usage:
 * ✅ <Text {...TextStyles.h1}>Title</Text>
 * ✅ <Text fontSize={Typography.sizes.base}>Body</Text>
 * ❌ <Text fontSize={30} fontWeight="bold">Title</Text>
 */

export const Typography = {
  // Font Families
  fonts: {
    body: 'Inter, system-ui, sans-serif',    // Main text font
    heading: 'Inter, system-ui, sans-serif', // Headings (same as body for consistency)
    mono: 'Menlo, Monaco, Consolas, monospace', // Code/IDs
  },

  // Font Sizes (in pixels)
  sizes: {
    xs: 12,      // Small labels, captions
    sm: 14,      // Secondary text, metadata
    base: 16,    // Body text (default)
    lg: 18,      // Emphasized text
    xl: 20,      // Section titles
    '2xl': 24,   // Screen titles
    '3xl': 30,   // Large headings
    '4xl': 36,   // Hero text
  },

  // Font Weights
  weights: {
    regular: '400',    // Normal text
    medium: '500',     // Slightly emphasized
    semibold: '600',   // Button text, titles
    bold: '700',       // Strong emphasis
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,    // Headings
    normal: 1.5,   // Body text
    relaxed: 1.75, // Comfortable reading
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,   // Tight headings
    normal: 0,     // Body text
    wide: 0.5,     // Buttons, labels
  },
} as const;

/**
 * Pre-composed Text Styles
 * Use these for common text patterns
 */
export const TextStyles = {
  // Headings
  h1: {
    fontSize: Typography.sizes['3xl'],
    fontWeight: Typography.weights.bold,
    lineHeight: Typography.lineHeights.tight,
    letterSpacing: Typography.letterSpacing.tight,
  },
  
  h2: {
    fontSize: Typography.sizes['2xl'],
    fontWeight: Typography.weights.bold,
    lineHeight: Typography.lineHeights.tight,
  },
  
  h3: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.semibold,
    lineHeight: Typography.lineHeights.tight,
  },
  
  h4: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    lineHeight: Typography.lineHeights.normal,
  },

  // Body Text
  body: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.regular,
    lineHeight: Typography.lineHeights.normal,
  },
  
  bodySmall: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.regular,
    lineHeight: Typography.lineHeights.normal,
  },
  
  bodyLarge: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.regular,
    lineHeight: Typography.lineHeights.relaxed,
  },

  // Labels & Captions
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    letterSpacing: Typography.letterSpacing.wide,
  },
  
  caption: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.regular,
    lineHeight: Typography.lineHeights.normal,
  },

  // Interactive Elements
  button: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semibold,
    letterSpacing: Typography.letterSpacing.wide,
  },
  
  link: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.medium,
    textDecorationLine: 'underline',
  },

  // Special Cases
  timestamp: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.regular,
    fontFamily: Typography.fonts.mono,
  },
} as const;

// Type-safe typography access
export type TypographySystem = typeof Typography;
export type TextStyleVariants = typeof TextStyles;
