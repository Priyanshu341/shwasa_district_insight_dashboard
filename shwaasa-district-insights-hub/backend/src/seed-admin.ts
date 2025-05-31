
import bcrypt from 'bcryptjs';
import User from './models/user.model';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

const createAdmin = async () => {
  await connectDB(); // ✅ CONNECT TO DB FIRST

  const adminUsername = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';

  const existingUser = await User.findOne({ username: adminUsername });
  if (existingUser) {
    console.log('⚠️ Admin user already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = new User({
    username: adminUsername,
    password: hashedPassword,
    isAdmin: true,
  });

  await admin.save();
  console.log('✅ Admin user created successfully');
};

createAdmin().catch(console.error);
