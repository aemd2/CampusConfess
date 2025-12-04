# CampusConfess - Deployment Guide
**iOS App Store Launch**

---

## Pre-Deployment Checklist

### Legal
- [ ] Privacy Policy published
- [ ] Terms of Service finalized
- [ ] University agreements signed

### Technical
- [ ] All features tested
- [ ] No critical bugs
- [ ] Database migrations run
- [ ] Edge Functions deployed

### Content
- [ ] App Store screenshots
- [ ] App icon (1024x1024)
- [ ] App description written

---

## Supabase Setup

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref YOUR_REF

# Deploy migrations
supabase db push

# Deploy Edge Functions
supabase functions deploy ai-scan-content
supabase functions deploy verify-campus-email
```

---

## iOS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios --latest
```

---

## TestFlight

1. Go to App Store Connect
2. Add internal testers
3. Create TestFlight groups:
   - Stanford Testers (50 users)
   - MIT Testers (50 users)
   - Moderators (15 users)

---

## App Store Submission

### Screenshots Needed
- 6.5" Display: 1290 x 2796 px
- 5.5" Display: 1242 x 2208 px

### App Info
- Category: Social Networking
- Age Rating: 17+
- Content Rights: Yes

---

## Post-Launch

### Monitor
- Crash rate (< 1%)
- Daily active users
- Moderation queue

### Alerts
- Sentry: Crash > 10 users
- Database CPU > 80%
