/**
 * CampusConfess Color System
 * 
 * CRITICAL RULES:
 * - NEVER hardcode hex colors in components
 * - ALWAYS reference Colors.* tokens
 * - Dark mode support built-in
 * 
 * Usage:
 * ✅ <Text color={Colors.text.primary}>Hello</Text>
 * ❌ <Text color="#F8FAFC">Hello</Text>
 */

export const Colors = {
  // Primary Brand Colors
  primary: {
    main: '#6366F1',        // Indigo-500 (primary CTA, links)
    light: '#818CF8',       // Indigo-400 (hover states)
    dark: '#4F46E5',        // Indigo-600 (pressed states)
    contrast: '#FFFFFF',    // Text on primary background
  },

  // Secondary Colors
  secondary: {
    main: '#EC4899',        // Pink-500 (boosted posts, highlights)
    light: '#F472B6',       // Pink-400
    dark: '#DB2777',        // Pink-600
    contrast: '#FFFFFF',
  },

  // Background Colors
  background: {
    primary: '#0F172A',     // Slate-900 (main app background)
    secondary: '#1E293B',   // Slate-800 (card backgrounds)
    tertiary: '#334155',    // Slate-700 (elevated cards)
    modal: 'rgba(0, 0, 0, 0.8)', // Modal overlay
  },

  // Text Colors
  text: {
    primary: '#F8FAFC',     // Slate-50 (main text)
    secondary: '#CBD5E1',   // Slate-300 (secondary text)
    tertiary: '#94A3B8',    // Slate-400 (muted text)
    disabled: '#64748B',    // Slate-500 (disabled text)
    inverse: '#0F172A',     // Dark text on light backgrounds
  },

  // Card Colors
  card: {
    background: '#1E293B',  // Slate-800
    border: '#334155',      // Slate-700
    hover: '#2D3748',       // Slightly lighter on hover
  },

  // Semantic Colors
  success: {
    main: '#10B981',        // Green-500 (approved, success)
    light: '#34D399',       // Green-400
    dark: '#059669',        // Green-600
    background: 'rgba(16, 185, 129, 0.1)', // Translucent
  },

  error: {
    main: '#EF4444',        // Red-500 (errors, delete)
    light: '#F87171',       // Red-400
    dark: '#DC2626',        // Red-600
    background: 'rgba(239, 68, 68, 0.1)',
  },

  warning: {
    main: '#F59E0B',        // Amber-500 (warnings, pending)
    light: '#FBBF24',       // Amber-400
    dark: '#D97706',        // Amber-600
    background: 'rgba(245, 158, 11, 0.1)',
  },

  info: {
    main: '#3B82F6',        // Blue-500 (info, tips)
    light: '#60A5FA',       // Blue-400
    dark: '#2563EB',        // Blue-600
    background: 'rgba(59, 130, 246, 0.1)',
  },

  // Reaction Colors (Emoji reactions)
  reactions: {
    heart: '#EF4444',       // Red (❤️)
    laugh: '#F59E0B',       // Amber (😂)
    shocked: '#8B5CF6',     // Purple (😮)
    sad: '#3B82F6',         // Blue (😢)
    angry: '#DC2626',       // Dark Red (😡)
  },

  // Moderation Colors
  moderation: {
    approved: '#10B981',    // Green
    pending: '#F59E0B',     // Amber
    rejected: '#EF4444',    // Red
    flagged: '#EF4444',     // Red
  },

  // Border Colors
  border: {
    default: '#334155',     // Slate-700
    light: '#475569',       // Slate-600
    focus: '#6366F1',       // Primary color
    error: '#EF4444',       // Error color
  },

  // Special Use Cases
  overlay: 'rgba(0, 0, 0, 0.5)',        // Dimmed backgrounds
  shadow: 'rgba(0, 0, 0, 0.3)',         // Drop shadows
  transparent: 'transparent',
} as const;

// Type-safe color access
export type ColorPalette = typeof Colors;
