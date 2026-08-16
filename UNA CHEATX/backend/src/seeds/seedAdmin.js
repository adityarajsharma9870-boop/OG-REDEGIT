import User from '../models/User.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { config } from '../config/env.js';

/**
 * Seed admin user if it doesn't exist
 */
export const seedAdmin = async () => {
  try {
    await connectDB();
    // Prepare seed list: env ADMIN_SEED takes precedence, otherwise use single admin from config
    const seeds = config.adminSeeds && config.adminSeeds.length > 0
      ? config.adminSeeds
      : [{ email: config.admin.email, password: config.admin.password }];

    for (const s of seeds) {
      const adminExists = await User.findOne({ email: s.email, role: 'admin' });
      if (adminExists) {
        console.log(`Admin user already exists: ${s.email}`);
        continue;
      }

      const admin = new User({
        email: s.email.toLowerCase(),
        password: s.password,
        firstName: 'Admin',
        lastName: 'User',
        verified: true,
        provider: 'local',
        role: 'admin',
        isActive: true,
      });

      await admin.save();
      console.log('Admin user created successfully');
      console.log('Email:', s.email);
      console.log('Password:', s.password ? '[REDACTED]' : '[none]');
    }
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  } finally {
    await disconnectDB();
  }
};

if (process.argv[1] && process.argv[1].endsWith('seedAdmin.js')) {
  seedAdmin();
}
