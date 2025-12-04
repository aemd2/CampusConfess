# CampusConfess 🎓

**Anonymous, safe, campus-exclusive confession app for college students**

[![Platform](https://img.shields.io/badge/platform-iOS-lightgrey.svg)](https://www.apple.com/ios)
[![Framework](https://img.shields.io/badge/framework-React%20Native-blue.svg)](https://reactnative.dev/)
[![Backend](https://img.shields.io/badge/backend-Supabase-green.svg)](https://supabase.com)

---

## 🚀 What Is CampusConfess?

CampusConfess is a geo-fenced anonymous confession app designed specifically for college campuses. Think "YikYak meets Instagram confessions" - but safer, campus-specific, and legally compliant.

### Key Features

- ✅ **Campus-Only Access**: Verified .edu email required
- 🙈 **True Anonymity**: Posts can't be traced back to you
- 👮 **AI + Student Moderation**: 3-tier safety system
- 💬 **Engage Freely**: React, comment, report anonymously
- 💰 **Optional Boosts**: Pin posts for visibility ($0.99-$2.99)
- 📱 **iOS First**: Android coming in Phase 2

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)** | 5-minute summary of the entire project |
| **[docs/TECH_STACK.md](docs/TECH_STACK.md)** | Every library, service, and tool we're using |
| **[docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)** | Backend API reference for developers |
| **[docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)** | Step-by-step iOS App Store launch guide |
| **[docs/MODERATOR_GUIDELINES.md](docs/MODERATOR_GUIDELINES.md)** | Training guide for student moderators |

---

## 🛠️ Tech Stack

### Frontend
- **React Native** + **Expo** (SDK 54+)
- **TypeScript** for type safety
- **NativeBase v3+** for UI components
- **Zustand** for state management
- **React Query** for server state

### Backend
- **Supabase** (PostgreSQL + Auth + Storage + Real-time)
- **Supabase Edge Functions** (Deno-based serverless)
- **Row Level Security** (RLS) for data protection

### External Services
- **Stripe** for payments (boosted posts, moderator payouts)
- **AI Moderation** (keyword-based MVP)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **Expo CLI**: `npm install -g expo-cli`
- **iOS Simulator** (Mac) or **Expo Go** app (iPhone)
- **Supabase Account** ([Sign up free](https://supabase.com))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/aemd2/CampusConfess.git
cd CampusConfess/campusconfess

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env.local

# 4. Edit .env.local with your Supabase keys

# 5. Start the app
npm start
```

### Environment Setup

Create `.env.local` inside the `campusconfess/` directory:

```bash
# Supabase (get from https://supabase.com/dashboard)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe (get from https://dashboard.stripe.com)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## 📁 Project Structure

```
CampusConfess/
├── docs/                         # Documentation
│   ├── PROJECT_OVERVIEW.md
│   ├── TECH_STACK.md
│   └── ...
│
├── campusconfess/                # React Native App (Expo)
│   ├── app/                      # Expo Router screens
│   │   ├── (auth)/               # Authentication flow
│   │   └── (tabs)/               # Main app
│   ├── components/               # Reusable UI components
│   ├── constants/                # Design tokens
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Core logic
│   ├── types/                    # TypeScript types
│   └── supabase/                 # Edge Functions
│
├── README.md                     # This file
├── PRIVACY_POLICY.md
└── TERMS_OF_SERVICE.md
```

---

## 🔐 Security & Privacy

- **SHA-256 hashed email** (NOT plain text)
- **Row Level Security (RLS)** for database protection
- **No PII in posts** (truly anonymous)
- **EXIF stripping** on images
- **GDPR & CCPA compliant**

---

## 📜 License

MIT License - See [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for college students by college students**

*Making campus confession pages safer, legal, and more sustainable.*

---

**Last Updated**: December 4, 2025  
**Version**: 1.0 (MVP)  
**Repository**: https://github.com/aemd2/CampusConfess
