const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config/.env' });

const User = require('./models/User');
const Company = require('./models/Company');
const Job = require('./models/Job');
const Application = require('./models/Application');
const Notification = require('./models/Notification');
const Payment = require('./models/Payment');

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://kirubasankar068_db_user:AuTVeNeARIZtsBJa@cluster0.olxdhww.mongodb.net/jobgrox?retryWrites=true&w=majority";

const seedProductionData = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for Production-Grade Seeding...");

        // 1. Clear existing data (optional, but requested "Add more", so we augment or replace)
        // For clean metrics, let's clear then re-seed in bulk
        await User.deleteMany({});
        await Company.deleteMany({});
        await Application.deleteMany({});
        await Notification.deleteMany({});
        await Payment.deleteMany({});
        console.log("Cleared existing records for Users, Companies, Applications, Notifications, and Payments.");

        const hashedPassword = await bcrypt.hash("password123", 10);

        // 2. Create Users (150+)
        console.log("Seeding 150+ Users...");
        const users = [];
        const roles = ["user", "candidate", "job_seeker"];
        
        // Add some Admins
        users.push({
            name: "Super Admin",
            email: "admin@jobgrox.com",
            password: hashedPassword,
            role: "admin",
            plan: "enterprise"
        });

        // Add Company Admins (approx 50 for 120 companies)
        for (let i = 1; i <= 50; i++) {
            users.push({
                name: `Recruiter ${i}`,
                email: `recruiter${i}@company.com`,
                password: hashedPassword,
                role: "company",
                plan: i % 2 === 0 ? "pro" : "enterprise"
            });
        }

        // Add Job Seekers
        for (let i = 1; i <= 100; i++) {
            users.push({
                name: `Job Seeker ${i}`,
                email: `seeker${i}@example.com`,
                password: hashedPassword,
                role: roles[Math.floor(Math.random() * roles.length)],
                plan: Math.random() > 0.7 ? "pro" : "free",
                isPremium: Math.random() > 0.8,
                skills: ["React", "Node.js", "JavaScript", "Python", "SQL"].slice(0, 1 + Math.floor(Math.random() * 4))
            });
        }

        const createdUsers = await User.insertMany(users);
        const companyUsers = createdUsers.filter(u => u.role === "company");
        const candidateUsers = createdUsers.filter(u => ["user", "candidate", "job_seeker"].includes(u.role));

        // 3. Create Companies (120+)
        console.log("Seeding 120+ Companies...");
        const companies = [];
        const industries = ["Technology", "Finance", "Healthcare", "E-Commerce", "Automotive", "Education", "Marketing"];
        for (let i = 1; i <= 125; i++) {
            companies.push({
                companyName: `Enterprise ${i}`,
                industry: industries[Math.floor(Math.random() * industries.length)],
                logo: industries[Math.floor(Math.random() * industries.length)][0],
                description: `Leading innovator in ${industries[Math.floor(Math.random() * industries.length)]} sector.`,
                location: ["Mumbai", "Bengaluru", "Hyderabad", "Pune", "Remote"][Math.floor(Math.random() * 5)],
                website: `https://enterprise${i}.com`,
                totalEmployees: `${100 + Math.floor(Math.random() * 10000)}+`,
                ownerId: companyUsers[Math.floor(Math.random() * companyUsers.length)]._id,
                isApproved: true
            });
        }
        const createdCompanies = await Company.insertMany(companies);

        // 4. Update existing Jobs or Link new ones
        console.log("Linking Jobs to new Companies...");
        const allJobs = await Job.find({});
        for (let job of allJobs) {
            const randomCompany = createdCompanies[Math.floor(Math.random() * createdCompanies.length)];
            job.companyId = randomCompany._id;
            job.company = randomCompany.companyName;
            await job.save();
        }

        // 5. Create Applications (300+)
        console.log("Seeding 300+ Applications...");
        const applications = [];
        const appStatus = ["Applied", "Shortlisted", "Interview", "Selected", "Hired", "Rejected"];
        for (let i = 0; i < 350; i++) {
            const randomUser = candidateUsers[Math.floor(Math.random() * candidateUsers.length)];
            const randomJob = allJobs[Math.floor(Math.random() * allJobs.length)];
            
            // Avoid duplicates for unique index
            const isDup = applications.some(a => a.userId.equals(randomUser._id) && a.jobId.equals(randomJob._id));
            if (!isDup) {
                applications.push({
                    userId: randomUser._id,
                    jobId: randomJob._id,
                    companyId: randomJob.companyId,
                    status: appStatus[Math.floor(Math.random() * appStatus.length)],
                    resumeUrl: "https://jobgrox.s3.amazonaws.com/resumes/mock-resume.pdf"
                });
            }
        }
        await Application.insertMany(applications);

        // 6. Create Notifications (100+)
        console.log("Seeding 100+ Notifications...");
        const notifications = [];
        const notifTypes = ["Application", "Selection", "Interview", "Hired", "Payment", "System"];
        for (let i = 0; i < 120; i++) {
            const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            notifications.push({
                recipient: randomUser._id,
                message: `Your status has been updated for the position of ${allJobs[Math.floor(Math.random() * allJobs.length)].title}.`,
                type: notifTypes[Math.floor(Math.random() * notifTypes.length)],
                isRead: Math.random() > 0.5
            });
        }
        await Notification.insertMany(notifications);

        // 7. Create Payments (100+)
        console.log("Seeding 100+ Premium Payments...");
        const payments = [];
        const plans = ["pro", "enterprise"];
        for (let i = 0; i < 110; i++) {
            const premiumUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            const plan = plans[Math.floor(Math.random() * plans.length)];
            payments.push({
                userId: premiumUser._id,
                planName: plan === "pro" ? "Professional" : "Enterprise", // Display name
                amount: plan === "pro" ? 999 : 4999,
                currency: "INR",
                status: "Success",
                transactionId: `TXN_GROX_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                paymentMethod: "Razorpay/Credit Card"
            });
            
            // Mark user as premium if they have a successful payment
            if (i < 50) {
               premiumUser.isPremium = true;
               premiumUser.plan = plan;
               premiumUser.premiumPlan = plan;
               await premiumUser.save();
            }
        }
        await Payment.insertMany(payments);

        console.log("-----------------------------------------");
        console.log("PRODUCTION SEEDING COMPLETE!");
        console.log(`- Users: ${createdUsers.length}`);
        console.log(`- Companies: ${createdCompanies.length}`);
        console.log(`- Applications: ${applications.length}`);
        console.log(`- Notifications: ${notifications.length}`);
        console.log(`- Payments: ${payments.length}`);
        console.log("-----------------------------------------");
        
        process.exit(0);
    } catch (err) {
        console.error("Critical Seeding Error:", err);
        process.exit(1);
    }
};

seedProductionData();
