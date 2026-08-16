import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';
import authRoutes from './routes/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import { generalLimiter } from './middleware/rateLimiter.js';
import User from './models/User.js';
import { generateToken } from './utils/jwt.js';
import { seedAdmin } from './seeds/seedAdmin.js';

const app = express();

/**
 * Middleware setup
 */
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
// app.use(generalLimiter);

/**
 * Passport.js Google OAuth setup
 */
if (config.google.clientId && config.google.clientSecret) {
  passport.use(
    new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
      },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: profile.emails[0].value.toLowerCase() },
          ],
        });

        if (user) {
          // Update Google ID if not set
          if (!user.googleId) {
            user.googleId = profile.id;
          }

          // Update last login
          user.lastLogin = new Date();

          // Make sure verified is true for Google OAuth
          if (!user.verified) {
            user.verified = true;
          }

          await user.save();
        } else {
          // Create new user
          user = new User({
            email: profile.emails[0].value.toLowerCase(),
            firstName: profile.name.givenName || '',
            lastName: profile.name.familyName || '',
            googleId: profile.id,
            profilePicture: profile.photos[0]?.value || '',
            verified: true,
            provider: 'google',
            isActive: true,
            lastLogin: new Date(),
          });

          await user.save();
        }

        // Generate JWT token
        const token = generateToken(user._id, user.role);

        return done(null, {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          provider: user.provider,
          profilePicture: user.profilePicture,
          token,
        });
      } catch (error) {
        return done(error, null);
      }
    }
    )
  );
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.use(passport.initialize());

/**
 * Routes
 */
app.use('/api/auth', authRoutes);

/**
 * Health check
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

/**
 * Error handler
 */
app.use(errorHandler);

/**
 * Start server
 */
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Seed admin user
    await seedAdmin();

    // Start listening
    app.listen(config.server.port, () => {
      console.log(`\n🚀 Server running on port ${config.server.port}`);
      console.log(`📧 Email: ${config.email.user}`);
      console.log(`🔐 Frontend URL: ${config.server.frontendUrl}`);
      console.log(`🌐 Environment: ${config.server.nodeEnv}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
