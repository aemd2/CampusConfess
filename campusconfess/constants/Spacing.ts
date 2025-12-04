/**
 * CampusConfess Spacing System
 * 
 * CRITICAL RULES:
 * - Use these tokens for margins, padding, gaps
 * - Based on 4px grid system (multiples of 4)
 * - Ensures consistent spacing throughout app
 * 
 * Usage:
 * ✅ <Box p={Spacing.md} m={Spacing.sm}>Content</Box>
 * ✅ <VStack space={Spacing.md}>Items</VStack>
 * ❌ <Box p={16} m={8}>Content</Box>
 */

export const Spacing = {
  // Base Spacing Scale (4px grid)
  xs: 4,      // 4px  - Tiny gaps, icon spacing
  sm: 8,      // 8px  - Small spacing between elements
  md: 16,     // 16px - Default spacing (most common)
  lg: 24,     // 24px - Large spacing between sections
  xl: 32,     // 32px - Extra large spacing
  '2xl': 48,  // 48px - Major section spacing
  '3xl': 64,  // 64px - Screen-level spacing

  // Border Radius
  radius: {
    none: 0,
    sm: 4,      // Small elements (badges, tags)
    md: 8,      // Cards, inputs, buttons
    lg: 12,     // Large cards
    xl: 16,     // Modals, sheets
    full: 9999, // Pills, avatars (fully rounded)
  },

  // Shadows (Elevation)
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',       // Subtle depth
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',     // Cards
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',   // Elevated cards
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',   // Modals, dropdowns
  },

  // Screen Safe Area Padding
  screen: {
    horizontal: 16, // Left/right padding
    vertical: 16,   // Top/bottom padding (below header)
    top: 8,         // Minimal top spacing
    bottom: 24,     // Bottom spacing (above tab bar)
  },

  // Component-Specific Spacing
  card: {
    padding: 16,        // Internal padding
    gap: 12,            // Gap between elements inside card
    borderRadius: 8,    // Corner radius
    marginBottom: 12,   // Space between cards in feed
  },

  button: {
    paddingX: 24,       // Horizontal padding
    paddingY: 12,       // Vertical padding
    borderRadius: 8,    // Corner radius
    gap: 8,             // Space between icon and text
  },

  input: {
    paddingX: 16,       // Horizontal padding
    paddingY: 12,       // Vertical padding
    borderRadius: 8,    // Corner radius
    gap: 8,             // Space between label and input
  },

  modal: {
    padding: 24,        // Internal padding
    borderRadius: 16,   // Corner radius
    gap: 16,            // Space between modal sections
  },

  header: {
    height: 56,         // Header/navbar height
    paddingX: 16,       // Horizontal padding
    paddingY: 8,        // Vertical padding
  },

  tabBar: {
    height: 64,         // Bottom tab bar height
    paddingY: 8,        // Vertical padding
  },

  list: {
    gap: 12,            // Space between list items
    padding: 16,        // List container padding
  },

  grid: {
    gap: 16,            // Space between grid items
    padding: 16,        // Grid container padding
  },
} as const;

/**
 * Helper function to create consistent spacing values
 */
export const createSpacing = (multiplier: number) => Spacing.xs * multiplier;

/**
 * Common spacing patterns (shortcuts)
 */
export const SpacingPatterns = {
  // Vertical Stack (common gap patterns)
  stack: {
    tight: Spacing.xs,    // 4px  - Compact lists
    normal: Spacing.sm,   // 8px  - Default spacing
    relaxed: Spacing.md,  // 16px - Comfortable spacing
    loose: Spacing.lg,    // 24px - Spacious layout
  },

  // Sections (spacing between major sections)
  section: {
    small: Spacing.lg,    // 24px
    medium: Spacing.xl,   // 32px
    large: Spacing['2xl'], // 48px
  },

  // Inline spacing (horizontal gaps)
  inline: {
    tight: Spacing.xs,    // 4px
    normal: Spacing.sm,   // 8px
    relaxed: Spacing.md,  // 16px
  },
} as const;

// Type-safe spacing access
export type SpacingSystem = typeof Spacing;
