const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../config/.env' });
const User = require('../models/User');
const Job = require('../models/Job');

async function testStats() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const users = await User.countDocuments();
    console.log('Users:', users);
    
    const companies = await User.countDocuments({ role: 'company' });
    console.log('Companies:', companies);
    
    const jobs = await Job.countDocuments();
    console.log('Jobs:', jobs);
    
    const approvedJobs = await Job.countDocuments({ approvalStatus: 'Approved' });
    console.log('Approved Jobs:', approvedJobs);
    
    process.exit(0);
  } catch (err) {
    console.error('Stats Error:', err);
    process.exit(1);
  }
}

testStats();
