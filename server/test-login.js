const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@devnote.com' });
    if (admin) {
      console.log('✅ Admin user found:', admin.email);
      
      // Test password
      const isMatch = await admin.comparePassword('password123');
      console.log('✅ Password test:', isMatch ? 'CORRECT' : 'WRONG');
    } else {
      console.log('❌ Admin user not found');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();