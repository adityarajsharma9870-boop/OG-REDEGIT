# Complete Authentication System Implementation Guide

## 📁 Project Structure

```
OG REDEGIT AKRO/
├── backend/                          # Express.js Server
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                # MongoDB connection
│   │   │   └── env.js               # Environment configuration
│   │   ├── controllers/
│   │   │   └── authController.js    # Auth logic
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT & auth middleware
│   │   │   ├── errorHandler.js      # Global error handling
│   │   │   └── rateLimiter.js       # Rate limiting
│   │   ├── models/
│   │   │   └── User.js              # MongoDB User schema
│   │   ├── routes/
│   │   │   └── auth.js              # Auth endpoints
│   │   ├── utils/
│   │   │   ├── jwt.js               # JWT utilities
│   │   │   ├── mailer.js            # Email sending
│   │   │   └── validators.js        # Input validation
│   │   ├── seeds/
│   │   │   └── seedAdmin.js         # Admin seeding
│   │   └── server.js                # Main server file
│   ├── .env.example                 # Environment template
│   └── package.json
│
└── src/                             # React Frontend
    ├── context/
    │   └── AuthContext.jsx          # Auth state management
    ├── hooks/
    │   └── useAuthContext.js        # Auth hook
    ├── components/
    │   └── ProtectedRoute.jsx       # Route protection
    ├── routes/
    │   ├── signup.tsx               # Signup page
    │   ├── login.tsx                # Login page (updated)
    │   ├── verify-email.tsx         # Email verification
    │   ├── verify-email-sent.tsx    # Verification sent page
    │   ├── forgot-password.tsx      # Password reset request
    │   ├── reset-password.tsx       # Password reset form
    │   ├── dashboard.tsx            # Protected dashboard
    │   └── __root.tsx               # Root layout (updated)
    └── .env.example                 # Frontend env template
```

## 🔌 API Integration Points

### 1. Signup
**Endpoint:** `POST /api/auth/signup`
**Frontend:** `src/routes/signup.tsx`
**Features:**
- Email validation
- Password strength checking
- Duplicate email prevention
- Verification email sending
- Success toast notification

### 2. Email Verification
**Endpoint:** `POST /api/auth/verify-email`
**Frontend:** `src/routes/verify-email.tsx`
**Features:**
- 24-hour token expiration
- Welcome email after verification
- Redirect to login after success
- Error handling for expired tokens

### 3. Login
**Endpoint:** `POST /api/auth/login`
**Frontend:** `src/routes/login.tsx`
**Features:**
- JWT token generation
- HTTP-only cookie storage
- Verified email check
- Rate limiting (5 attempts per 15 min)
- Unverified email option to resend

### 4. Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`
**Frontend:** `src/routes/forgot-password.tsx`
**Features:**
- Email-based password reset
- 1-hour token expiration
- Security: doesn't reveal if email exists

### 5. Reset Password
**Endpoint:** `POST /api/auth/reset-password`
**Frontend:** `src/routes/reset-password.tsx`
**Features:**
- Password strength validation
- Secure token verification
- Success confirmation page

### 6. Google OAuth
**Endpoint:** `GET /api/auth/google`
**Callback:** `GET /api/auth/google/callback`
**Features:**
- Automatic account creation
- Email verification bypass
- Profile picture storage
- First-time login detection

### 7. Get Current User
**Endpoint:** `GET /api/auth/me`
**Frontend:** Used in `useAuth()` hook
**Features:**
- Requires JWT token
- User data retrieval
- Token validation

### 8. Resend Verification
**Endpoint:** `POST /api/auth/resend-verification`
**Frontend:** Used in login and verification pages
**Features:**
- Resend verification email
- Rate limiting
- Account exists check

## 🔐 Security Implementation

### Password Security
```javascript
// Hash before storage
await bcryptjs.hash(password, salt)

// Comparison on login
await user.comparePassword(enteredPassword)

// Strength requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%*?&)
```

### Token Security
```javascript
// JWT with expiration
jwt.sign({ userId, role }, secret, { expiresIn: '7d' })

// HTTP-only cookies
res.cookie('token', token, {
  httpOnly: true,
  secure: true,    // HTTPS only in production
  sameSite: 'strict'
})
```

### Rate Limiting
```javascript
// Login: 5 attempts per 15 minutes
// Password reset: 3 attempts per hour
// Email verification: 3 attempts per hour
// General API: 100 requests per 15 minutes
```

### Input Validation
```javascript
// Email validation
const isValidEmail = (email) => 
  validator.isEmail(email)

// Password validation
const isStrongPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)
```

## 🎨 UI Components Used

- **Card** - Container for auth forms
- **Input** - Email, password fields
- **Button** - Action buttons
- **Label** - Form labels
- **Toast (Sonner)** - Notifications
- **Icons (lucide-react)** - Status indicators

## 🔄 Authentication Flow

### Signup Flow
```
User enters credentials
    ↓
Validate email & password strength
    ↓
Check for duplicate email
    ↓
Hash password
    ↓
Create user in database
    ↓
Generate verification token
    ↓
Send verification email
    ↓
Show "Check Email" page
```

### Login Flow
```
User enters credentials
    ↓
Find user by email
    ↓
Check if email verified
    ↓
Compare passwords
    ↓
Generate JWT token
    ↓
Set HTTP-only cookie
    ↓
Redirect to dashboard
```

### Email Verification Flow
```
User clicks link in email
    ↓
Token sent to /verify-email endpoint
    ↓
Verify token not expired
    ↓
Mark user as verified
    ↓
Send welcome email
    ↓
Redirect to login
```

### Password Reset Flow
```
User enters email
    ↓
Find user (don't reveal if exists)
    ↓
Generate reset token (1 hour expiry)
    ↓
Send reset email
    ↓
User clicks link
    ↓
User enters new password
    ↓
Validate password strength
    ↓
Hash and save
    ↓
Redirect to login
```

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  password: String (hashed, select: false),
  firstName: String,
  lastName: String,
  verified: Boolean (default: false),
  verificationToken: String,
  verificationTokenExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  provider: String (enum: ['local', 'google']),
  googleId: String,
  profilePicture: String,
  role: String (enum: ['user', 'admin'], default: 'user'),
  isActive: Boolean (default: true),
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Quick Start Commands

### Backend
```bash
# Install dependencies
cd backend
npm install

# Copy environment file
cp .env.example .env

# Update .env with your values

# Start development server
npm run dev

# Seed admin user
npm run seed
```

### Frontend
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
```

### API Testing
```bash
# Test backend health
curl http://localhost:5000/health

# Test signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass@123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass@123"
  }'

# Get current user (with token)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -b cookies.txt
```

## 🎯 Frontend Usage

### Wrap App with AuthProvider
```jsx
import { AuthProvider } from '@/context/AuthContext'

function App() {
  return (
    <AuthProvider>
      {/* Your routes */}
    </AuthProvider>
  )
}
```

### Use Auth Hook
```jsx
import { useAuth } from '@/hooks/useAuthContext'

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth()
  
  return (
    <>
      {isAuthenticated && <p>Hello {user.email}</p>}
      <button onClick={logout}>Logout</button>
    </>
  )
}
```

### Protect Routes
```jsx
import { ProtectedRoute } from '@/components/ProtectedRoute'

function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
```

## 📝 Email Templates

### Verification Email
- Professional HTML template
- Button with verification link
- Backup text link
- 24-hour expiry notice

### Password Reset Email
- Similar professional template
- Password reset button
- 1-hour expiry notice
- Security disclaimer

### Welcome Email
- Sent after email verification
- Dashboard link
- Account confirmation

## 🔍 Monitoring & Logging

The system includes logging for:
- Authentication attempts (success/failure)
- Email sending status
- Token generation/verification
- Password reset requests
- OAuth login attempts

All errors are logged with context for debugging.

## ✅ Testing Checklist

- [ ] Signup with new email
- [ ] Verify email with link
- [ ] Login with verified account
- [ ] Try login with unverified email
- [ ] Test password strength validation
- [ ] Test "forgot password" flow
- [ ] Test password reset
- [ ] Test Google OAuth login
- [ ] Test logout
- [ ] Test duplicate email prevention
- [ ] Test rate limiting (fail login 6 times)
- [ ] Test token expiration
- [ ] Test admin account seeding
- [ ] Test resend verification email

## 🆘 Common Issues & Solutions

### "Cannot find module" errors
→ Run `npm install` in both backend and frontend

### "MongoDB connection failed"
→ Check MongoDB is running and connection string is correct

### "Email not sending"
→ Check Gmail app password and SMTP settings

### "Google OAuth redirect_uri_mismatch"
→ Ensure callback URL matches exactly in Google Console

### "CORS error"
→ Check FRONTEND_URL in backend matches your frontend URL

### "Token not persisting"
→ Check localStorage is enabled in browser

## 📚 Additional Resources

- [JWT.io](https://jwt.io) - JWT documentation
- [MongoDB Docs](https://docs.mongodb.com) - Database docs
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Security best practices
- [Bcryptjs Docs](https://github.com/dcodeIO/bcrypt.js)
- [Nodemailer Docs](https://nodemailer.com/about/)

---

**Created:** June 2026
**Status:** Production Ready
**Security Level:** High (bcrypt, JWT, rate limiting, validation)
