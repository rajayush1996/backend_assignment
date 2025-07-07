// seedUsers.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../src/models/User.js';

dotenv.config();

async function seed() {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to MongoDB for seeding');

  const users = [
    { username: 'admin',    password: 'admin123', role: 'admin' },
    { username: 'employee', password: 'emp123',   role: 'employee' },
  ];

  for (const u of users) {
    const exists = await User.findOne({ username: u.username });
    if (!exists) {
      const hash = await bcrypt.hash(u.password, 10);
      await User.create({ username: u.username, password: hash, role: u.role });
      console.log(`Created user: ${u.username}`);
    } else {
      console.log(`User already exists: ${u.username}`);
    }
  }

  await mongoose.disconnect();
  console.log('Seeding complete');
}

seed().catch(err => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
