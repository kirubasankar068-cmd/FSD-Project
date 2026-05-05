const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config({ path: __dirname + '/config/.env' });

async function seedDemos() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database for demo seeding.");

    const demos = [
      { name: "Demo Candidate", email: "demo-candidate@jobgrox.ai", password: "password123", role: "user" },
      { name: "Demo Employer", email: "demo-employer@jobgrox.ai", password: "password123", role: "company" },
      { name: "Demo Admin", email: "admin@jobgrox.ai", password: "adminpassword", role: "admin" },
      { name: "Kiruba Sankar", email: "kirubasankar.s2024laids@sece.ac.in", password: "1234567", role: "user" }
    ];

    for (const d of demos) {
      const hashedPassword = await bcrypt.hash(d.password, 10);
      await User.findOneAndUpdate(
        { email: d.email },
        { ...d, password: hashedPassword },
        { upsert: true, new: true }
      );
      console.log(`Synced demo node: ${d.email}`);
    }

    console.log("SUCCESS: All demo access points are now active.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedDemos();
