const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config({ path: __dirname + '/config/.env' });

async function updatePassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database for password update.");

    const email = "kirubasankar.s2024laids@sece.ac.in";
    const newPassword = "1234567";
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const result = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { 
        name: "Kiruba Sankar", 
        password: hashedPassword,
        role: "user" 
      },
      { new: true, upsert: true }
    );

    if (result) {
      console.log(`SUCCESS: Account synchronized for ${email} with password ${newPassword}`);
    } else {
      console.log(`FAILURE: Operation failed.`);
    }

    process.exit(0);
  } catch (err) {
    console.error("Error updating password:", err);
    process.exit(1);
  }
}

updatePassword();
