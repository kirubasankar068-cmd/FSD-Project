// src/services/apiMock.js
// This file serves as a mock API to simulate backend operations like DB queries, parsing, etc.

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Template Data for Generator
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

// Generator Function
const generateJobs = (count) => {
  const jobs = [];
  for (let i = 1; i <= count; i++) {
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

    const minPay = 5 + Math.floor(Math.random() * 20);
    const maxPay = minPay + 5 + Math.floor(Math.random() * 20);

    jobs.push({
      _id: `65e1a2b3c4d5e6f7a8b9${i.toString(16).padStart(4, '0')}`,
      title: title,
      company: company,
      category: category,
      type: type,
      location: loc,
      salary: `₹${minPay}L - ₹${maxPay}L`,
      experience: exp,
      skills: jobSkills,
      description: `Professional opportunity for a ${title} at ${company}. Joining a dynamic team to drive excellence in the ${category} field.`,
      postedAt: `${Math.floor(Math.random() * 5) + 1} days ago`,
      isPremium: Math.random() > 0.8,
      whyMatch: `Strong alignment with your background in ${jobSkills[0]} and industrial experience.`,
      matchScore: 0 // Will be set by matchJobs
    });
  }
  return jobs;
};

// Initial Database - 1000 Jobs
const jobsDB = generateJobs(1000);

// Candidate Generator Data
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan', 'Rahul', 'Dhruv', 'Diya', 'Ananya', 'Aadhya', 'Saanvi', 'Sneha', 'Meera', 'Riya', 'Kavya'];
const lastNames = ['Sharma', 'Patel', 'Singh', 'Reddy', 'Rao', 'Iyer', 'Menon', 'Nair', 'Kumar', 'Das', 'Roy', 'Gupta', 'Verma', 'Chandra', 'Desai'];

const generateCandidates = (count) => {
  const candidates = [];
  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const data = industryData[category];
    
    // Pick random skills
    const candidateSkills = [];
    const skillCount = 3 + Math.floor(Math.random() * 4);
    for (let j = 0; j < skillCount; j++) {
      const s = data.skills[Math.floor(Math.random() * data.skills.length)];
      if (!candidateSkills.includes(s)) candidateSkills.push(s);
    }
    
    const expIndex = Math.floor(Math.random() * experienceLevels.length);
    const title = data.titles[Math.floor(Math.random() * data.titles.length)];

    candidates.push({
      _id: `65e1a2b3c4d5e6f7a8b9${(i + 2000).toString(16).padStart(4, '0')}`,
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      title: title,
      category: category,
      experience: experienceLevels[expIndex],
      yearsExperience: expIndex + 1,
      location: locations[Math.floor(Math.random() * locations.length)],
      skills: candidateSkills,
      matchScore: 0,
      avatarId: Math.floor(Math.random() * 70), // For ui-avatars or generic portraits
      bio: `Results-driven ${title} specializing in ${candidateSkills[0]} and ${category} ecosystem dynamics.`
    });
  }
  return candidates;
};

const candidatesDB = generateCandidates(500);

// Enterprise Network Generator
const generateCompanies = () => {
   let allCompanies = [];
   let idCounter = 1;
   Object.entries(industryData).forEach(([industry, data]) => {
     data.companies.forEach(compName => {
        allCompanies.push({
           _id: `65e1a2b3c4d5e6f7a8b9${(idCounter++ + 3000).toString(16).padStart(4, '0')}`,
           companyName: compName,
           industry: industry,
           location: locations[Math.floor(Math.random() * locations.length)],
           description: `Leading innovator in the ${industry} sector focusing on massive scale and global network deployments.`,
           descriptionFull: `${compName} is a vanguard organization operating within the ${industry} sphere. We are seeking elite talent to synchronize with our core active nodes.`,
           website: `https://www.${compName.toLowerCase().replace(/\s+/g,'')}.com`,
           totalEmployees: (Math.floor(Math.random() * 500) + 100) * 10
        });
     });
   });
   return allCompanies;
}
const companiesDB = generateCompanies();

export const apiMock = {
  // 1. AI Match: Returns jobs simulating a "cosine similarity" match against user profile
  matchJobs: async (userSkills = []) => {
    await delay(500); 
    
    return jobsDB.map(job => {
      const normalizedUserSkills = userSkills.map(s => s.toLowerCase());
      const matchedSkills = [];
      const missingSkills = [];
      
      job.skills.forEach(skill => {
         if (normalizedUserSkills.includes(skill.toLowerCase())) {
            matchedSkills.push(skill);
         } else {
            missingSkills.push(skill);
         }
      });
      
      let score = Math.round((matchedSkills.length / job.skills.length) * 100);
      if (score < 20) score = 15 + Math.floor(Math.random() * 25);
      if (userSkills.length === 0 && score > 40) score = 40; // Default score for no profile
      
      // More advanced metadata
      const matchReasoning = matchedSkills.length > 0 
          ? `High structural alignment via overlapping nodes in ${matchedSkills.join(', ')}.`
          : `Baseline structural alignment with the ${job.category} sector requirements.`;
          
      const improvementSuggestions = missingSkills.length > 0
          ? [`Attain proficiency in ${missingSkills[0]} to increase probability by ~${Math.floor(Math.random() * 15 + 10)}%.`]
          : [`Your matrix perfectly aligns with this role's structural requirements.`];
      
      return { 
          ...job, 
          matchScore: score,
          matchReasoning,
          missingSkills,
          improvementSuggestions
      };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 10); // Return top 10 advanced matches
  },

  // 2. Resume Parser
  parseResume: async (file) => {
    await delay(1500); 
    
    let textToAnalyze = "";
    try {
      if (file && typeof file.text === 'function') {
         textToAnalyze = await file.text();
      } else if (file && file.name) {
         textToAnalyze = file.name;
      }
    } catch(e) {
      console.log("Error reading file text for parsing", e);
    }
    
    const lowerText = textToAnalyze.toLowerCase();
    const skillDictionary = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Python', 'Java', 'C++', 'Go', 'Kubernetes', 'MongoDB', 'Angular', 'Vue', 'Next.js', 'Express', 'Tailwind', 'JavaScript', 'HTML', 'CSS', 'SQL', 'Rust', 'Ruby', 'PHP', 'Azure', 'GCP', 'Machine Learning'];
    
    let detectedSkills = [];
    skillDictionary.forEach(skill => {
       if (lowerText.includes(skill.toLowerCase())) {
          detectedSkills.push(skill);
       }
    });
    
    // Fallback if no skills are detected in the file/text
    if (detectedSkills.length === 0) {
       detectedSkills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'];
    }
    
    let title = 'Software Engineer';
    if (lowerText.includes('full stack') || lowerText.includes('fullstack')) title = 'Senior Full Stack Specialist';
    else if (lowerText.includes('front end') || lowerText.includes('frontend') || lowerText.includes('react')) title = 'Frontend Architect';
    else if (lowerText.includes('back end') || lowerText.includes('backend') || lowerText.includes('node') || lowerText.includes('python')) title = 'Backend Systems Engineer';
    else if (lowerText.includes('data') || lowerText.includes('machine learning')) title = 'Data Scientist';
    else if (lowerText.includes('devops') || lowerText.includes('kubernetes') || lowerText.includes('aws')) title = 'Cloud Architect';

    const nameToUse = file && file.name && file.name !== 'pasted-resume.txt' 
        ? file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ') 
        : 'Alex Rivera';

    return {
      message: 'MOCK_ANALYSIS_SYNCED',
      data: {
        name: nameToUse.replace(/\b\w/g, l => l.toUpperCase()),
        title: title,
        email: `${nameToUse.replace(/\s+/g, '.').toLowerCase()}@neural-node.io`,
        atsScore: 80 + Math.floor(Math.random() * 19),
        yearsOfExp: detectedSkills.length > 5 ? 8 : 3,
        skills: detectedSkills,
        clusters: {
           frontend: detectedSkills.filter(s => ['React', 'TypeScript', 'Tailwind', 'Next.js', 'JavaScript', 'HTML', 'CSS', 'Angular', 'Vue'].includes(s)),
           backend: detectedSkills.filter(s => ['Node.js', 'PostgreSQL', 'Express', 'Python', 'Java', 'C++', 'Go', 'SQL', 'Rust', 'Ruby', 'PHP', 'MongoDB'].includes(s)),
           infrastructure: detectedSkills.filter(s => ['Docker', 'AWS', 'Kubernetes', 'Azure', 'GCP'].includes(s)),
           core: ['System Architecture', 'Problem Solving']
        },
        summary: `A high-fidelity candidate manifesting deep proficiency across ${detectedSkills.slice(0, 3).join(', ')}. Signal strength indicates strong alignment with modern engineering protocols and architectural leadership.`,
        suggestions: [
           "Establish deeper nodes in Infrastructure as Code.",
           "Optimize profile for high-density leadership positions."
        ]
      }
    };
  },

  // 3. Skill Analyzer
  analyzeSkills: async (userSkills, jobRole) => {
    await delay(1500);
    
    // ── Rich role-specific skills map ──────────────────────────────────────
    const roleSkillsMap = {
      'Frontend Developer':      ['React', 'TypeScript', 'CSS', 'JavaScript', 'Next.js', 'Webpack', 'Redux', 'Tailwind', 'HTML', 'Vue'],
      'Backend Developer':       ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'REST API', 'Docker', 'Redis', 'GraphQL', 'Java', 'SQL'],
      'Full Stack Developer':    ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS', 'MongoDB', 'REST API', 'Next.js', 'Redis'],
      'Data Scientist':          ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'Statistics', 'R', 'Data Visualization'],
      'Machine Learning Engineer':['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'MLOps', 'Kubernetes', 'Scikit-learn', 'Docker', 'Spark'],
      'DevOps Specialist':       ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD', 'Linux', 'Ansible', 'Prometheus', 'Jenkins', 'Bash'],
      'Cloud Architect':         ['AWS', 'Azure', 'GCP', 'Kubernetes', 'Terraform', 'Docker', 'Networking', 'Security', 'Microservices', 'Cost Optimization'],
      'Cybersecurity Analyst':   ['Network Security', 'Penetration Testing', 'SIEM', 'Encryption', 'Linux', 'Python', 'Firewalls', 'SOC', 'Risk Assessment', 'Compliance'],
      'UI/UX Designer':          ['Figma', 'User Research', 'Prototyping', 'Wireframing', 'Design Systems', 'Adobe XD', 'Accessibility', 'CSS', 'HTML', 'Usability Testing'],
      'Mobile App Developer':    ['React Native', 'Swift', 'Kotlin', 'Flutter', 'iOS', 'Android', 'Firebase', 'REST API', 'TypeScript', 'App Store Optimization'],
      'Product Manager':         ['Roadmapping', 'Agile', 'Jira', 'User Stories', 'OKRs', 'Stakeholder Management', 'Data Analysis', 'A/B Testing', 'SQL', 'Go-to-Market'],
      'Database Administrator':  ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQL', 'Query Optimization', 'Backup & Recovery', 'Replication', 'Indexing', 'Oracle'],
      'QA Automation Engineer':  ['Selenium', 'Cypress', 'Jest', 'Python', 'API Testing', 'CI/CD', 'TestNG', 'Playwright', 'Performance Testing', 'SQL'],
      'Solutions Architect':     ['AWS', 'Microservices', 'System Design', 'Docker', 'Kubernetes', 'REST API', 'Security', 'SQL', 'Scalability', 'Cost Optimization'],
    };

    // ── Real course catalog with actual links ──────────────────────────────
    const courseLibrary = {
      'Python':            { title: 'Python for Everybody Specialization',     provider: 'Coursera (Michigan)', duration: '8 hrs',  level: 'Beginner',      link: 'https://www.coursera.org/specializations/python' },
      'Machine Learning':  { title: 'Machine Learning Specialization',         provider: 'Coursera (Stanford)', duration: '11 hrs', level: 'Intermediate',   link: 'https://www.coursera.org/specializations/machine-learning-introduction' },
      'TensorFlow':        { title: 'TensorFlow Developer Certificate',         provider: 'Coursera (DeepLearning.AI)', duration: '16 hrs', level: 'Advanced', link: 'https://www.coursera.org/professional-certificates/tensorflow-in-practice' },
      'PyTorch':           { title: 'Deep Learning with PyTorch',               provider: 'Udemy', duration: '17 hrs', level: 'Advanced',    link: 'https://www.udemy.com/course/pytorch-for-deep-learning/' },
      'Deep Learning':     { title: 'Deep Learning Specialization',             provider: 'Coursera (DeepLearning.AI)', duration: '18 hrs', level: 'Advanced', link: 'https://www.coursera.org/specializations/deep-learning' },
      'React':             { title: 'React - The Complete Guide 2024',          provider: 'Udemy', duration: '40 hrs', level: 'Intermediate',   link: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/' },
      'TypeScript':        { title: 'Understanding TypeScript',                 provider: 'Udemy', duration: '15 hrs', level: 'Intermediate',   link: 'https://www.udemy.com/course/understanding-typescript/' },
      'Node.js':           { title: 'Node.js, Express, MongoDB & More',        provider: 'Udemy', duration: '42 hrs', level: 'Intermediate',   link: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/' },
      'AWS':               { title: 'AWS Certified Solutions Architect',        provider: 'Udemy', duration: '27 hrs', level: 'Intermediate',   link: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/' },
      'Docker':            { title: 'Docker & Kubernetes: The Practical Guide', provider: 'Udemy', duration: '23 hrs', level: 'Intermediate',   link: 'https://www.udemy.com/course/docker-kubernetes-the-practical-guide/' },
      'Kubernetes':        { title: 'Kubernetes for the Absolute Beginners',    provider: 'Udemy', duration: '9 hrs',  level: 'Beginner',       link: 'https://www.udemy.com/course/learn-kubernetes/' },
      'Terraform':         { title: 'HashiCorp Certified Terraform Associate',  provider: 'Udemy', duration: '11 hrs', level: 'Intermediate',   link: 'https://www.udemy.com/course/terraform-beginner-to-advanced/' },
      'SQL':               { title: 'The Complete SQL Bootcamp',                provider: 'Udemy', duration: '9 hrs',  level: 'Beginner',       link: 'https://www.udemy.com/course/the-complete-sql-bootcamp/' },
      'PostgreSQL':        { title: 'SQL and PostgreSQL: The Complete Guide',   provider: 'Udemy', duration: '24 hrs', level: 'Intermediate',   link: 'https://www.udemy.com/course/sql-and-postgresql/' },
      'MongoDB':           { title: 'MongoDB - The Complete Developer\'s Guide', provider: 'Udemy', duration: '17 hrs', level: 'Intermediate',  link: 'https://www.udemy.com/course/mongodb-the-complete-developers-guide/' },
      'Figma':             { title: 'Figma UI UX Design Essentials',            provider: 'Udemy', duration: '11 hrs', level: 'Beginner',       link: 'https://www.udemy.com/course/figma-ux-ui-design-user-experience-tutorial-course/' },
      'Agile':             { title: 'Agile Project Management',                 provider: 'Coursera (Google)', duration: '6 hrs', level: 'Beginner', link: 'https://www.coursera.org/learn/agile-project-management' },
      'Selenium':          { title: 'Selenium WebDriver with Java - Basics to Advanced', provider: 'Udemy', duration: '28 hrs', level: 'Advanced', link: 'https://www.udemy.com/course/selenium-real-time-examplesinterview-questions/' },
      'CI/CD':             { title: 'GitHub Actions - The Complete Guide',      provider: 'Udemy', duration: '13 hrs', level: 'Intermediate',   link: 'https://www.udemy.com/course/github-actions-the-complete-guide/' },
      'Linux':             { title: 'Linux Command Line Basics',                provider: 'Udemy', duration: '6 hrs',  level: 'Beginner',       link: 'https://www.udemy.com/course/linux-command-line-volume1/' },
      'System Design':     { title: "System Design Interview: An Insider's Guide", provider: 'Educative.io', duration: '15 hrs', level: 'Advanced', link: 'https://www.educative.io/courses/grokking-the-system-design-interview' },
      'Microservices':     { title: 'Microservices with Node JS and React',     provider: 'Udemy', duration: '54 hrs', level: 'Advanced',       link: 'https://www.udemy.com/course/microservices-with-node-js-and-react/' },
      'Next.js':           { title: 'Next.js & React - The Complete Guide',     provider: 'Udemy', duration: '25 hrs', level: 'Intermediate',   link: 'https://www.udemy.com/course/nextjs-react-the-complete-guide/' },
      'Flutter':           { title: 'Flutter & Dart - The Complete Guide',      provider: 'Udemy', duration: '42 hrs', level: 'Intermediate',   link: 'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/' },
      'Scikit-learn':      { title: 'Machine Learning A-Z: AI, Python & R',    provider: 'Udemy', duration: '40 hrs', level: 'Intermediate',   link: 'https://www.udemy.com/course/machinelearning/' },
      'Statistics':        { title: 'Statistics for Data Science and Business', provider: 'Udemy', duration: '13 hrs', level: 'Beginner',       link: 'https://www.udemy.com/course/statistics-for-data-science-and-business-analysis/' },
      'Data Visualization':{ title: 'Data Visualization with Python',           provider: 'Coursera (IBM)', duration: '5 hrs', level: 'Intermediate', link: 'https://www.coursera.org/learn/python-for-data-visualization' },
      'GraphQL':           { title: 'GraphQL with React: The Complete Guide',   provider: 'Udemy', duration: '14 hrs', level: 'Advanced',       link: 'https://www.udemy.com/course/graphql-with-react-course/' },
      'Redis':             { title: 'Redis: The Complete Developer\'s Guide',   provider: 'Udemy', duration: '17 hrs', level: 'Advanced',       link: 'https://www.udemy.com/course/redis-the-complete-developers-guide-p/' },
      'Pandas':            { title: 'Data Analysis with Pandas and Python',     provider: 'Udemy', duration: '19 hrs', level: 'Intermediate',   link: 'https://www.udemy.com/course/data-analysis-with-pandas/' },
    };

    // ── Fallback generic course ──
    const genericCourse = (skill) => ({
      title: `Complete ${skill} Masterclass`,
      provider: 'Udemy',
      duration: '12 hrs',
      level: 'Intermediate',
      link: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`
    });

    // ── Match role to skills ──────────────────────────────────────────────
    let requiredSkills = roleSkillsMap[jobRole] || [];
    if (requiredSkills.length === 0) {
      // Fallback: search legacy industryData
      Object.values(industryData).forEach(industry => {
        if (industry.titles.includes(jobRole)) requiredSkills = industry.skills;
      });
    }
    if (requiredSkills.length === 0) {
      requiredSkills = ['React', 'Node.js', 'SQL', 'Docker', 'AWS'];
    }

    const normalizedUserSkills = userSkills.map(s => s.trim().toLowerCase());
    const matchedSkills = requiredSkills.filter(req => normalizedUserSkills.includes(req.toLowerCase()));
    const missingSkills = requiredSkills.filter(req => !normalizedUserSkills.includes(req.toLowerCase()));

    let matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);
    if (matchPercentage === 0 && userSkills.length > 0) matchPercentage = 15;
    else if (matchPercentage > 95) matchPercentage = 98;

    let seniority = 'INTERMEDIATE';
    if (matchPercentage > 75) seniority = 'LEADERSHIP';
    else if (matchPercentage < 40) seniority = 'FOUNDATIONAL';

    const phase1 = matchedSkills.length > 0 ? matchedSkills.slice(0, 5) : ['General Tech Literacy'];
    const phase2 = missingSkills.length > 0 ? missingSkills.slice(0, 4) : ['Advanced Tooling', 'System Design'];
    const phase3 = missingSkills.length > 4 ? missingSkills.slice(4, 7) : ['Enterprise Architecture', 'Team Leadership'];

    // ── Build up to 3 real course recommendations from top missing skills ──
    const recommendationTargets = missingSkills.length > 0 ? missingSkills.slice(0, 3) : requiredSkills.slice(0, 3);
    const recommendedAcademy = recommendationTargets.map(skill => ({
      skill,
      course: courseLibrary[skill] || genericCourse(skill),
      link: (courseLibrary[skill] || genericCourse(skill)).link,
    }));

    const radarData = [
       { subject: 'Core Frameworks', userScore: Math.min(100, matchedSkills.length * 30 + 10), required: 90 },
       { subject: 'Cloud & Deploy',  userScore: phase2.length < 3 ? 85 : 30, required: 85 },
       { subject: 'Architecture',    userScore: phase3.length < 3 ? 80 : 20, required: 95 },
       { subject: 'System Design',   userScore: matchPercentage > 80 ? 90 : 40, required: 80 },
       { subject: 'Tooling & CI/CD', userScore: matchPercentage > 60 ? 75 : 35, required: 70 },
    ];

    return {
      seniority,
      matchPercentage,
      summary: `Your profile alignment for ${jobRole} is calculated at ${matchPercentage}%. You have matched ${matchedSkills.length} out of ${requiredSkills.length} core required skills for this position based on real-world JobGrox market data.`,
      radarData,
      phases: { phase1, phase2, phase3 },
      recommendedAcademy,
    };
  },


  // 4. Insights Chart Data
  getDashboardInsights: async (userSkills = []) => {
    await delay(600);
    
    const hasSkills = userSkills && userSkills.length > 0;
    
    const summary = hasSkills
      ? `Your technical vector is highly aligned with enterprise scaling positions. Focus on strengthening ${userSkills[0]} pipelines to unlock Lead Architect roles.`
      : "Your technical vector is currently unmapped. Please upload a resume or add skills in the Analyzer to calibrate the intelligence nodes.";

    // Generate dynamic radar based on skills if available
    let dynamicRadar = [
      { subject: 'Technical', A: 130, fullMark: 150 }, 
      { subject: 'Leadership', A: 110, fullMark: 150 }, 
      { subject: 'Architecture', A: 85, fullMark: 150 }, 
      { subject: 'Cloud', A: 140, fullMark: 150 }, 
      { subject: 'Security', A: 90, fullMark: 150 }
    ];

    if (hasSkills) {
       dynamicRadar = [
          { subject: userSkills[0] || 'Core Dev', A: 140, fullMark: 150 },
          { subject: userSkills[1] || 'Design', A: 115, fullMark: 150 },
          { subject: userSkills[2] || 'System', A: 90, fullMark: 150 },
          { subject: 'Leadership', A: 110, fullMark: 150 },
          { subject: 'Agile', A: 100, fullMark: 150 }
       ];
    }

    return {
      personalizedSummary: summary,
      applicationsOverTime: [{ name: 'Mon', apps: 4 }, { name: 'Tue', apps: 8 }, { name: 'Wed', apps: 6 }, { name: 'Thu', apps: 12 }, { name: 'Fri', apps: 9 }],
      skillDistribution: dynamicRadar,
      topMetrics: { 
         totalSaved: hasSkills ? 156 : 12, 
         totalApplied: hasSkills ? 89 : 4, 
         interviews: hasSkills ? 12 : 0, 
         profileViews: hasSkills ? 842 : 45, 
         marketMatches: hasSkills ? 45 : 3, 
         atsScore: hasSkills ? 92 : 15 
      }
    };
  },

  // 4.5 Market Trends
  getMarketTrends: async () => {
    await delay(700);
    return [
      { name: 'Cloud Architect', demand: 890, salary: 35 },
      { name: 'Software Engineer', demand: 1245, salary: 24 },
      { name: 'DevOps Specialist', demand: 1100, salary: 30 },
      { name: 'Data Scientist', demand: 950, salary: 26 },
      { name: 'Product Manager', demand: 650, salary: 28 },
      { name: 'UI/UX Designer', demand: 540, salary: 18 }
    ];
  },

  // 5. Financial Ledger Mocks
  getFinancialLedger: async () => {
    await delay(800);
    return [
      { _id: 'b1', invoiceId: 'INV-JOB-001', createdAt: new Date().toISOString(), amount: 35000, feeType: 'percentage', feeValue: 8, status: 'Pending', jobId: { title: 'Staff Engineer' }, companyId: { name: 'Google' }, candidateId: { name: 'Sarah J.' } },
      { _id: 'b2', invoiceId: 'INV-JOB-002', createdAt: new Date().toISOString(), amount: 12000, feeType: 'fixed', feeValue: 12000, status: 'Paid', jobId: { title: 'Retail Lead' }, companyId: { name: 'Reliance Retail' }, candidateId: { name: 'Amit K.' } }
    ];
  },

  getFinancialAnalytics: async () => {
    await delay(800);
    return {
      stats: [{ _id: 1, totalRevenue: 128000 }, { _id: 2, totalRevenue: 450000 }, { _id: 3, totalRevenue: 320000 }],
      topCompanies: [{ name: 'Google', totalContributed: 240000 }, { name: 'Meta', totalContributed: 180000 }]
    };
  },

  // 6. Global Jobs Retrieval (Fallback for empty DB)
  getAllJobs: async (filters = {}) => {
    await delay(100); // Reduced delay for immediate feeling
    let results = [...jobsDB];

    if (filters.category && filters.category !== 'All') {
       results = results.filter(j => j.category === filters.category);
    }
    
    if (filters.search) {
       const q = filters.search.toLowerCase();
       results = results.filter(j => 
         j.title.toLowerCase().includes(q) || 
         j.company.toLowerCase().includes(q) ||
         j.category.toLowerCase().includes(q) ||
         j.skills.some(s => s.toLowerCase().includes(q))
       );
    }

    return results;
  },

  // 7. Get Single Job (For Details Page)
  getJobById: async (id) => {
    await delay(300);
    return jobsDB.find(j => j._id === id);
  },

  // 8. Candidates Feed (Mock Fallback for /candidates)
  getCandidates: async (filters = {}) => {
    await delay(100);
    let results = [...candidatesDB];

    if (filters.search) {
       const q = filters.search.toLowerCase();
       results = results.filter(c => 
         c.name.toLowerCase().includes(q) || 
         c.title.toLowerCase().includes(q) ||
         c.category.toLowerCase().includes(q) ||
         c.skills.some(s => s.toLowerCase().includes(q))
       );
    }

    if (filters.category && filters.category !== 'All') {
       results = results.filter(c => c.category === filters.category);
    }

    // Sort by experience loosely
    results.sort((a, b) => b.yearsExperience - a.yearsExperience);
    return results;
  },

  // 9. Match Candidates (Reverse AI match against a Job)
  matchCandidatesToJob: async (jobSkills = []) => {
    await delay(300);
    if (!jobSkills || jobSkills.length === 0) return candidatesDB.slice(0, 50);

    return candidatesDB.map(cand => {
      const matchCount = cand.skills.filter(skill => 
        jobSkills.some(jSkill => jSkill.toLowerCase() === skill.toLowerCase())
      ).length;
      
      let score = Math.round((matchCount / Math.max(jobSkills.length, 1)) * 100);
      if (score < 20) score = 15 + Math.floor(Math.random() * 25);
      
      return { ...cand, matchScore: score };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 100); // 100 top matches
  },

  // 10. Get Companies Database
  getCompanies: async (filters = {}) => {
    await delay(200);
    let results = [...companiesDB];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      results = results.filter(c => c.companyName.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q));
    }
    return results;
  },

  // 11. Get Single Company + Associated Jobs
  getCompanyById: async (id) => {
    await delay(300);
    const company = companiesDB.find(c => c._id === id) || companiesDB[0];
    const companyJobs = jobsDB.filter(j => j.company === company.companyName).slice(0, 4); // Show up to 4 mock jobs
    return { company, jobs: companyJobs };
  },

  // 12. Get Mock Notifications
  getMyNotifications: async () => {
    await delay(300);
    return [
      {
        _id: '65e1a2b3c4d5e6f7a8b9e001',
        message: 'Your application for Senior React Engineer has been securely transmitted.',
        type: 'Application',
        referenceId: '65e1a2b3c4d5e6f7a8b90001',
        referenceType: 'Job',
        senderName: 'Google',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
      },
      {
        _id: '65e1a2b3c4d5e6f7a8b9e002',
        message: 'Congratulations! You have been SELECTED for the position of Frontend Lead.',
        type: 'Selection',
        referenceId: '65e1a2b3c4d5e6f7a8b90002',
        referenceType: 'Job',
        senderName: 'Meta',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
      },
      {
        _id: '65e1a2b3c4d5e6f7a8b9e003',
        message: 'You have been invited to establish a direct link for the Cloud Architect node.',
        type: 'Invitation',
        referenceId: '65e1a2b3c4d5e6f7a8b90003',
        referenceType: 'Job',
        senderName: 'Amazon',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString()
      }
    ];
  },

  // 13. High-Fidelity Messaging Nodes
  getChatThreads: async () => {
    await delay(400);
    return [
      {
        _id: '65e1a2b3c4d5e6f7a8b9f001',
        participant: 'AI Career Agent',
        avatar: null,
        lastMessage: 'Your career vector is optimized for 94% alignment.',
        time: 'Just now',
        unread: 1,
        status: 'online',
        isAI: true
      },
      {
        _id: '65e1a2b3c4d5e6f7a8b9f002',
        participant: 'Hiring Manager @ Google',
        avatar: null,
        lastMessage: 'Are you available for a technical link-up tomorrow?',
        time: '14:20',
        unread: 0,
        status: 'online'
      },
      {
        _id: '65e1a2b3c4d5e6f7a8b9f003',
        participant: 'Recruiter @ Meta',
        avatar: null,
        lastMessage: 'The Selection Protocol has moved to the final phase.',
        time: 'Yesterday',
        unread: 0,
        status: 'offline'
      }
    ];
  },

  getChatHistory: async (threadId) => {
    await delay(300);
    const histories = {
      '65e1a2b3c4d5e6f7a8b9f001': [
        { sender: 'AI', text: 'Greeting prioritized. I have finished analyzing your latest resume upload.', time: '10:00 AM' },
        { sender: 'AI', text: 'Strategic Insight: Your cloud architecture nodes are performing at elite levels.', time: '10:02 AM' },
        { sender: 'AI', text: 'You should focus on optimizing your DevOps orchestration keywords.', time: '10:05 AM' }
      ],
      '65e1a2b3c4d5e6f7a8b9f002': [
        { sender: 'them', text: 'Hello Alex, we were impressed by your ATS optimization score.', time: '2:00 PM' },
        { sender: 'me', text: 'Thank you! I focus heavily on scalable architectural principles.', time: '2:15 PM' },
        { sender: 'them', text: 'Are you available for a technical link-up tomorrow?', time: '2:20 PM' }
      ]
    };
    return histories[threadId] || [
      { sender: 'them', text: 'Transmission established. How can we proceed with the integration?', time: 'Yesterday' }
    ];
  }
};
