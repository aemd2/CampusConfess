# CampusConfess - Technical Documentation
**Version:** 1.0  
**Last Updated:** December 1, 2025

---

## Overview

An anonymous, geo-fenced confession app for college campuses.

### Tech Stack
- **Frontend**: React Native (Expo) + TypeScript
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **UI Library**: NativeBase v3+
- **Payment**: Stripe
- **AI Moderation**: Keyword-based (Hive API later)

---

## Architecture

```
Mobile App (Expo/RN)
    |
    v
Supabase
- Auth (Email verification)
- Database (PostgreSQL + RLS)
- Storage (Images)
- Edge Functions
    |
    v
External Services
- Stripe (Payments)
- Hive AI (Moderation)
```

---

## Database Schema

### Core Tables
- **campuses**: University information
- **users**: Minimal user data (hashed email, campus ID)
- **posts**: Anonymous confessions
- **reactions**: Emoji reactions
- **comments**: Nested comments
- **reports**: User-submitted reports
- **moderator_actions**: Audit log

---

## API Endpoints

### Authentication
- `POST /functions/v1/verify-campus-email` - Send verification code
- `POST /functions/v1/confirm-verification` - Verify code

### Posts
- `GET /rest/v1/posts` - Get campus feed
- `POST /rest/v1/posts` - Create post

### Moderation
- `POST /functions/v1/ai-scan-content` - Scan content

---

## Security

- SHA-256 hashed emails
- Row Level Security (RLS) on all tables
- JWT authentication
- EXIF stripping on images

---

See full documentation in `docs/` folder.
