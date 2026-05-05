const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../config/.env' });
const Brokerage = require('../models/Brokerage');

async function checkBrokerage() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Brokerage.countDocuments();
    console.log(`Total Brokerage documents: ${count}`);
    
    const badDocs = await Brokerage.find({ createdAt: { $exists: false } });
    console.log(`Documents without createdAt: ${badDocs.length}`);
    
    const sample = await Brokerage.findOne();
    console.log('Sample Brokerage Doc:', JSON.stringify(sample, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Error checking brokerage:', err);
    process.exit(1);
  }
}

checkBrokerage();
