const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config({ path: __dirname + '/config/.env' });

async function addUser() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/jobgrox");
    
    const email = 'kirubasankar.s2024laids@sece.ac.in';
    const existing = await User.findOne({ email });
    
    if (existing) {
        console.log("User already exists locally. Updating password...");
        existing.password = await bcrypt.hash("password123", 10);
        existing.role = 'admin';
        await existing.save();
        console.log("User updated successfully.");
    } else {
        const hashedPassword = await bcrypt.hash("password123", 10);
        await User.create({
            name: "Kirubasankar",
            email: email,
            password: hashedPassword,
            role: "admin",
            isVerified: true
        });
        console.log("User created successfully locally.");
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
addUser();
