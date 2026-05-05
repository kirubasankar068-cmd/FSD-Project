const mongoose = require('mongoose');
require('dotenv').config();
const Company = require('./models/Company');
const Job = require('./models/Job');

const linkJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobgrox');
        console.log("Connected to MongoDB for Job Linking...");

        const companies = await Company.find();
        if (companies.length === 0) {
            console.log("No companies found. Run seed-companies first.");
            process.exit();
        }

        const jobs = await Job.find().limit(100);
        
        for (let i = 0; i < jobs.length; i++) {
            const company = companies[i % companies.length];
            jobs[i].employerId = company.ownerId;
            jobs[i].company = company.companyName;
            jobs[i].companyName = company.companyName;
            await jobs[i].save();
        }

        console.log(`Successfully linked ${jobs.length} jobs to enterprise nodes.`);
        process.exit();
    } catch (err) {
        console.error("Linking failed:", err);
        process.exit(1);
    }
};

linkJobs();
