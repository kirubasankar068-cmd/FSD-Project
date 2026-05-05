const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../config/.env' });
const Notification = require('../models/Notification');
require('../models/User'); // Register User model
require('../models/Job');  // Register Job model

async function testNotifications() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const notifications = await Notification.find()
      .populate("recipient", "name email role")
      .populate("jobId", "title")
      .sort({ createdAt: -1 })
      .limit(100);
    
    console.log(`Successfully fetched ${notifications.length} notifications`);
    process.exit(0);
  } catch (err) {
    console.error('Notification Fetch Error:', err);
    process.exit(1);
  }
}

testNotifications();
