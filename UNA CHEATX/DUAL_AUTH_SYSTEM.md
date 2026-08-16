# 🔐 Two Authentication Systems - Implementation Guide

## Overview

Your OG REDEGIT AKRO application has **two separate authentication systems** that work independently:

### 1. **Supabase Auth (Existing)**
- Used by: `/login`, `/admin`, `/` (index)
- Provider: Supabase
- Uses: `useAuth()` from `@/hooks/useAuth`
- Provides: `user`, `session`, `isAdmin`, `loading`, `signOut`
- Storage: Supabase database + user_roles table
- Root Layout: Uses `AuthProvider` from `@/hooks/useAuth`

### 2. **JWT Auth System (New)**
- Used by: `/signup`, `/login-jwt`, `/verify-email`, `/forgot-password`, `/reset-password`, `/dashboard`
- Provider: Node.js Express + MongoDB
- Uses: `useAuth as useJWTAuth` from `@/hooks/useAuthContext`
- Provides: `user`, `token`, `login`, `logout`, `signup`, `verifyEmail`, etc.
- Storage: MongoDB + HTTP-only cookies + localStorage
- Root Layout: Wraps with `AuthProvider` from `@/context/AuthContext` (kept separate)

---

## ✅ Why Two Systems?

1. **Existing App**: Uses Supabase for authentication
2. **New Auth System**: You requested a complete JWT-based system with email verification, password reset, Google OAuth, and MongoDB
3. **Compatibility**: Both systems are kept separate to avoid conflicts

---

## 📍 Routes Using Each System

### Supabase Auth Routes
```
/login              - Original Supabase login
/admin              - Admin panel (Supabase auth required)
/                   - Home page (uses Supabase auth)
/auth/callback      - Supabase OAuth callback
```

### JWT Auth Routes
```
/signup             - Register with JWT auth
/verify-email       - Verify email (24-hour token)
/forgot-password    - Request password reset
/reset-password     - Complete password reset
/dashboard          - Protected JWT dashboard
```

---

## 🛠️ How to Use Each System

### For Supabase Auth
```jsx
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, isAdmin, signOut } = useAuth()
  return <>{user?.email}</>
}
```

### For JWT Auth
```jsx
import { useAuth as useJWTAuth } from '@/hooks/useAuthContext'

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useJWTAuth()
  return <>{user?.email}</>
}
```

---

## 🔄 Integrating Both Systems (Optional)

If you want to use **only** the JWT auth system and **replace** Supabase:

### Step 1: Update Root Layout
```jsx
// src/routes/__root.tsx
import { AuthProvider } from '@/context/AuthContext'

function RootComponent() {
  return (
    <AuthProvider>
      {/* Your routes */}
    </AuthProvider>
  )
}
```

### Step 2: Update Existing Pages
Replace Supabase calls with JWT calls:
```jsx
// In index.tsx, admin.tsx, etc.
import { useAuth as useJWTAuth } from '@/hooks/useAuthContext'

const { user, isAuthenticated } = useJWTAuth()
```

### Step 3: Consolidate Login
Create single login that works with JWT:
```jsx
// Replace /login with JWT-based login
const { login } = useJWTAuth()
await login(email, password)
```

---

## 📋 Current Setup (Recommended for Now)

The two systems are **kept completely separate**:

✅ **Old System (Supabase)** → Handles existing pages
✅ **New System (JWT)** → Handles new auth pages
✅ **No Conflicts** → Each system has its own hook and provider
✅ **Backward Compatible** → Existing code keeps working

---

## 🚀 Next Steps

### Option A: Keep Both (Current Setup)
- No changes needed
- Use `/login` for Supabase authentication
- Use `/signup` for JWT authentication
- Users can choose either method

### Option B: Migrate to JWT Only
- Update all pages to use JWT auth
- Update root layout to use `AuthProvider` from `AuthContext`
- Delete Supabase imports from pages
- Keep Supabase for database if needed

### Option C: Keep Both for Different User Types
- Admin users → Use Supabase (`/login`)
- Regular users → Use JWT (`/signup`)
- Hybrid authentication approach

---

## 🔐 Security Comparison

| Feature | Supabase | JWT |
|---------|----------|-----|
| **Password Hashing** | Supabase handles | Bcrypt 10 rounds |
| **Token Storage** | Session state | HTTP-only cookies |
| **Email Verification** | Built-in | 24-hour tokens |
| **Password Reset** | Built-in | 1-hour tokens |
| **Rate Limiting** | IP-based | Per endpoint |
| **OAuth** | Multi-provider | Google only |
| **Admin Management** | user_roles table | role field in User |

---

## 📦 Dependencies

### For JWT System
```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.0",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.1.2",
  "nodemailer": "^6.9.7",
  "passport-google-oauth20": "^2.0.0"
}
```

### Already Installed (Supabase)
```json
{
  "@supabase/supabase-js": "^2.x.x"
}
```

---

## 🔧 Troubleshooting

### "useAuth is not defined"
- Check which hook you're importing
- Use `useAuth` for Supabase pages
- Use `useAuth as useJWTAuth` for JWT pages

### "Provider not found"
- Check root layout has correct provider
- Supabase pages need old `AuthProvider`
- JWT pages need new `AuthProvider` from `AuthContext`

### "Token invalid"
- Supabase: Check Supabase dashboard
- JWT: Check backend is running on port 5000

### "Database connection failed"
- Supabase system: Check Supabase project status
- JWT system: Check MongoDB connection string

---

## 📚 File Reference

### Authentication Files
```
src/
├── context/AuthContext.jsx          ← JWT Auth Context
├── hooks/
│   ├── useAuth.tsx                  ← Supabase Auth Hook
│   └── useAuthContext.js            ← JWT Auth Hook
└── routes/
    ├── login.tsx                    ← Supabase Login
    ├── signup.tsx                   ← JWT Signup
    ├── verify-email.tsx             ← JWT Email Verification
    ├── forgot-password.tsx          ← JWT Password Reset
    ├── reset-password.tsx           ← JWT Password Form
    └── __root.tsx                   ← Root Layout (Supabase Provider)
```

---

## 🎯 Recommended Usage

**For Production:**
1. Choose ONE authentication system
2. Remove the other to reduce complexity
3. Use JWT if you want complete control
4. Use Supabase if you want managed service

**For Development:**
- Keep both for flexibility
- Test both authentication flows
- Decide which to use for production

---

**Questions?** Check the AUTH_SETUP_GUIDE.md for detailed JWT setup instructions.
