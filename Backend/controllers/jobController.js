const Job = require("../models/Job");
const Company = require("../models/Company");
const User = require("../models/User");
const mongoose = require("mongoose");

// --- CREATE JOB NODE ---
exports.createJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Enforce Tier Limits
    const jobCount = await Job.countDocuments({ employerId: req.user.id });
    if (user.companyTier === 'Free' && jobCount >= 3) {
      return res.status(403).json({ message: "TIER_LIMIT: Free plan restricted to 3 active job nodes." });
    }
    if (user.companyTier === 'Premium' && jobCount >= 20) {
      return res.status(403).json({ message: "TIER_LIMIT: Premium plan restricted to 20 active job nodes." });
    }

    // Initialize Corporate Identity if missing
    let company = await Company.findOne({ ownerId: req.user.id });
    if (!company) {
       company = await Company.create({
          companyName: user.name || "Enterprise Partner",
          ownerId: req.user.id,
          description: "Auto-initialized corporate profile."
       });
    }

    // Extract numeric salary for automated brokerage calculation
    const salaryStr = req.body.salary || "";
    let salaryNum = 0;
    const matches = salaryStr.match(/(\d+)/g);
    if (matches && matches.length > 0) {
      // Get the highest number (e.g. "18-24 LPA" -> 24)
      const val = parseInt(matches[matches.length - 1]);
      // If LPA (Lakhs Per Annum), multiply by 100k
      if (salaryStr.toUpperCase().includes("LPA")) {
        salaryNum = val * 100000;
      } else {
        salaryNum = val;
      }
    }

    const payload = { 
      ...req.body, 
      salaryNum: salaryNum || 0,
      employerId: req.user.id,
      companyId: company._id,
      company: company.companyName,
      approvalStatus: "Pending", // Require Admin clearance
      isApproved: false
    };

    const job = await Job.create(payload);
    
    res.status(201).json({
       message: "Transmission initialized. Pending Admin clearance protocol.",
       job
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- LIST JOBS (CANDIDATE VIEW) ---
exports.getJobs = async (req, res) => {
  try {
    const filter = { approvalStatus: "Approved", isApproved: true };
    const queryStr = req.query.q || "";
    
    if (queryStr) {
      // Escape special characters for safe regex search
      const safeQuery = queryStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: safeQuery, $options: "i" } },
        { company: { $regex: safeQuery, $options: "i" } }
      ];
    }

    const jobs = await Job.find(filter)
      .sort({ createdAt: -1 })
      .populate("employerId", "name isVerified companyTier");

    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: "Job Engine Synchronization Failure" });
  }
};

// --- LIST JOBS (EMPLOYER VIEW) ---
exports.getCompanyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employerId: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- UPDATE JOB ---
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job node not found" });

    if (req.user.role !== 'admin' && job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    Object.assign(job, req.body);
    // If employer edits, reset approval (optional policy)
    if (req.user.role !== 'admin') {
       job.approvalStatus = "Pending";
       job.isApproved = false;
    }
    
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (req.user.role !== 'admin' && job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    await Job.deleteOne({ _id: req.params.id });
    res.json({ message: "Job node purged." });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("employerId", "name email isVerified companyTier");
    if (!job) return res.status(404).json({ message: "Job node not found" });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
