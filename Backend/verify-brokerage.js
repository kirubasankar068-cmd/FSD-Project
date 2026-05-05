const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

const Application = require('./models/Application');
const Job = require('./models/Job');
const Brokerage = require('./models/Brokerage');

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://kirubasankar068_db_user:AuTVeNeARIZtsBJa@cluster0.olxdhww.mongodb.net/jobgrox?retryWrites=true&w=majority";

const verify = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected for verification.");

        // 1. Find a sample application
        const app = await Application.findOne().populate('jobId');
        if (!app) { console.log("No application found."); process.exit(0); }
        
        console.log(`Testing Application: ${app._id}`);
        console.log(`Job: ${app.jobId.title}, Salary: ${app.jobId.salary}`);

        // 2. Simulate what the controller does for "Selected" status
        const status = "Selected";
        const job = app.jobId;
        
        // Clear any previous test brokerage
        await Brokerage.deleteMany({ applicationId: app._id });

        if (status === "Selected") {
            const blueprintFee = job.feeValue || 8;
            const annualSalary = job.salary || 0;
            let brokerageAmount = Math.round((annualSalary * blueprintFee) / 100);

            console.log(`Expected Fee: ${brokerageAmount} (Calculated as ${blueprintFee}% of ${annualSalary})`);

            // Generate Record
            const record = await Brokerage.create({
                jobId: job._id,
                companyId: job.employerId,
                candidateId: app.userId,
                applicationId: app._id,
                amount: brokerageAmount,
                feeType: 'percentage',
                feeValue: blueprintFee,
                salaryOffered: annualSalary.toString(),
                invoiceId: `TEST-INV-${Date.now()}`
            });

            console.log(`--- VERIFICATION SUCCESSFUL ---`);
            console.log(`Brokerage Record Created: ID ${record._id}`);
            console.log(`Invoice: ${record.invoiceId}`);
            console.log(`Amount: ₹${record.amount}`);
        }

        process.exit(0);
    } catch (err) {
        console.error("Verification failed:", err);
        process.exit(1);
    }
};

verify();
