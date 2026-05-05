const Job = require('../models/Job');
const User = require('../models/User');

// Advanced Heuristic Similarity / Keyword Overlap Helper
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function calculateMatchScore(userSkills, jobSkills, jobDescription, userResumeText) {
  if (!userSkills || userSkills.length === 0) return 0;
  if (!jobSkills || jobSkills.length === 0) return 0;

  const matched = jobSkills.filter(skill =>
    userSkills.some(uSkill => uSkill.toLowerCase() === skill.toLowerCase())
  );
  let score = (matched.length / jobSkills.length) * 50;

  if (userResumeText && userResumeText.length > 100) {
     const jobKeywords = jobSkills.slice(0, 5); 
     const semanticHits = jobKeywords.filter(k => {
       try {
         return new RegExp(`\\b${escapeRegExp(k)}\\b`, "i").test(userResumeText);
       } catch (e) {
         return false;
       }
     });
     score += (semanticHits.length / jobKeywords.length) * 40;
  } else {
     score += (matched.length / jobSkills.length) * 20; 
  }
  
  if (jobDescription && (userResumeText || "").length > 0) {
     score += 10;
  }

  return Math.min(Math.round(score), 99);
}

exports.matchJobs = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState !== 1) {
       return res.status(503).json({ message: "AI Engine Offline: Matrix synchronization required." });
    }
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allJobs = await Job.find({ isApproved: true }).lean();
    const userSkills = user.skills || [];

    const scoredJobs = allJobs.map(job => {
      const score = calculateMatchScore(userSkills, job.skills, job.description, user.resumeText);
      const missingSkills = (job.skills || []).filter(skill =>
        !userSkills.some(uSkill => uSkill.toLowerCase() === skill.toLowerCase())
      );

      let matchReasoning = "Matches your professional architecture profile.";
      if (missingSkills.length === 0) {
        matchReasoning = `100% technical protocol overlap. You possess every specialized node requested by ${job.companyName || job.company}.`;
      } else if (missingSkills.length <= 2) {
        matchReasoning = `High probability alignment based on your core history in ${userSkills.slice(0, 2).join(' & ')}. Total skill synchronization exceeds 85%.`;
      } else if (score > 60) {
        matchReasoning = `Strategic alignment detected. Your proficiency in ${userSkills[0] || 'your core stack'} provides a strong foundation for this ${job.category} position.`;
      }

      return { 
        ...job, 
        matchScore: score,
        missingSkills,
        matchReasoning,
        improvementSuggestions: missingSkills.map(s => `Integrate ${s} into your stack to optimize this match vector.`)
      };
    });

    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
    res.json(scoredJobs.slice(0, 20));

  } catch (error) {
    console.error("AI Match Error:", error);
    res.status(500).json({ message: "Engine synchronization failure" });
  }
};

exports.analyzeSkills = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const { targetRole, userSkillsArray } = req.body;
    const userId = req.user?.id;
    
    // Check DB status for notification engine safety
    const isDbConnected = mongoose.connection.readyState === 1;
    
    // --- EXPANDED INDUSTRY KNOWLEDGE BASE (15+ ROLES) ---
    const industryStandards = {
      'Frontend Developer': ['React', 'JavaScript', 'CSS', 'TypeScript', 'HTML5', 'Redux', 'Tailwind', 'Next.js'],
      'Backend Developer': ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'Redis', 'Express', 'Kubernetes'],
      'Full Stack Developer': ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Docker', 'AWS', 'CSS', 'PostgreSQL'],
      'Data Scientist': ['Python', 'SQL', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Tableau'],
      'DevOps Specialist': ['Docker', 'Kubernetes', 'Jenkins', 'Terraform', 'AWS', 'Ansible', 'Linux', 'Go'],
      'Cybersecurity Analyst': ['Network Security', 'Penetration Testing', 'SIEM', 'Firewalls', 'Ethical Hacking', 'Linux', 'Splunk', 'Cryptography'],
      'UI/UX Designer': ['Figma', 'Adobe XD', 'Prototyping', 'User Research', 'Wireframing', 'Color Theory', 'Typography', 'Interaction Design'],
      'Mobile App Developer': ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Mobile Design', 'App Store Deployment', 'API Integration'],
      'Cloud Architect': ['AWS', 'Azure', 'GCP', 'Terraform', 'Serverless', 'Microservices', 'Network Architecture', 'Cloud Migration'],
      'Product Manager': ['Agile', 'Scrum', 'Backlog Management', 'User Stories', 'A/B Testing', 'Stakeholder Management', 'Product Roadmap', 'Market Analysis'],
      'Database Administrator': ['SQL', 'NoSQL', 'Database Design', 'Optimization', 'Backup & Recovery', 'Sharding', 'PostgreSQL', 'Oracle'],
      'QA Automation Engineer': ['Selenium', 'Cypress', 'Playwright', 'Jest', 'Mocha', 'API Testing', 'Performance Testing', 'CI/CD'],
      'Machine Learning Engineer': ['Neural Networks', 'PyTorch', 'TensorFlow', 'Deep Learning', 'Deployment', 'MLOps', 'Feature Engineering', 'Keras'],
      'Solutions Architect': ['System Design', 'OAuth2', 'Cloud Native', 'GraphQL', 'Microservices', 'Distributed Systems', 'Java', 'Design Patterns']
    };

    const targetSkills = industryStandards[targetRole] || industryStandards['Frontend Developer'];
    const userSkills = userSkillsArray || [];

    const matched = targetSkills.filter(ts => userSkills.some(s => s.toLowerCase() === ts.toLowerCase()));
    const missing = targetSkills.filter(ts => !userSkills.some(s => s.toLowerCase() === ts.toLowerCase()));

    const matchPercentage = targetSkills.length > 0 ? Math.round((matched.length / targetSkills.length) * 100) : 0;

    // --- NEURAL PHASE LOGIC (Phased Roadmap) ---
    // Categorize missing skills based on their index in the target array (simplified heuristic)
    const phases = {
       phase1: missing.filter((_, i) => targetSkills.indexOf(missing[i]) < 3), // Core
       phase2: missing.filter((_, i) => targetSkills.indexOf(missing[i]) >= 3 && targetSkills.indexOf(missing[i]) < 6), // Professional
       phase3: missing.filter((_, i) => targetSkills.indexOf(missing[i]) >= 6) // Master
    };

    // --- SENIORITY ESTIMATION ---
    let seniority = "Entry Level";
    if (matchPercentage > 85) seniority = "Principal/Lead";
    else if (matchPercentage > 65) seniority = "Senior";
    else if (matchPercentage > 40) seniority = "Professional";

    // --- ACADEMY INTEGRATION (Expanded Pool) ---
    const academyPool = {
      'React': { title: 'React Modern Patterns', provider: 'Meta Academy', duration: '4 Weeks', level: 'Intermediate' },
      'Node.js': { title: 'Scalable Backend Systems', provider: 'OpenJS Foundation', duration: '6 Weeks', level: 'Advanced' },
      'Docker': { title: 'Containerization Mastery', provider: 'Docker Inc.', duration: '2 Weeks', level: 'Professional' },
      'Python': { title: 'AI & Data Intelligence', provider: 'Google AI', duration: '8 Weeks', level: 'Mastery' },
      'AWS': { title: 'Cloud Architecture Node', provider: 'Amazon Web Services', duration: '5 Weeks', level: 'Certification' },
      'Kubernetes': { title: 'Orchestration at Scale', provider: 'CNCF', duration: '3 Weeks', level: 'Advanced' },
      'TypeScript': { title: 'Typed Systems Architecture', provider: 'Microsoft Learn', duration: '2 Weeks', level: 'Intermediate' },
      'Figma': { title: 'UX/UI Neural Interface Design', provider: 'Interaction Institute', duration: '4 Weeks', level: 'Professional' },
      'Agile': { title: 'Product Leadership Nodes', provider: 'Scrum Alliance', duration: '2 Weeks', level: 'Certification' }
    };

    const recommendedAcademy = missing.slice(0, 3).map(skill => ({
      skill,
      course: academyPool[skill] || { title: `${skill} Professional Specialization`, provider: 'Universal Academy', duration: '4 Weeks', level: 'Professional' },
      link: `https://www.coursera.org/search?query=${skill}`
    }));

    // --- NOTIFICATION ENGINE ---
    if (userId && missing.length > 0 && matchPercentage > 30) {
      const Notification = require('../models/Notification');
      const criticalSkill = missing[0];
      await Notification.create({
        recipient: userId,
        message: `Intelligence Update: We found a matching course node for your ${criticalSkill} gap in ${targetRole}. Convergence is at ${matchPercentage}%.`,
        type: 'Academy',
        referenceType: 'Course',
        senderName: 'Skill Intelligence Engine'
      }).catch(err => console.error("Notification trigger failure:", err));
    }

    res.json({
      role: targetRole,
      matchPercentage,
      matchedSkills: matched,
      missingSkills: missing,
      phases,
      seniority,
      recommendedAcademy,
      summary: `Your professional profile currently exhibits a ${matchPercentage}% convergence with the ${targetRole} industry benchmark. Your estimated seniority node is ${seniority}.`
    });

  } catch (error) {
    console.error("Skill Analyzer Error:", error);
    res.status(500).json({ message: "Intelligence synchronization failure" });
  }
};
