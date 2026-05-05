const mongoose = require('mongoose');
require('dotenv').config();
const Job = require('./models/job');

const categories = ['IT DEPLOYMENT', 'LOCAL OPERATIONS', 'CORE ENGINEERING', 'BANKING & FINANCE', 'HEALTHCARE & MEDICAL', 'GOVERNMENT SECTOR'];
const locations = ['Hyderabad', 'Bengaluru', 'Mumbai', 'New Delhi', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad', 'Remote', 'London', 'New York', 'Singapore'];
const types = ['Full time', 'Part time', 'Contract', 'Flexible schedule', 'Full day', 'Distant work'];
const experienceLevels = ['Entry level', '1-3 Years', '3-5 Years', '5+ Years', '8+ Years', 'Senior level'];

const industryData = {
  'IT DEPLOYMENT': {
    titles: ['Software Engineer', 'DevOps Specialist', 'Cloud Architect', 'Full Stack Developer', 'Data Scientist', 'Cybersecurity Analyst', 'Product Manager', 'QA Engineer', 'Mobile Developer', 'UI/UX Designer'],
    companies: ['Google', 'Meta', 'Amazon', 'Microsoft', 'Adobe', 'Oracle', 'Salesforce', 'Tech Mahindra', 'Infosys', 'Wipro'],
    skills: ['React', 'Node.js', 'AWS', 'Python', 'Kubernetes', 'TypeScript', 'SQL', 'Docker', 'Go', 'Java']
  },
  'LOCAL OPERATIONS': {
    titles: ['Store Manager', 'Logistics Coordinator', 'Delivery Lead', 'Warehouse Supervisor', 'Fleet Manager', 'Operations Executive', 'Supply Chain Analyst', 'Retail Head', 'Dispatcher', 'Inventory Manager'],
    companies: ['Flipkart', 'Zomato', 'Swiggy', 'DHL', 'FedEx', 'Reliance Retail', 'BigBasket', 'Uber', 'Ola', 'Dunzo'],
    skills: ['Operations', 'SQL', 'Logistics', 'Excel', 'Team Management', 'Customer Success', 'Planning', 'Resource Optimization']
  },
  'CORE ENGINEERING': {
    titles: ['Structural Engineer', 'Mechanical Designer', 'Electrical Lead', 'Civil Site Engineer', 'CAD Technician', 'Project Engineer', 'Manufacturing Specialist', 'Automotive Designer', 'R&D Lead', 'Quality Lead'],
    companies: ['L&T', 'Tata Motors', 'BHEL', 'Siemens', 'ABB', 'Bosch', 'GE Renewable', 'Reliance Industries', 'Adani Power', 'Maruti Suzuki'],
    skills: ['AutoCAD', 'SolidWorks', 'MATLAB', 'STAAD.Pro', 'Revit', 'Ansys', 'Python', 'Structural Analysis', 'Embedded Systems']
  },
  'BANKING & FINANCE': {
    titles: ['Investment Banker', 'Relationship Manager', 'Credit Analyst', 'Wealth Manager', 'Financial Advisor', 'Risk Officer', 'Audit Manager', 'Accountant', 'Stock Trader', 'Insurance Specialist'],
    companies: ['HDFC Bank', 'ICICI Bank', 'SBI', 'Goldman Sachs', 'Morgan Stanley', 'JPMorgan', 'HSBC', 'Citibank', 'Standard Chartered', 'Axis Bank'],
    skills: ['Accounting', 'Financial Modeling', 'Wealth Management', 'Risk Assessment', 'Tally', 'Excel Macro', 'Portfolio Management']
  },
  'HEALTHCARE & MEDICAL': {
    titles: ['Clinical Researcher', 'Registered Nurse', 'Laboratory Manager', 'Radiologist', 'Medical Consultant', 'Pharmacist', 'Physiotherapist', 'Surgeon Assistant', 'Health Admin', 'Biotech Scientist'],
    companies: ['Apollo Hospitals', 'Fortis Healthcare', 'Max Health', 'Reddy Labs', 'Sun Pharma', 'Cipla', 'Biocon', 'Lupin', 'Medanta', 'Aster DM'],
    skills: ['Patient Care', 'Clinical Research', 'Phlebotomy', 'MRI Operation', 'Surgical Protocols', 'Diagnosis', 'Medical Record MGMT']
  },
  'GOVERNMENT SECTOR': {
    titles: ['Policy Analyst', 'Public Relations Officer', 'Admin Assistant', 'Research Fellow', 'Revenue Officer', 'Judicial Clerk', 'Urban Planner', 'Statistical Investigator', 'Assistant Professor', 'Scientific Officer'],
    companies: ['NITI Aayog', 'Ministry of Finance', 'State Govt', 'DRDO', 'ISRO', 'CSIR', 'NIC', 'RBI', 'NPCI', 'UPSC'],
    skills: ['Governance', 'Public Policy', 'Data Analysis', 'Administration', 'Stata', 'Excel', 'English Proficiency', 'Constitutional Law']
  }
};

const seedJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/jobgrox');
        console.log("Connected to MongoDB for Seeding...");

        await Job.deleteMany({}); // Clear existing jobs
        console.log("Cleared old job records.");

        const jobs = [];
        for (let i = 1; i <= 500; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const data = industryData[category];
            const title = data.titles[Math.floor(Math.random() * data.titles.length)];
            const company = data.companies[Math.floor(Math.random() * data.companies.length)];
            const loc = locations[Math.floor(Math.random() * locations.length)];
            const type = types[Math.floor(Math.random() * types.length)];
            const exp = experienceLevels[Math.floor(Math.random() * experienceLevels.length)];
            const jobSkills = [];
            const skillCount = 3 + Math.floor(Math.random() * 3);
            for (let j = 0; j < skillCount; j++) {
                const s = data.skills[Math.floor(Math.random() * data.skills.length)];
                if (!jobSkills.includes(s)) jobSkills.push(s);
            }

            const salaryNum = (5 + Math.floor(Math.random() * 20)) * 100000;
            const expYears = Math.floor(Math.random() * 10);

            jobs.push({
                title: title,
                company: company,
                category: category,
                salary: salaryNum,
                salaryNum: salaryNum,
                experience: expYears,
                employmentType: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'][Math.floor(Math.random() * 5)],
                remote: Math.random() > 0.7,
                skills: jobSkills,
                description: `Professional opportunity for a ${title} at ${company}. Joining a dynamic team to drive excellence in the ${category} field. Full range of benefits and premium work environment guaranteed.`,
                postedAt: `${Math.floor(Math.random() * 5) + 1} days ago`,
                isPremium: Math.random() > 0.8,
                isApproved: true,
                employerId: new mongoose.Types.ObjectId()
            });
        }

        await Job.insertMany(jobs);
        console.log(`Successfully seeded 500 Production-Ready jobs into the database.`);
        process.exit();
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedJobs();
