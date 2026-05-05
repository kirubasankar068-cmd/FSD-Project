const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// note: register and login are already in authController, so here we handle profile and other user actions

exports.getProfile = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState !== 1) {
       return res.status(503).json({ message: "Database Instance Offline. Sync unavailable." });
    }
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Core sync failed. Portfolio data retrieval interrupted.", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const mongoose = require("mongoose");
    if (mongoose.connection.readyState !== 1) {
       return res.status(200).json(req.body); // Mock success for offline mode
    }
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowed = [
      "name", "phone", "dob", "age", "address", "location", "skills", "experience",
      "desiredJobs", "resume", "role", "companyName", "companyDescription", "companyWebsite", "settings"
    ];

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        user[key] = req.body[key];
      }
    });

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    // assume multer middleware stored file path in req.file.path
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const user = await User.findById(req.user.id);
    user.resume = req.file.path; // or URL if using cloud storage
    await user.save();
    res.json({ message: "Resume uploaded", resume: user.resume });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.saveJob = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { jobId } = req.body;
    if (!user.savedJobs.includes(jobId)) {
      user.savedJobs.push(jobId);
      await user.save();
    }
    res.json({ message: "Job saved" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedJobs");
    res.json(user.savedJobs);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const Application = require("../models/Application");
    const applications = await Application.find({ userId: req.user.id }).populate("jobId");
    res.json(applications);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.upgradePremium = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.isPremium = true;
    user.premiumPlan = req.body.planType;
    user.premiumExpiry = req.body.expiry;
    await user.save();
    res.json({ message: "Upgraded to premium", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const mongoose = require("mongoose");
    
    if (mongoose.connection.readyState !== 1) {
       const userNotifs = (global.MOCK_DB_NOTIFICATIONS || []).filter(n => n.recipient === userId || n.recipient === userId.toString());
       return res.json(userNotifs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }

    const Notification = require("../models/Notification");
    const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
    console.log(`[DEBUG] Transmitted ${notifications.length} notification nodes for user ${userId}`);
    res.json(notifications);
  } catch (err) {
    console.error("Get Notifications Error [DETAILED_TRACE]:", err.message, err.stack);
    res.status(500).json({ message: "Communication matrix sync failed.", error: err.message });
  }
};
