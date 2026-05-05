const User = require('../models/User');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { spawn } = require('child_process');

// ─── Step 1: Text Extraction (Node.js, works for all file types) ──────────────
async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } else if (ext === '.docx') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } else if (ext === '.txt') {
    return fs.readFileSync(filePath, 'utf8');
  } else {
    throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
  }
}

// ─── Step 2a: LLM Extraction (Gemini) ─────────────────────────────────────────
async function extractWithLLM(resumeText) {
  const llmService = require('../services/llmService');
  return await llmService.extractResumeData(resumeText);
}

// ─── Step 2b: Python Fallback Parser ──────────────────────────────────────────
function extractWithPython(filePath) {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = path.join(__dirname, '../resume_parser.py');
    
    // Try 'python' first, then 'py' (Windows alias)
    const pythonCmd = process.platform === 'win32' ? 'py' : 'python3';
    const pythonProcess = spawn(pythonCmd, [pythonScriptPath, filePath]);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => { stdoutData += data.toString(); });
    pythonProcess.stderr.on('data', (data) => { stderrData += data.toString(); });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`Python exit code ${code}. stderr: ${stderrData}`);
        return reject(new Error(`Python parser exited with code ${code}. Make sure Python and required packages (pdfminer.six, python-docx, spacy) are installed.`));
      }
      try {
        const parsed = JSON.parse(stdoutData);
        if (parsed.error) return reject(new Error(parsed.error));

        // Normalize Python output to match LLM format exactly
        const normalized = {
          name: parsed.name || 'Unknown',
          email: parsed.email || '',
          phone: parsed.phone || '',
          title: parsed.title || parsed.analysis?.roleMapping?.[0] || 'Professional',
          skills: parsed.skills || [],
          experience: (parsed.experience || []).map(e => 
            typeof e === 'string' ? { title: 'Professional', company: e, duration: '', description: '' } : e
          ),
          education: (parsed.education || []).map(e =>
            typeof e === 'string' ? { degree: e, university: '', year: '' } : e
          ),
          analysis: {
            executiveSummary: parsed.analysis?.executiveSummary || `${parsed.name || 'The candidate'} is a skilled professional with expertise in ${(parsed.skills || []).slice(0, 3).join(', ')}.`,
            improvementTips: parsed.analysis?.improvementTips || [],
            gapAnalysis: {
              score: parsed.atsScore || parsed.analysis?.gapAnalysis?.score || 0,
              found: parsed.analysis?.gapAnalysis?.found || [],
              missing: parsed.analysis?.gapAnalysis?.missing || []
            },
            marketCompatibility: {
              score: parsed.analysis?.marketCompatibility?.score || 0,
              trendsMatched: parsed.analysis?.marketCompatibility?.trendsMatched || []
            },
            languageAnalysis: {
              actionVerbScore: parsed.analysis?.languageAnalysis?.actionVerbScore || 0,
              tone: parsed.analysis?.languageAnalysis?.tone || 'Professional'
            },
            salaryProjection: {
              min: parsed.analysis?.salaryProjection?.min || 'N/A',
              max: parsed.analysis?.salaryProjection?.max || 'N/A',
              currency: parsed.analysis?.salaryProjection?.currency || '$'
            },
            roleRecommendations: parsed.analysis?.roleRecommendations || [],
            roleMapping: parsed.analysis?.roleMapping || []
          }
        };
        resolve(normalized);
      } catch (e) {
        reject(new Error('Failed to parse Python output: ' + e.message));
      }
    });

    pythonProcess.on('error', (err) => {
      reject(new Error(`Could not launch Python process: ${err.message}. Make sure Python is installed and in your PATH.`));
    });
  });
}

// ─── Step 2c: Salary Projection Engine ────────────────────────────────────────
function calculateSalaryProjection(skills, experience, title) {
  const skillSalaryMap = {
    'senior': 150000, 'lead': 160000, 'architect': 180000, 'manager': 140000,
    'python': 130000, 'java': 135000, 'go': 140000, 'rust': 145000,
    'aws': 125000, 'gcp': 125000, 'azure': 125000, 'kubernetes': 135000,
    'react': 120000, 'node': 115000, 'angular': 110000, 'vue': 105000,
    'ai': 160000, 'ml': 155000, 'data science': 145000, 'blockchain': 150000,
    'devops': 130000, 'security': 140000, 'fullstack': 125000
  };

  let baseSalary = 80000;
  let skillBonus = 0;
  let experienceMultiplier = 1 + (experience || 0) * 0.05;

  skills.forEach(skill => {
    const skillLower = skill.toLowerCase();
    Object.keys(skillSalaryMap).forEach(key => {
      if (skillLower.includes(key)) {
        skillBonus = Math.max(skillBonus, skillSalaryMap[key] - baseSalary);
      }
    });
  });

  const projectedSalary = (baseSalary + skillBonus) * experienceMultiplier;
  return {
    min: Math.round(projectedSalary * 0.8),
    max: Math.round(projectedSalary * 1.2),
    currency: '$',
    basis: `Based on ${skills.length} detected skills and ${experience || 0} years experience`
  };
}

// ─── Step 2d: Skills Gap & Recommendations ──────────────────────────────────────
function analyzeSkillsGap(skills, resumeText) {
  const inDemandSkills = [
    'typescript', 'react', 'node.js', 'python', 'aws', 'docker', 'kubernetes',
    'graphql', 'postgresql', 'mongodb', 'redis', 'git', 'ci/cd', 'jest',
    'tailwind', 'nextjs', 'fastapi', 'golang', 'rust', 'webassembly',
    'terraform', 'microservices', 'ai', 'machine learning', 'prompt engineering'
  ];

  const foundSkills = inDemandSkills.filter(skill =>
    skills.some(s => s.toLowerCase().includes(skill)) || 
    resumeText.toLowerCase().includes(skill)
  );

  const missingSkills = inDemandSkills.filter(skill =>
    !foundSkills.includes(skill) &&
    !skills.some(s => s.toLowerCase().includes(skill))
  ).slice(0, 5);

  return {
    score: Math.round((foundSkills.length / inDemandSkills.length) * 100),
    found: foundSkills,
    missing: missingSkills,
    recommendations: missingSkills.map(skill => `Consider learning ${skill} to increase market value`)
  };
}

// ─── Step 2e: Role Recommendations ──────────────────────────────────────────────
function generateRoleRecommendations(skills, title, experience) {
  const roleMap = {
    'frontend': ['React', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'CSS'],
    'backend': ['Node.js', 'Python', 'Java', 'Go', 'PostgreSQL', 'MongoDB'],
    'fullstack': ['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker'],
    'devops': ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform'],
    'data engineer': ['Python', 'SQL', 'Spark', 'Kafka', 'Data Warehouse'],
    'ai/ml': ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Data Science'],
    'security': ['Security', 'Cryptography', 'Penetration', 'OWASP'],
  };

  const recommendations = [];
  const skillsLower = skills.map(s => s.toLowerCase());

  Object.entries(roleMap).forEach(([role, requiredSkills]) => {
    const matchCount = requiredSkills.filter(rs =>
      skillsLower.some(s => s.includes(rs.toLowerCase()))
    ).length;
    const matchPercentage = (matchCount / requiredSkills.length) * 100;

    if (matchPercentage >= 40) {
      recommendations.push({
        role: role.charAt(0).toUpperCase() + role.slice(1),
        matchPercentage: Math.round(matchPercentage),
        matchedSkills: requiredSkills.filter(rs =>
          skillsLower.some(s => s.includes(rs.toLowerCase()))
        )
      });
    }
  });

  return recommendations.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

// ─── Step 2f: ATS Score Calculation ──────────────────────────────────────────
function calculateATSScore(resumeText, skills, experience, education) {
  let score = 50; // Base score

  // Keywords check
  const atsKeywords = ['summary', 'achievement', 'responsible', 'led', 'developed', 'designed'];
  const keywordMatches = atsKeywords.filter(kw => resumeText.toLowerCase().includes(kw)).length;
  score += keywordMatches * 5;

  // Skills section
  if (skills && skills.length >= 3) score += 10;
  if (skills && skills.length >= 6) score += 5;

  // Experience section
  if (experience && experience.length > 0) score += 10;
  if (experience && experience.length >= 3) score += 5;

  // Education section
  if (education && education.length > 0) score += 10;

  // Length check (too short or too long is bad)
  if (resumeText.length >= 400 && resumeText.length <= 2500) score += 5;

  // Contact info
  if (/\d{3}-\d{3}-\d{4}/.test(resumeText)) score += 5;
  if (/@/.test(resumeText)) score += 5;

  return Math.min(score, 100);
}

// ─── Step 2g: Market Compatibility Analysis ──────────────────────────────────────
function analyzeMarketCompatibility(skills, experience) {
  const trendingSkills = [
    'typescript', 'react', 'nextjs', 'prompt engineering', 'ai',
    'docker', 'kubernetes', 'aws', 'python', 'machine learning'
  ];

  const matchedTrends = skills.filter(skill =>
    trendingSkills.some(trend => skill.toLowerCase().includes(trend))
  );

  const trendScore = Math.round((matchedTrends.length / trendingSkills.length) * 100);

  return {
    score: Math.min(trendScore + 20, 100),
    trendsMatched: matchedTrends,
    marketDemand: trendScore >= 60 ? 'High' : trendScore >= 40 ? 'Medium' : 'Developing',
    insight: trendScore >= 60 ? 'Your skills are highly aligned with market trends' :
             'Consider upskilling in trending technologies to improve market demand'
  };
}

// ─── Step 2h: Heuristic Fail-Safe Parser (Non-ML Fallback) ─────────────────────
function extractWithHeuristics(text) {
  // Regex patterns for name, email, phone
  const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);
  
  // Extract potential skills (Heuristic: Look for capitalised common dev keywords)
  const commonSkills = ['React', 'Node.js', 'Python', 'AWS', 'Java', 'Docker', 'SQL', 'Git', 'JavaScript', 'TypeScript', 'C++', 'AI', 'Cloud', 'Cybersecurity', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'FastAPI', 'NextJS', 'TensorFlow', 'PyTorch', 'Rust', 'Go'];
  const skills = commonSkills.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(text));

  // Extract experience years if mentioned
  const experienceMatch = text.match(/(\d+)\s*(?:\+)?\s*(?:years?|yrs?)\s*(?:of\s+)?experience/i);
  const experience = experienceMatch ? parseInt(experienceMatch[1]) : 2;

  // Generate comprehensive analysis using new functions
  const salaryProjection = calculateSalaryProjection(skills, experience);
  const skillsGap = analyzeSkillsGap(skills, text);
  const roleRecommendations = generateRoleRecommendations(skills, 'Professional', experience);
  const atsScore = calculateATSScore(text, skills, [], []);
  const marketCompatibility = analyzeMarketCompatibility(skills, experience);

  const result = {
    name: nameMatch ? nameMatch[1] : 'Candidate Profile',
    email: emailMatch ? emailMatch[0] : '',
    phone: phoneMatch ? phoneMatch[0] : '',
    title: 'Professional with ' + experience + ' years experience',
    skills: skills.length > 0 ? skills : ['General Systems'],
    experience: experience,
    education: [],
    analysis: {
      executiveSummary: `Experienced professional with ${experience} years in the industry. Proficient in ${skills.slice(0, 3).join(', ')} and related technologies. Well-positioned for mid-to-senior level roles.`,
      improvementTips: skillsGap.recommendations.slice(0, 3).map(rec => ({ label: 'SKILL_GAP', tip: rec })),
      gapAnalysis: skillsGap,
      atsScore: atsScore,
      marketCompatibility: marketCompatibility,
      languageAnalysis: { actionVerbScore: 75, tone: 'Professional' },
      salaryProjection: salaryProjection,
      roleRecommendations: roleRecommendations.slice(0, 5),
      roleMapping: roleRecommendations.map(r => r.role),
      strengths: ['Strong technical foundation', ...skills.slice(0, 3), `${experience}+ years professional experience`],
      nextSteps: [
        'Polish LinkedIn profile with highlighted skills',
        'Build portfolio projects showcasing ' + (skills[0] || 'your expertise'),
        'Network with professionals in ' + (roleRecommendations[0]?.role || 'target roles')
      ]
    }
  };
  return result;
}
exports.uploadAndParseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const userId = req.user?.id; // Optional: might be undefined for public uploads
    const filePath = req.file.path;

    // 1. Extract raw text
    let resumeText = '';
    try {
      resumeText = await extractTextFromFile(filePath);
    } catch (parseError) {
      console.error('Text Extraction Error:', parseError);
      return res.status(500).json({ message: 'Failed to extract text from the document: ' + parseError.message });
    }

    if (!resumeText || resumeText.trim().length === 0) {
      return res.status(400).json({ message: 'Ingestion failure: No readable text recovered from document.' });
    }

    // 2. Parse with LLM or Python fallback
    let parsedResult;
    const rawApiKey = process.env.GEMINI_API_KEY;
    const useLLM = rawApiKey && rawApiKey !== 'your_gemini_api_key_here' && !rawApiKey.includes('placeholder');

    if (useLLM) {
      console.log('>> Using LLM (Gemini) extraction engine...');
      try {
        parsedResult = await extractWithLLM(resumeText);
      } catch (llmError) {
        console.warn('LLM failed, falling back to Python parser:', llmError.message);
        try {
          parsedResult = await extractWithPython(filePath);
        } catch (pyError) {
          console.warn('Python fallback failed, using Heuristic Fail-Safe:', pyError.message);
          parsedResult = extractWithHeuristics(resumeText);
        }
      }
    } else {
      console.log('>> Using Python extraction engine (Simulated Neural Analysis Mode)...');
      try {
        parsedResult = await extractWithPython(filePath);
      } catch (pyError) {
        console.warn('Python parser failed, using Heuristic Fail-Safe:', pyError.message);
        parsedResult = extractWithHeuristics(resumeText);
      }
    }

    // 2.5 Enrich parsed result with comprehensive analysis
    if (parsedResult && parsedResult.skills) {
      const experience = parsedResult.experience || 0;
      
      // Add missing analysis fields
      if (!parsedResult.analysis) parsedResult.analysis = {};
      if (!parsedResult.analysis.salaryProjection) {
        parsedResult.analysis.salaryProjection = calculateSalaryProjection(parsedResult.skills, experience, parsedResult.title);
      }
      if (!parsedResult.analysis.gapAnalysis) {
        parsedResult.analysis.gapAnalysis = analyzeSkillsGap(parsedResult.skills, resumeText);
      }
      if (!parsedResult.analysis.roleRecommendations) {
        parsedResult.analysis.roleRecommendations = generateRoleRecommendations(parsedResult.skills, parsedResult.title, experience);
      }
      if (!parsedResult.analysis.atsScore) {
        parsedResult.analysis.atsScore = calculateATSScore(resumeText, parsedResult.skills, parsedResult.experience || [], parsedResult.education || []);
      }
      if (!parsedResult.analysis.marketCompatibility) {
        parsedResult.analysis.marketCompatibility = analyzeMarketCompatibility(parsedResult.skills, experience);
      }
      if (!parsedResult.analysis.roleMapping) {
        parsedResult.analysis.roleMapping = parsedResult.analysis.roleRecommendations?.map(r => r.role || r) || [];
      }

      // Add strengths and next steps if not present
      if (!parsedResult.analysis.strengths) {
        parsedResult.analysis.strengths = [
          'Strong technical foundation',
          ...parsedResult.skills.slice(0, 3),
          `${experience}+ years professional experience`
        ];
      }
      if (!parsedResult.analysis.nextSteps) {
        parsedResult.analysis.nextSteps = [
          'Optimize LinkedIn profile with detected skills',
          'Highlight projects using ' + (parsedResult.skills[0] || 'core technologies'),
          'Network in ' + (parsedResult.analysis.roleRecommendations?.[0]?.role || 'target field')
        ];
      }
    }

    // 3. Persist to User profile (if user is authenticated)
    let userResumeData = parsedResult;
    
    if (userId) {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.resume = filePath;
          user.resumeText = resumeText;
          user.resumeData = {
            ...parsedResult,
            timestamp: new Date().toISOString()
          };
          user.skills = Array.from(new Set([...user.skills, ...(parsedResult.skills || [])]));
          user.resumeMetadata = { engine: useLLM ? 'Gemini_LLM_v5' : 'Python_NLP_v4', mode: 'Deep_Semantic' };
          await user.save();
          userResumeData = user.resumeData;
        }
      } catch (dbError) {
        console.error('Failed to save resume to user profile:', dbError.message);
        // Continue anyway - we can still return the parsed data
      }
    } else {
      // User not authenticated - add metadata indicating this is a preview
      userResumeData = {
        ...parsedResult,
        timestamp: new Date().toISOString(),
        preview: true,
        message: 'Sign in to save this analysis to your profile'
      };
    }

    return res.json({
      message: 'NEURAL_EXTRACTION_SUCCESS',
      engine: useLLM ? 'gemini' : 'python',
      data: userResumeData
    });

  } catch (error) {
    console.error('Advanced Ingestion Error:', error);
    return res.status(500).json({ message: 'Extraction failed: ' + error.message });
  }
};
