const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../config/.env' });
const Notification = require('../models/Notification');

async function checkNotifications() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Notification.countDocuments();
    console.log(`Total Notification documents: ${count}`);
    
    const sample = await Notification.findOne();
    console.log('Sample Notification Doc:', JSON.stringify(sample, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Error checking notifications:', err);
    process.exit(1);
  }
}

checkNotifications();
