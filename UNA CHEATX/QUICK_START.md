# 🚀 QUICK START GUIDE - Authentication System

## 5-Minute Setup

### Step 1: Backend Environment Setup

1. **Navigate to backend folder:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```bash
cp .env.example .env
```

4. **Edit `.env` with these values (for local development):**
```
MONGODB_URI=mongodb://localhost:27017/og_redigit_akro_auth
PORT=5000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_super_secret_key_min_32_chars_long_very_secure
ADMIN_EMAIL=admin@ogredigitakro.com
ADMIN_PASSWORD=dev 9608
NODE_ENV=development
```

5. **For Email (Gmail):**
   - Go to: https://myaccount.google.com/apppasswords
   - Create app password for Gmail
   - Copy the 16-character password
   - Update `.env`:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=16_character_app_password
   ```

6. **For Google OAuth (Optional for now):**
   - Go to: https://console.cloud.google.com/
   - Create OAuth 2.0 credentials
   - Add these URLs:
     - Authorized JavaScript origins: `http://localhost:5173`
     - Authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
   - Update `.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### Step 2: Database Setup

**Option A: Local MongoDB**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Windows (using MongoDB installer)
# Or install from: https://www.mongodb.com/try/download/community

# Linux
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/database`)
5. Update `MONGODB_URI` in `.env`

### Step 3: Start Backend

```bash
# From backend directory
npm run dev
```

✅ You should see:
```
🚀 Server running on port 5000
📧 Email: your_email@gmail.com
🔐 Frontend URL: http://localhost:5173
🌐 Environment: development
```

✅ Admin user created:
- Email: `admin@ogredigitakro.com`
- Password: `Admin@123456`

### Step 4: Frontend Environment Setup

1. **Create `.env` file in root:**
```bash
cp .env.example .env
```

2. **Content (usually default is fine):**
```
VITE_API_URL=http://localhost:5000/api/auth
```

### Step 5: Start Frontend

```bash
# From root directory (not backend)
npm install
npm run dev
```

✅ Frontend will run on: `http://localhost:5173`

## ✨ Test the System

### 1. Test Signup
1. Go to: `http://localhost:5173/signup`
2. Fill in form with:
   - Email: `test@example.com`
   - Password: `SecurePass@123` (meets all requirements)
   - First Name: Test
   - Last Name: User
3. Click "Sign Up"
4. ✅ You'll see "Check your email" page

### 2. Receive Verification Email
- Check your email inbox
- Click the verification link
- ✅ You'll see "Email Verified!" page

### 3. Login
1. Go to: `http://localhost:5173/login`
2. Enter:
   - Email: `test@example.com`
   - Password: `SecurePass@123`
3. Click "Log In"
4. ✅ You'll be redirected to dashboard

### 4. Admin Login
1. Go to: `http://localhost:5173/login`
2. Enter:
   - Email: `admin@unacheatx.com`
   - Password: `Admin@123456`
3. ✅ You'll see admin panel option

### 5. Test Forgot Password
1. Go to: `http://localhost:5173/forgot-password`
2. Enter your email
3. Click "Send Reset Link"
4. Check your email for reset link
5. Click link and enter new password

## 📁 Key Files Created

### Backend
```
backend/
├── src/
│   ├── config/db.js              - Database connection
│   ├── config/env.js             - Environment setup
│   ├── models/User.js            - MongoDB schema
│   ├── controllers/authController.js - Auth logic
│   ├── routes/auth.js            - API endpoints
│   ├── middleware/auth.js        - JWT & protection
│   ├── middleware/rateLimiter.js - Rate limiting
│   ├── utils/mailer.js           - Email sending
│   ├── utils/jwt.js              - Token management
│   └── server.js                 - Main server
├── .env.example                  - Template
└── package.json
```

### Frontend
```
src/
├── context/AuthContext.jsx       - State management
├── hooks/useAuthContext.js       - Auth hook
├── components/ProtectedRoute.jsx - Route protection
├── routes/signup.tsx             - Sign up page
├── routes/login.tsx              - Login page
├── routes/dashboard.tsx          - Dashboard
├── routes/verify-email.tsx       - Email verification
└── routes/forgot-password.tsx    - Password reset
```

## 🔐 Default Credentials

```
Admin Email: admin@ogredigitakro.com
Admin Password: Admin@123456
```

⚠️ **IMPORTANT:** Change these in production!

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check MongoDB is running
# macOS: brew services list
# Windows: Check Services for MongoDB
# Linux: sudo systemctl status mongodb
```

### "Email not sending"
1. Check EMAIL_USER and EMAIL_PASSWORD in `.env`
2. Use Gmail app password (not regular password)
3. Enable "Less secure app access" (if not using app password)

### "Port 5000 already in use"
```bash
# Change PORT in .env
# Or kill existing process:
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000
```

### "Frontend can't reach backend"
1. Check backend is running on port 5000
2. Check FRONTEND_URL in backend .env
3. Clear browser cache

### "Token invalid"
1. Clear localStorage
2. Restart backend
3. Login again

## 📚 Next Steps

1. ✅ Test all authentication flows
2. ✅ Customize email templates
3. ✅ Set up Google OAuth
4. ✅ Add more user fields as needed
5. ✅ Deploy to production

## 🆘 Need Help?

1. Check `AUTHENTICATION_SYSTEM.md` for detailed docs
2. Check `AUTH_SETUP_GUIDE.md` for setup details
3. Check `DEPLOYMENT_GUIDE.md` for production
4. Review error messages in browser console
5. Check backend logs in terminal

---

**Ready to go!** 🎉
Your production-ready authentication system is now running!
