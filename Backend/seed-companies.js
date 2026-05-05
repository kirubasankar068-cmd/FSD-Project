const mongoose = require('mongoose');
require('dotenv').config();
const Company = require('./models/Company');
const User = require('./models/User');

const seedCompanies = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobgrox');
        console.log("Connected to MongoDB for Company Seeding...");

        await Company.deleteMany({ ownerId: { $exists: true } }); // Clear existing
        
        // Find a few users to act as owners (or create one)
        let owner = await User.findOne({ role: 'company' });
        if (!owner) {
            owner = await User.create({
                name: "Corporate Admin",
                email: "admin@enterprise.com",
                password: "password123",
                role: 'company'
            });
        }

        const companies = [
            {
                companyName: "Google",
                industry: "Technology",
                logo: "G",
                description: "Global leader in search, cloud, and advertising technologies.",
                descriptionFull: "Google is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.",
                location: "Mountain View, CA",
                website: "https://about.google",
                totalEmployees: "180,000+",
                ownerId: owner._id,
                isApproved: true
            },
            {
                companyName: "Microsoft",
                industry: "Software",
                logo: "MS",
                description: "Empowering every person and organization on the planet to achieve more.",
                descriptionFull: "Microsoft Corporation is an American multinational technology company which produces computer software, consumer electronics, personal computers, and related services.",
                location: "Redmond, WA",
                website: "https://microsoft.com",
                totalEmployees: "220,000+",
                ownerId: owner._id,
                isApproved: true
            },
            {
                companyName: "Amazon",
                industry: "E-Commerce",
                logo: "A",
                description: "The world's largest online retailer and cloud services provider.",
                descriptionFull: "Amazon.com, Inc. is an American multinational technology company which focuses on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
                location: "Seattle, WA",
                website: "https://amazon.jobs",
                totalEmployees: "1,500,000+",
                ownerId: owner._id,
                isApproved: true
            },
            {
                companyName: "Meta",
                industry: "Social Media",
                logo: "M",
                description: "Building the future of social connection and the metaverse.",
                descriptionFull: "Meta Platforms, Inc., doing business as Meta and formerly named Facebook, Inc., is an American multinational technology conglomerate based in Menlo Park, California.",
                location: "Menlo Park, CA",
                website: "https://meta.com",
                totalEmployees: "70,000+",
                ownerId: owner._id,
                isApproved: true
            },
            {
                companyName: "Tesla",
                industry: "Automotive",
                logo: "T",
                description: "Accelerating the world's transition to sustainable energy.",
                descriptionFull: "Tesla, Inc. is an American electric vehicle and clean energy company based in Austin, Texas. Tesla designs and manufactures electric cars, battery energy storage from home to grid-scale, solar panels and solar roof tiles.",
                location: "Austin, TX",
                website: "https://tesla.com",
                totalEmployees: "120,000+",
                ownerId: owner._id,
                isApproved: true
            }
        ];

        await Company.insertMany(companies);
        console.log(`Successfully seeded ${companies.length} Enterprise Nodes.`);
        process.exit();
    } catch (err) {
        console.error("Company seeding failed:", err);
        process.exit(1);
    }
};

seedCompanies();
