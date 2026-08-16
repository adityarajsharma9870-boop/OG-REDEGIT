# Authentication System - Setup Guide

## 🚀 Quick Start

### Backend Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Create `.env` file** (copy from `.env.example`):
```bash
cp .env.example .env
```

3. **Update `.env` with your values:**

**Database:**
- `MONGODB_URI` - MongoDB connection string
  - Local: `mongodb://localhost:27017/og_redigit_akro_auth`
  - Cloud: `mongodb+srv://username:password@cluster.mongodb.net/og_redigit_akro_auth`

**Email Configuration (Gmail):**
- `EMAIL_USER` - Your Gmail address
- `EMAIL_PASSWORD` - App Password (not regular password)
  - Go to: https://myaccount.google.com/apppasswords
  - Generate app password for Mail
- `SMTP_HOST` - `smtp.gmail.com`
- `SMTP_PORT` - `587`

**Google OAuth:**
1. Go to: https://console.cloud.google.com/
2. Create new project
3. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
4. Choose "Web application"
5. Add authorized JavaScript origins: `http://localhost:5173`
6. Add authorized redirect URIs: `http://localhost:5000/api/auth/google/callback`
7. Copy Client ID and Client Secret
8. Add to `.env`:
```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

**JWT & Admin:**
```
JWT_SECRET=your_very_long_random_string_min_32_chars
ADMIN_EMAIL=admin@ogredigitakro.com
ADMIN_PASSWORD=Admin@123456
```

4. **MongoDB Setup:**

Option A - Local MongoDB:
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

Option B - MongoDB Atlas (Cloud):
- Go to: https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Add connection string to `.env`

5. **Start backend:**
```bash
npm run dev
```

The server will:
- Connect to MongoDB
- Seed admin user: `admin@ogredigitakro.com / Admin@123456`
- Run on `http://localhost:5000`
- Health check: `http://localhost:5000/health`

### Frontend Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Update `src/context/AuthContext.jsx`:**
If using different backend URL, update:
```javascript
const API_URL = 'http://localhost:5000/api/auth'; // Change this if needed
```

3. **Wrap your app with AuthProvider:**

In your root layout file (e.g., `src/routes/__root.tsx`):
```jsx
import { AuthProvider } from '@/context/AuthContext';
import { Outlet } from '@tanstack/react-router';

export function RootLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
```

4. **Start frontend:**
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## 📝 API Endpoints

### Authentication Routes

**POST** `/api/auth/signup`
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "SecurePass@123"
}
```

**POST** `/api/auth/verify-email`
```json
{
  "token": "verification_token_from_email"
}
```

**POST** `/api/auth/forgot-password`
```json
{
  "email": "user@example.com"
}
```

**POST** `/api/auth/reset-password`
```json
{
  "token": "reset_token_from_email",
  "password": "NewPassword@123"
}
```

**POST** `/api/auth/logout`
- No body needed

**GET** `/api/auth/me`
- Requires Authorization header: `Bearer {token}`

**POST** `/api/auth/resend-verification`
```json
{
  "email": "user@example.com"
}
```

## 🛣️ Frontend Routes

- `/signup` - Signup page
- `/login` - Login page
- `/forgot-password` - Forgot password page
- `/reset-password?token=...` - Reset password page
- `/verify-email?token=...` - Email verification page
- `/verify-email-sent?email=...` - Email verification sent page
- `/dashboard` - Protected dashboard (requires login)

## 🔐 Security Features

✅ **Password Security:**
- Bcrypt hashing (10 salt rounds)
- Password strength validation
- Requirements: 8+ chars, uppercase, lowercase, number, special character

✅ **Token Security:**
- JWT tokens with expiration
- HTTP-only secure cookies
- CORS protection

✅ **Rate Limiting:**
- General: 100 requests per 15 minutes
- Login: 5 attempts per 15 minutes
- Password Reset: 3 attempts per hour
- Email Verification: 3 attempts per hour

✅ **Email Security:**
- Verification tokens expire in 24 hours
- Password reset tokens expire in 1 hour
- Tokens are hashed before storage

✅ **Input Validation:**
- Email format validation
- Password strength validation
- All inputs are sanitized

## 👤 Default Admin Account

**Email:** `admin@ogredigitakro.com`
**Password:** `Admin@123456`

⚠️ **IMPORTANT:** Change these in production!

To update admin credentials:
1. Update `.env` file:
```
ADMIN_EMAIL=new_admin@example.com
ADMIN_PASSWORD=NewPassword@123456
```
2. Delete the existing admin from MongoDB
3. Run `npm run seed` to create new admin

## 📧 Email Testing

For development, you can use:

**Option 1: Gmail**
- Use real Gmail account
- Generate app password: https://myaccount.google.com/apppasswords

**Option 2: Mailtrap**
- Go to: https://mailtrap.io
- Create free account
- Copy SMTP credentials
- Update `.env` with Mailtrap SMTP settings

**Option 3: Mailhog (Local)**
- Download: https://github.com/mailhog/Mailhog
- Run: `MailHog`
- Access at: `http://localhost:1025`
- Update `.env`:
```
SMTP_HOST=localhost
SMTP_PORT=1025
```

## 🔄 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection | mongodb://localhost:27017/og_redigit_akro_auth |
| PORT | Backend port | 5000 |
| NODE_ENV | Environment | development/production |
| FRONTEND_URL | Frontend URL | http://localhost:5173 |
| JWT_SECRET | JWT signing key | your_secret_min_32_chars |
| JWT_EXPIRE | Token expiration | 7d |
| EMAIL_USER | Email account | your@gmail.com |
| EMAIL_PASSWORD | Email password | app_password |
| GOOGLE_CLIENT_ID | Google OAuth ID | your_client_id |
| GOOGLE_CLIENT_SECRET | Google OAuth secret | your_secret |
| ADMIN_EMAIL | Admin email | admin@example.com |
| ADMIN_PASSWORD | Admin password | password |

## 🐛 Troubleshooting

**MongoDB Connection Failed:**
- Make sure MongoDB is running
- Check connection string in `.env`
- Verify firewall settings

**Email Not Sending:**
- Check EMAIL_USER and EMAIL_PASSWORD
- Use app password for Gmail (not regular password)
- Check spam folder
- Verify SMTP settings

**Google OAuth Not Working:**
- Verify Client ID and Secret
- Check redirect URLs in Google Console
- Make sure frontend URL matches

**Token Invalid Error:**
- Clear localStorage
- Check JWT_SECRET is same in backend
- Verify token hasn't expired (7 days)

**CORS Errors:**
- Check FRONTEND_URL in backend `.env`
- Make sure frontend and backend URLs match

## 📚 Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + Passport.js
- Bcryptjs + Nodemailer
- Express Rate Limit

**Frontend:**
- React 18 + TypeScript
- TanStack Router
- Tailwind CSS
- Shadcn UI Components
- Sonner (Toast notifications)

## ✨ Next Steps

1. Customize email templates in `backend/src/utils/mailer.js`
2. Add user profile routes (update profile, change password)
3. Add social media authentication (GitHub, Discord, etc.)
4. Implement 2FA (Two-Factor Authentication)
5. Add audit logging
6. Set up automated email templates

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review error messages in console
3. Check MongoDB and email logs
4. Verify environment variables
