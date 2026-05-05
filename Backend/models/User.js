const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  phone: String,
  dob: Date,             // date of birth
  age: Number,
  address: String,
  role: {
    type: String,
    enum: ["user", "candidate", "job_seeker", "company", "admin"],
    default: "user"
  },
  plan: { 
    type: String, 
    enum: ["free", "pro", "enterprise"],
    default: "free" 
  },
  experience: {
    type: Number,
    default: 0
  },
  location: String,
  skills: [String],
   resume: String,
   resumeText: String,    // Raw extracted payload for deep semantic matching
   resumeData: {
     atsScore: { type: Number, default: 0 },
     email: String,
     phone: String,
     title: String,
     skills: [String],
     experience: [{ title: String, company: String, duration: String, description: String }],
     education: [{ degree: String, university: String, year: String }],
     analysis: {
       executiveSummary: String,
       improvementTips: [{ label: String, tip: String }],
       gapAnalysis: {
         found: [String],
         missing: [String],
         score: Number
       },
       roleMapping: [String]
     }
   },
  desiredJobs: [String], // titles or categories the user is interested in
  savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  settings: {
    notifications: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false }
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumPlan: {
    type: String,
    enum: ['basic', 'professional', 'enterprise', null],
    default: null
  },
  premiumExpiry: {
    type: Date,
    default: null
  },
  companyTier: {
    type: String,
    enum: ["Free", "Premium", "Top", "Powerful"],
    default: "Free"
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  refreshToken: {
    type: String
  },
  banned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
