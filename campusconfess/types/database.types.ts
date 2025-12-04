/**
 * Database Type Definitions
 * 
 * This file contains TypeScript types for all database tables.
 * These types ensure type safety when working with Supabase queries.
 * 
 * IMPORTANT:
 * - Update these types whenever the database schema changes
 * - Can be auto-generated using: npx supabase gen types typescript
 */

// ===========================
// Campus Types
// ===========================

export interface Campus {
  id: string;
  name: string;
  domain: string; // e.g., "nyu.edu"
  location_coordinates: {
    latitude: number;
    longitude: number;
  };
  radius_meters: number;
  is_active: boolean;
  created_at: string;
}

// ===========================
// User Types
// ===========================

export interface User {
  id: string; // Matches auth.users.id
  campus_id: string;
  email: string; // .edu email (hashed)
  email_verified: boolean;
  role: 'student' | 'moderator' | 'admin';
  is_banned: boolean;
  joined_at: string;
  last_active_at: string;
}

// ===========================
// Post Types
// ===========================

export interface Post {
  id: string;
  campus_id: string;
  author_id: string; // Anonymous to other users
  content: string;
  image_url?: string;
  location_tag?: string; // e.g., "Library", "Cafeteria"
  is_boosted: boolean;
  boost_expires_at?: string;
  ai_scan_status: 'pending' | 'approved' | 'rejected';
  ai_scan_confidence?: number;
  moderation_status: 'pending' | 'approved' | 'rejected';
  moderator_id?: string;
  moderated_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface PostWithStats extends Post {
  reaction_count: number;
  comment_count: number;
  report_count: number;
}

// ===========================
// Reaction Types
// ===========================

export type ReactionType = 'heart' | 'laugh' | 'shocked' | 'sad' | 'angry';

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

// ===========================
// Comment Types
// ===========================

export interface Comment {
  id: string;
  post_id: string;
  author_id: string; // Anonymous
  parent_comment_id?: string; // For nested replies
  content: string;
  ai_scan_status: 'pending' | 'approved' | 'rejected';
  moderation_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at?: string;
}

export interface CommentWithReplies extends Comment {
  replies: Comment[];
  reply_count: number;
}

// ===========================
// Report Types
// ===========================

export type ReportReason =
  | 'harassment'
  | 'hate_speech'
  | 'violence'
  | 'sexual_content'
  | 'spam'
  | 'self_harm'
  | 'other';

export interface Report {
  id: string;
  post_id?: string;
  comment_id?: string;
  reporter_id: string; // Anonymous
  reason: ReportReason;
  description?: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  moderator_id?: string;
  resolution_note?: string;
  created_at: string;
  resolved_at?: string;
}

// ===========================
// Moderation Types
// ===========================

export interface ModeratorAction {
  id: string;
  moderator_id: string;
  post_id?: string;
  comment_id?: string;
  action: 'approve' | 'reject' | 'delete' | 'ban_user';
  reason?: string;
  created_at: string;
}

export interface ModeratorEarnings {
  id: string;
  moderator_id: string;
  month: string; // YYYY-MM format
  posts_moderated: number;
  amount_cents: number; // Payment amount in cents
  payment_status: 'pending' | 'processing' | 'paid' | 'failed';
  stripe_payout_id?: string;
  paid_at?: string;
  created_at: string;
}

// ===========================
// Campus Verification Types
// ===========================

export interface EmailVerification {
  id: string;
  email: string; // .edu email (hashed)
  verification_code: string; // 6-digit code
  expires_at: string;
  is_used: boolean;
  created_at: string;
}

// ===========================
// Analytics Types
// ===========================

export interface DailyStats {
  id: string;
  campus_id: string;
  date: string; // YYYY-MM-DD
  total_posts: number;
  total_comments: number;
  total_reactions: number;
  active_users: number;
  created_at: string;
}

// ===========================
// API Response Types
// ===========================

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  per_page: number;
  total: number;
  has_more: boolean;
}

// ===========================
// Form Types (Frontend)
// ===========================

export interface CreatePostInput {
  content: string;
  campus_id: string;
  location_tag?: string;
  image_file?: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface CreateCommentInput {
  post_id: string;
  content: string;
  parent_comment_id?: string;
}

export interface CreateReportInput {
  post_id?: string;
  comment_id?: string;
  reason: ReportReason;
  description?: string;
}

export interface CampusVerificationInput {
  email: string; // .edu email
  campus_id: string;
}

export interface VerifyCodeInput {
  email: string;
  code: string;
}

// ===========================
// Auth Types
// ===========================

export interface AuthSession {
  user_id: string;
  campus_id: string;
  email: string;
  role: 'student' | 'moderator' | 'admin';
  is_moderator: boolean;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

// ===========================
// Utility Types
// ===========================

export type DatabaseTable =
  | 'campuses'
  | 'users'
  | 'posts'
  | 'reactions'
  | 'comments'
  | 'reports'
  | 'moderator_actions'
  | 'moderator_earnings'
  | 'email_verifications'
  | 'daily_stats';

export type ModerationStatus = 'pending' | 'approved' | 'rejected';
export type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed';
export type UserRole = 'student' | 'moderator' | 'admin';
