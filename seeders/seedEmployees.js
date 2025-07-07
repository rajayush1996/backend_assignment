// seedEmployees.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Employee from '../src/models/Employee.js';

dotenv.config();

async function seedEmployees(count = 50) {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`Connected—seeding ${count} employees…`);
  const existing = await Employee.countDocuments();
  if (existing > 0) {
    console.log(`Already have ${existing} employees—skipping seed.`);
    await mongoose.disconnect();
    return;
  }

  const docs = [];
  for (let i = 0; i < count; i++) {
    docs.push({
      name: faker.person.fullName(),
      age: faker.number.int({ min: 20, max: 60 }),
      class: faker.helpers.arrayElement(['A', 'B', 'C', 'D']),
      subjects: faker.helpers.arrayElements(
        ['Math', 'Science', 'English', 'History', 'Art', 'PE'],
        faker.number.int({ min: 2, max: 4 })
      ),
      attendance: faker.number.int({ min: 60, max: 100 }),
    });
  }

  await Employee.insertMany(docs);
  console.log('Seeding complete:', docs.length, 'employees inserted.');

  await mongoose.disconnect();
}

seedEmployees().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
