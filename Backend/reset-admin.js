const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function reset() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB...");
    const hashedPassword = await bcrypt.hash('password123', 10);
    const result = await User.updateOne({ email: 'admin@jobgrox.com' }, { $set: { password: hashedPassword } });
    if (result.matchedCount === 0) {
        // Create it if it doesn't exist
        await User.create({
            name: "Admin User",
            email: "admin@jobgrox.com",
            password: hashedPassword,
            role: "admin"
        });
        console.log("Admin account CREATED: admin@jobgrox.com / password123");
    } else {
        console.log("Admin account UPDATED: admin@jobgrox.com / password123");
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

reset();
