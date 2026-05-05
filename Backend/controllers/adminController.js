const User = require("../models/User");
const Job = require("../models/Job");
const Company = require("../models/Company");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");

// --- SYSTEM ANALYTICS ---
exports.stats = async (req, res) => {
  try {
    const users = await User.countDocuments({ role: { $ne: 'admin' } });
    const companies = await User.countDocuments({ role: 'company' });
    const candidates = await User.countDocuments({ role: { $in: ['candidate', 'job_seeker', 'user'] } });
    const jobs = await Job.countDocuments();
    const approvedJobs = await Job.countDocuments({ approvalStatus: 'Approved' });
    
    res.json({ 
      users, 
      companies, 
      candidates,
      jobs, 
      approvedJobs,
      liveApplications: 142 
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --- USER MANAGEMENT ---
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Entity purged from system." });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.banned = !user.banned;
    await user.save();
    res.json({ message: `User ${user.banned ? 'banned' : 'unbanned'}`, user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --- COMPANY MODERATION ---
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await User.find({ role: 'company' }).select("-password");
    res.json(companies);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.approveCompany = async (req, res) => {
  try {
    const { tier, isVerified } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Entity not found" });

    user.companyTier = tier || user.companyTier;
    user.isVerified = isVerified !== undefined ? isVerified : user.isVerified;
    await user.save();

    await Notification.create({
      recipient: user._id,
      message: `Profile Update: Your corporate node has been upgraded to ${user.companyTier} status.`,
      type: "System",
      senderName: "Admin Command"
    });

    res.json({ message: "Corporate status synchronized", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Company purged" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --- JOB MODERATION ---
exports.approveJob = async (req, res) => {
  try {
    const { status } = req.body; // Approved / Rejected
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job node not found" });

    job.approvalStatus = status || "Approved";
    job.isApproved = job.approvalStatus === "Approved";
    await job.save();

    res.json({ message: `Job node ${job.approvalStatus.toLowerCase()}`, job });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.rejectJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    job.approvalStatus = "Rejected";
    job.isApproved = false;
    await job.save();
    res.json({ message: "Job rejected", job });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("employerId", "name email isVerified companyTier");
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --- FINANCIAL MONITORING ---
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSystemNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("recipient", "name email role")
      .populate("jobId", "title")
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(notifications);
  } catch (err) {
    console.error(">> NOTIFICATION_FETCH_ERROR:", err);
    res.status(400).json({ message: "Notification sync failure", error: err.message });
  }
};