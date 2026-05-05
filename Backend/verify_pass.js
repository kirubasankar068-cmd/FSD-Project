const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config({ path: __dirname + '/config/.env' });

async function verify() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/jobgrox");
    const user = await User.findOne({ email: 'admin@jobgrox.com' });
    if (!user) {
        console.log("Admin user not found");
        process.exit(1);
    }
    console.log("User found:", user.email);
    console.log("Hash in DB:", user.password);
    const isMatch = await bcrypt.compare("password123", user.password);
    console.log("Password match result:", isMatch);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
verify();
