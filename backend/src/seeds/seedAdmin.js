import bcrypt from 'bcrypt';
import db from '../config/db.js';

// to run this file write this command : node src/seeds/seedAdmin.js 
// just to verify the "createCategory" , "updateCategory", "deleteCategory" methods 

const seedAdmin = async () => {
  try {
    // 1. Check if admin already exists
    const existing = await db('user').where({ email: 'admin@cyberdash.com' }).first();
    if (existing) {
      console.log('Admin already exists, skipping.');
      process.exit(0);
    }

    // 2. Hash the password
    const password_hash = await bcrypt.hash('admin1234', 10);

    // 3. Insert admin user
    await db('user').insert({
      user_id: 'admin-001',
      username: 'admin',
      email: 'admin@cyberdash.com',
      password_hash,
      role: 'admin',
      is_active: true,
    });

    console.log('Admin created successfully!');
    console.log('Email:    admin@cyberdash.com');
    console.log('Password: admin1234');
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
