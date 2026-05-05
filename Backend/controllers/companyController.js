const Company = require("../models/Company");
const Job = require("../models/Job");
const mongoose = require("mongoose");

exports.createProfile = async (req, res) => {
  try {
    const { companyName, description, location, website } = req.body;
    const existing = await Company.findOne({ ownerId: req.user.id });
    if (existing) return res.status(400).json({ message: "Profile already exists" });
    const company = await Company.create({ companyName, description, location, website, ownerId: req.user.id });
    res.status(201).json(company);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await Company.findOne({ ownerId: req.user.id });
    res.json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.postJob = async (req, res) => {
  // this logic is already handled in jobController.createJob but we could keep helper
  return require("../controllers/jobController").createJob(req, res);
};

exports.editJob = async (req, res) => {
  return require("../controllers/jobController").updateJob(req, res);
};

exports.deleteJob = async (req, res) => {
  return require("../controllers/jobController").deleteJob(req, res);
};

exports.viewApplications = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
       return res.status(200).json([]); // Return empty list in sync mode
    }
    // Fetch all jobs owned by this employer first to optimize the application query
    const companyJobs = await Job.find({ employerId: req.user.id }).select("_id");
    const jobIds = companyJobs.map(j => j._id);

    // Fetch only relevant applications directly
    const applications = await require("../models/Application").find({ jobId: { $in: jobIds } })
      .populate('jobId', 'title category location salary')
      .populate('userId', 'name email skills location');

    res.json(applications);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.searchCandidates = async (req, res) => {
  try {
    if (!req.user || !req.user.isPremium) {
      return res.status(403).json({ message: "Premium subscription required for candidate discovery." });
    }

    const { keyword, location } = req.query;
    
    // Validate missing parameters as requested
    if (!keyword && !location) {
      return res.status(400).json({ 
        message: "Bad Request: Please provide at least one search parameter (keyword or location).",
        status: 400 
      });
    }

    if (mongoose.connection.readyState !== 1) {
       return res.status(503).json({ message: "Database nodes unreachable. Candidate discovery matrix is currently offline." });
    }

    const User = require("../models/User");
    const filter = {};
    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { skills: { $regex: keyword, $options: 'i' } }
      ];
    }
    if (location) filter.location = location;

    const candidates = await User.find(filter).select("name email skills location resume");
    res.json(candidates);
  } catch (err) {
    console.error("Search Candidates Error:", err);
    res.status(500).json({ 
      message: "An internal synchronization error occurred while scanning candidates.",
      error: err.message 
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
       return res.status(200).json({
          activeJobs: 0,
          totalApplicants: 0,
          hiredCandidates: 0,
          commissionPaid: 0,
          message: "Syncing DB..."
       });
    }
    const jobs = await Job.find({ employerId: req.user.id });
    const jobIds = jobs.map(j => j._id);

    const Application = require("../models/Application");
    // Find all applications associated with these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } }).populate("jobId");

    const activeJobs = jobs.filter(j => j.isApproved).length;
    const totalApplicants = applications.length;
    const hiredApplications = applications.filter(a => a.status === 'Hired');
    const hiredCandidates = hiredApplications.length;

    // Calculate sum dynamically from the populated jobId references or a fallback
    const commissionPaid = hiredApplications.reduce((sum, app) => {
       const fee = app.jobId && app.jobId.placementFee ? app.jobId.placementFee : 0;
       return sum + fee;
    }, 0);

    res.json({
      activeJobs,
      totalApplicants,
      hiredCandidates,
      commissionPaid
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(400).json({ message: err.message });
  }
};

// ─── PUBLIC BROWSING APIs ───────────────────────────────────────────────────

// List all companies
exports.getCompanies = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
       return res.status(503).json({ message: "Corporate directory offline. Heartbeat sync required." });
    }
    const companies = await Company.find({ isApproved: true })
      .select("companyName industry description logo location totalEmployees website")
      .sort({ createdAt: -1 });
    res.json(companies);
  } catch (err) {
    console.error("Get Companies Error:", err);
    res.status(500).json({ 
      message: "An error occurred while retrieving companies.",
      error: err.message 
    });
  }
};

// Single detail with populated jobs
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company profile not found" });

    // Fetch jobs for this company
    const jobs = await Job.find({ employerId: company.ownerId, isApproved: true });
    
    res.json({
      company,
      jobs
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Search across names and industries
exports.searchCompanies = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);

    if (mongoose.connection.readyState !== 1) {
       return res.status(503).json({ message: "Search synchronization failed. Primary nodes offline." });
    }

    const companies = await Company.find({
      isApproved: true,
      $or: [
        { companyName: { $regex: q, $options: 'i' } },
        { industry: { $regex: q, $options: 'i' } }
      ]
    }).limit(10);
    
    res.json(companies);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.inviteCandidate = async (req, res) => {
  try {
    const { candidateId, jobId, message } = req.body;
    const mongoose = require("mongoose");
    const Notification = require("../models/Notification");
    const Job = require("../models/Job");

    let statusMessage = message || `You have been invited to apply for a specialized role.`;
    let senderName = req.user.companyName || 'A Corporate Partner';

    // Offline Safety Fallback
    if (mongoose.connection.readyState !== 1) {
      console.log("[DEBUG] Core DB offline. Storing Invitation in Memory Matrix.");
      global.MOCK_DB_NOTIFICATIONS = global.MOCK_DB_NOTIFICATIONS || [];
      global.MOCK_DB_NOTIFICATIONS.push({
        _id: new mongoose.Types.ObjectId().toString(),
        recipient: candidateId,
        message: statusMessage,
        type: "Invitation",
        referenceId: jobId,
        referenceType: "Job",
        senderName: senderName,
        isRead: false,
        createdAt: new Date()
      });
      return res.status(200).json({ message: "Invitation signal transmitted to memory database." });
    }

    // DB Logic
    const job = await Job.findById(jobId);
    if (job) {
      statusMessage = `You have been invited by ${job.companyName} to apply for the ${job.title} position.`;
      senderName = job.companyName;
    }

    await Notification.create({
      recipient: candidateId,
      message: statusMessage,
      type: "Invitation",
      referenceId: jobId,
      referenceType: "Job",
      senderName: senderName
    });

    res.json({ message: "Workable invitation node established." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};