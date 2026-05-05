const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../config/.env' });
const User = require('../models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const users = await User.find({}, 'name email role');
    console.log('--- Users in Database ---');
    users.forEach(u => console.log(`${u.name} (${u.email}) - Role: ${u.role}`));
    process.exit(0);
  } catch (err) {
    console.error('Error checking users:', err);
    process.exit(1);
  }
}

checkUsers();
