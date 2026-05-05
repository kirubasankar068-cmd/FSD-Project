const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

// Validate API Key presence
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.warn("WARNING: process.env.GEMINI_API_KEY is not set. The LLM parsing service will fail if not provided in production.");
}

const genAI = new GoogleGenerativeAI(apiKey || 'mock-key-for-dev');

const geminiSchema = {
  type: SchemaType.OBJECT,
  properties: {
    name: { type: SchemaType.STRING, description: "Candidate name. Try to extract it from the top." },
    email: { type: SchemaType.STRING, description: "Candidate email" },
    phone: { type: SchemaType.STRING, description: "Candidate phone number" },
    title: { type: SchemaType.STRING, description: "Candidate professional title (e.g. Software Engineer, Operations Manager)" },
    skills: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Comprehensive list of technical and soft skills."
    },
    experience: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          company: { type: SchemaType.STRING },
          duration: { type: SchemaType.STRING },
          description: { type: SchemaType.STRING }
        }
      }
    },
    education: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          degree: { type: SchemaType.STRING },
          university: { type: SchemaType.STRING },
          year: { type: SchemaType.STRING }
        }
      }
    },
    analysis: {
      type: SchemaType.OBJECT,
      properties: {
        executiveSummary: { 
            type: SchemaType.STRING, 
            description: "A dynamic, neural-style summary of the candidate's profile in 1-2 sentences. E.g. 'Jane is an Expert technical node specializing in React and Node.js...'" 
        },
        improvementTips: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              label: { type: SchemaType.STRING, description: "Categorization label, e.g., CRITICAL, OPTIMAL, SUGGESTION" },
              tip: { type: SchemaType.STRING, description: "The actual advice or insight" }
            }
          }
        },
        gapAnalysis: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.INTEGER, description: "Estimated ATS or Match Score out of 100 based on standard industry profiles." },
            found: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Core skills found that align to a standard primary profile." },
            missing: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Core skills missing from a standard primary profile." }
          }
        },
        marketCompatibility: {
          type: SchemaType.OBJECT,
          properties: {
            score: { type: SchemaType.INTEGER, description: "Percentage score (0-100) of how well the resume aligns with current global industry trends." },
            trendsMatched: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Hot trends identified in the resume (e.g., AI/ML, Cloud-Native, Remote-Sync, etc.)" }
          }
        },
        languageAnalysis: {
          type: SchemaType.OBJECT,
          properties: {
            actionVerbScore: { type: SchemaType.INTEGER, description: "Score (0-100) based on the usage of strong, professional action verbs." },
            tone: { type: SchemaType.STRING, description: "Primary professional tone (e.g., Authoritative, Collaborative, Analytical)." }
          }
        },
        salaryProjection: {
          type: SchemaType.OBJECT,
          properties: {
            min: { type: SchemaType.STRING, description: "Estimated lower bound annual salary" },
            max: { type: SchemaType.STRING, description: "Estimated upper bound annual salary" },
            currency: { type: SchemaType.STRING, description: "Currency symbol or code (e.g. $, ₹, £)" }
          }
        },
        roleRecommendations: {
            type: SchemaType.ARRAY,
            items: { type: SchemaType.STRING },
            description: "Up to 3 specific job roles the candidate is highly qualified for next."
        },
        roleMapping: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING },
          description: "List of role-organization mappings. E.g. 'Software Engineer @ Google'"
        }
      }
    }
  },
  required: ["name", "title", "skills", "analysis", "experience"]
};

exports.extractResumeData = async (resumeText) => {
  // If no API key is provided, gracefully fallback or error
  if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY_MISSING: Cannot extract resume vector using LLM mode.");
  }

  // Get the appropriate model, enforcing JSON structure
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash", 
    generationConfig: {
        responseMimeType: "application/json",
        responseSchema: geminiSchema,
    }
  });

  const prompt = `
    You are an advanced Neural Resume Extraction Engine. 
    Analyze the raw text extracted from a resume below and populate the structured JSON data accurately.
    In addition to extraction, provide a deep intelligence analysis:
    1. Market Compatibility: Score the resume against 2024-2025 industry trends.
    2. Language Analysis: Evaluate the 'Action Verb' density and overall professional tone.
    3. Salary Projection: Based on experience and role, estimate a realistic market salary range.
    4. Role Recommendations: Suggest 3 career-advancing roles.
    
    Resume Text:
    ${resumeText}
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseBody = await result.response.text();
    const parsedJSON = JSON.parse(responseBody);
    return parsedJSON;
  } catch (error) {
    console.error("LLM Extraction Failure:", error);
    throw new Error("Failed to process resume logic through the Neural Engine.");
  }
};
