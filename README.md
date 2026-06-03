# 🔥 Spark Dating App

A full-stack Tinder-like dating app MVP with mobile app, backend API, and admin dashboard.

## 📱 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Mobile App** | React Native + Expo (SDK 56) |
| **Backend API** | Node.js + Express.js |
| **Database** | PostgreSQL + Prisma ORM |
| **Real-time Chat** | Socket.IO |
| **Image Storage** | Cloudinary |
| **Authentication** | JWT + Firebase Auth (OTP/Google) |
| **Admin Panel** | Next.js + Tailwind CSS |

## 📂 Project Structure

```
spark-dating-app/
├── mobile/              # React Native Expo mobile app
│   ├── App.js           # Entry point
│   └── src/
│       ├── screens/     # All app screens
│       ├── navigation/  # React Navigation setup
│       ├── context/     # Auth context
│       ├── services/    # API service layer
│       └── components/  # Reusable components
├── backend/             # Node.js Express API
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Auth middleware
│   │   ├── config/      # DB & Cloudinary config
│   │   ├── utils/       # Helper functions
│   │   └── index.js     # Server entry
│   └── prisma/
│       ├── schema.prisma # Database schema
│       └── seed.js       # Sample data
├── admin/               # Next.js admin dashboard
│   ├── app/             # App router pages
│   └── lib/             # API utilities
└── README.md
```

## 🚀 Features

### Mobile App
- ✅ User registration (Name, Age, Gender, Bio, Interests, Location)
- ✅ Login with Phone OTP / Google
- ✅ Profile creation & editing with photo upload
- ✅ Swipe cards (Right = Like, Left = Skip)
- ✅ Mutual like = Match notification
- ✅ Real-time chat with matched users
- ✅ Location-based discovery with distance filter
- ✅ Age & gender preference filters
- ✅ Report & block users
- ✅ Settings & preferences management

### Backend API
- ✅ RESTful API with Express.js
- ✅ JWT authentication
- ✅ PostgreSQL with Prisma ORM
- ✅ Swipe & matching engine
- ✅ Real-time messaging via Socket.IO
- ✅ Photo upload to Cloudinary
- ✅ Distance calculation (Haversine formula)
- ✅ Report/Block system
- ✅ Admin endpoints

### Admin Dashboard
- ✅ Dashboard with stats (users, matches, reports)
- ✅ User management (view, ban/unban, approve profiles)
- ✅ Report moderation (dismiss, resolve, ban user)
- ✅ Responsive design with Tailwind CSS

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Expo CLI (`npm install -g expo-cli`)
- Cloudinary account (for photo uploads)

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL, JWT secret, Cloudinary keys

# Setup database
npx prisma db push       # Create tables
npx prisma generate      # Generate Prisma client
npm run db:seed           # Seed sample data

# Start server
npm run dev               # Runs on http://localhost:5000
```

### 2. Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Update API URL in src/services/api.js
# Change localhost to your machine's IP for physical device testing

# Start Expo
npx expo start

# Scan QR code with Expo Go app (iOS/Android)
```

### 3. Admin Panel Setup

```bash
cd admin

# Install dependencies
npm install

# Start dev server
npm run dev               # Runs on http://localhost:3000
```

## 📡 API Routes

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login/phone` | Login with phone |
| POST | `/api/auth/login/firebase` | Login with Firebase |
| GET | `/api/auth/me` | Get current user |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/profile/update` | Update profile |
| POST | `/api/profile/photo` | Upload photo |
| DELETE | `/api/profile/photo` | Delete photo |
| GET | `/api/profile/:userId` | Get user profile |

### Swipe & Matching
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/swipe/discover` | Get discovery feed |
| POST | `/api/swipe/swipe` | Swipe on user |
| GET | `/api/swipe/matches` | Get all matches |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chat/:matchId/messages` | Get messages |
| POST | `/api/chat/:matchId/messages` | Send message |

### Safety
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/safety/report` | Report user |
| POST | `/api/safety/block` | Block user |
| POST | `/api/safety/unblock` | Unblock user |
| GET | `/api/safety/blocked` | Get blocked list |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard stats |
| GET | `/api/admin/users` | List users |
| PUT | `/api/admin/users/:id/ban` | Ban/unban user |
| PUT | `/api/admin/users/:id/approve` | Approve profile |
| GET | `/api/admin/reports` | List reports |
| PUT | `/api/admin/reports/:id/resolve` | Resolve report |

## 🗄️ Database Schema

Key models:
- **User** - Profile data, preferences, verification status
- **Swipe** - Track left/right swipes between users
- **Match** - Mutual likes (created automatically)
- **Message** - Chat messages within matches
- **Report** - User reports for moderation
- **Block** - Blocked user relationships

## 🚀 Deployment Guide

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repo to Railway/Render
3. Add environment variables
4. Deploy — auto-detects Node.js
5. Run `npx prisma db push` after deploy

### Mobile (Expo/EAS Build)
```bash
# Install EAS CLI
npm install -g eas-cli

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios

# Submit to stores
eas submit
```

### Admin Panel (Vercel)
1. Connect GitHub repo to Vercel
2. Set root directory to `admin/`
3. Add `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

## 🔐 Test Credentials

After running seed:
- **Regular users**: +919876543210 through +919876543217
- **Admin user**: +919999999999

## 📋 Future Enhancements (Post-MVP)
- Video intro profiles (30-sec mandatory)
- Voice note messages
- AI-powered matching
- In-app video calling (WebRTC)
- Push notifications
- Multi-language support (Hindi, Tamil, Telugu)
- Payment gateway (Razorpay) for premium
- Location auto-detection with GPS
- Profile verification with Aadhaar/ID

## 📄 License

MIT License - Free to use and modify.
