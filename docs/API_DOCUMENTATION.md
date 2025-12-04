# CampusConfess - API Documentation
**Backend API Reference**

---

## Base URL

```
Production: https://your-project.supabase.co
```

## Authentication

All authenticated requests require JWT token:

```bash
Authorization: Bearer <JWT_TOKEN>
```

---

## Endpoints

### 1. Campus Management

#### Get All Campuses
```
GET /rest/v1/campuses?verified=eq.true
```

### 2. Authentication

#### Send Verification Email
```
POST /functions/v1/verify-campus-email

Body:
{
  "email": "student@stanford.edu",
  "campusId": "uuid"
}
```

#### Confirm Verification
```
POST /functions/v1/confirm-verification

Body:
{
  "emailHash": "sha256-hash",
  "code": "123456"
}
```

### 3. Posts

#### Get Campus Feed
```
GET /rest/v1/posts?campus_id=eq.<id>&ai_scan_status=eq.approved
```

#### Create Post
```
POST /rest/v1/posts

Body:
{
  "campus_id": "uuid",
  "content": "My confession...",
  "location_tag": "Library"
}
```

### 4. Reactions

#### Add Reaction
```
POST /rest/v1/reactions

Body:
{
  "post_id": "uuid",
  "reaction_type": "heart"
}
```

### 5. Reports

#### Create Report
```
POST /rest/v1/reports

Body:
{
  "post_id": "uuid",
  "reason": "harassment",
  "details": "Description"
}
```

### 6. AI Scan

#### Scan Content
```
POST /functions/v1/ai-scan-content

Body:
{
  "content": "Text to scan",
  "type": "post"
}
```

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Verify Email | 3/5min |
| Create Post | 10/day |
| Create Comment | 50/day |

---

## Error Codes

| Code | HTTP | Meaning |
|------|------|---------|  
| INVALID_EMAIL | 400 | Bad email |
| RATE_LIMIT | 429 | Too many requests |
| USER_BANNED | 403 | Account banned |
