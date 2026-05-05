const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Brokerage = require('./models/Brokerage');
require('dotenv').config({ path: __dirname + '/config/.env' });

async function deepSeed() {
  try {
    console.log(">> Initializing Deep Seed Protocol...");
    await mongoose.connect("mongodb://127.0.0.1:27017/jobgrox");

    // 1. Clear existing noise
    await Promise.all([
        Job.deleteMany({}),
        Application.deleteMany({}),
        Brokerage.deleteMany({})
    ]);

    // 2. Fetch seed users
    const companies = await User.find({ role: 'company' }).limit(5);
    const candidates = await User.find({ role: 'user' }).limit(10);

    if (companies.length === 0 || candidates.length === 0) {
        console.error("!! Seed users missing. Run seed-production.js first.");
        process.exit(1);
    }

    console.log(`>> Harvesting ${companies.length} companies and ${candidates.length} candidates...`);

    const jobTitles = ["Senior Software Engineer", "Full Stack Developer", "UX Designer", "Product Manager", "DevOps Architect"];
    
    // 3. Create Jobs
    const jobs = [];
    for (let i = 0; i < 15; i++) {
        const company = companies[i % companies.length];
        const job = await Job.create({
            title: jobTitles[i % jobTitles.length],
            company: company.name,
            employerId: company._id,
            category: "Technology",
            salary: 1200000 + (i * 100000),
            salaryNum: 1200000 + (i * 100000),
            experience: 3 + (i % 5),
            location: "Remote",
            approvalStatus: "Approved",
            isApproved: true
        });
        jobs.push(job);
    }
    console.log(`>> Synchronized ${jobs.length} job nodes.`);

    // 4. Create Applications and Brokerages
    for (let i = 0; i < 20; i++) {
        const job = jobs[i % jobs.length];
        const candidate = candidates[i % candidates.length];
        const company = companies.find(c => c._id.equals(job.employerId));

        const app = await Application.create({
            jobId: job._id,
            userId: candidate._id,
            status: i % 2 === 0 ? "Hired" : "Selected",
            answers: ["Yes", "5 years", "Immediate"]
        });

        // Create Financial Record
        const amount = Math.floor(job.salaryNum * 0.08); // 8% brokerage
        await Brokerage.create({
            jobId: job._id,
            companyId: company._id,
            candidateId: candidate._id,
            applicationId: app._id,
            amount: amount,
            feeType: "percentage",
            feeValue: 8,
            status: i % 3 === 0 ? "Paid" : "Pending",
            invoiceId: `INV-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            createdAt: new Date(new Date().setMonth(new Date().getMonth() - (i % 6))) // Spread across months
        });
    }

    console.log(">> Deep Seed Complete. Financial Registry Synchronized.");
    process.exit(0);
  } catch (err) {
    console.error("!! SEED_ERROR:", err);
    process.exit(1);
  }
}

deepSeed();
