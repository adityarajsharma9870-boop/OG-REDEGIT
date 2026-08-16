import dotenv from 'dotenv';

dotenv.config();

/**
 * Validate required environment variables
 */
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
];

const missingEnvVars = requiredEnvVars.filter(
  (envVar) => !process.env[envVar]
);

if (missingEnvVars.length > 0) {
  console.warn(
    `Warning: Missing environment variables: ${missingEnvVars.join(', ')}`
  );
}

export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/una_cheatx_auth',
  },
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-to-a-long-random-string',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@unacheatx.com',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.SMTP_PORT || 587,
  },
  verification: {
    emailExpires: process.env.EMAIL_VERIFICATION_EXPIRES || '24h',
    passwordResetExpires: process.env.PASSWORD_RESET_EXPIRES || '1h',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@unacheatx.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
  },
  // Optional: seed multiple admin accounts via env var ADMIN_SEED
  // Format: "email1:password1;email2:password2"
  adminSeeds: (() => {
    if (process.env.ADMIN_SEED && process.env.ADMIN_SEED.trim().length > 0) {
      return process.env.ADMIN_SEED.split(';').filter(Boolean).map((pair) => {
        const [email, password] = pair.split(':');
        return email && password ? { email: email.trim(), password: password.trim() } : null;
      }).filter(Boolean);
    }

    // Default seeded admin accounts for immediate login support
    return [
      { email: 'admin@unacheatx.com', password: 'krish124578' },
      { email: 'devadmine1234@gmail.com', password: 'dev9608' },
    ];
  })(),
  rateLimiting: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
  },
};
