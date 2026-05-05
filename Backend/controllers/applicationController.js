const Application = require("../models/Application");
const Brokerage = require("../models/Brokerage");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const User = require("../models/User");
const mongoose = require("mongoose");

// --- JOB APPLICATION ---
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: "Invalid Job ID format." });
    }

    const existing = await Application.findOne({ userId, jobId });
    if (existing) {
      if (existing.status === 'Rejected') {
        // If rejected, allow re-applying by updating the status back to Applied
        existing.status = 'Applied';
        existing.createdAt = new Date(); // Update timestamp
        await existing.save();
        return res.json({ message: "Application re-synchronized.", application: existing });
      }
      return res.status(400).json({ message: "A deployment protocol for this node is already active." });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job node not found." });

    const application = await Application.create({
      jobId,
      userId,
      status: "Applied"
    });

    // Notify Employer (Non-blocking)
    if (job.employerId) {
      try {
        await Notification.create({
          recipient: job.employerId,
          message: `New Node: A candidate has applied for ${job.title}.`,
          type: "Application",
          senderName: "JobGrox Network"
        });
      } catch (notifErr) {
        console.warn(">> NOTIF_RELAY_FAIL: Application successful but notification failed to dispatch.");
      }
    }

    res.status(201).json(application);
  } catch (error) {
    console.error("FATAL_APPLY_ERROR:", error);
    res.status(500).json({ message: "Job Engine Synchronization Failure" });
  }
};

// --- STATUS UPDATE & BROKERAGE TRIGGER ---
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findById(req.params.id).populate("jobId userId");
    if (!application) return res.status(404).json({ message: "Application not found" });

    const job = await Job.findById(application.jobId);
    if (req.user.role !== 'admin' && job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    application.status = status;
    await application.save();

    // Signal Stream: Notify Candidate
    await Notification.create({
      recipient: application.userId,
      message: `Sync Update: Your application for ${job.title} is now ${status.toUpperCase()}.`,
      type: "Application",
      senderName: job.company || "Employer"
    });

    // Financial Stream: Trigger Brokerage on Hire/Selection
    if (status === "Hired" || status === "Selected") {
      const existingBrokerage = await Brokerage.findOne({ applicationId: application._id });
      if (!existingBrokerage) {
        // Calculation Logic: Use Job specific fee settings or defaults
        const salary = job.salaryNum || 500000;
        const feePercent = job.feeValue || 8;
        const amount = Math.round((salary * feePercent) / 100);

        await Brokerage.create({
          jobId: job._id,
          companyId: job.employerId,
          candidateId: application.userId,
          applicationId: application._id,
          amount,
          currency: "INR",
          feeType: job.feeType || "percentage",
          feeValue: feePercent,
          salaryOffered: salary,
          status: "Pending",
          invoiceId: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        });

        // Notify Admin of Revenue Event & Selection Details
        const admins = await User.find({ role: 'admin' });
        const candidate = await User.findById(application.userId);
        for (const admin of admins) {
          await Notification.create({
            recipient: admin._id,
            message: `Selection Sync: ${candidate?.name || 'Candidate'} has been selected by ${job.company}. Brokerage of ₹${amount.toLocaleString()} generated.`,
            type: "System",
            senderName: "Placement Engine"
          });
        }

        // Notify Employer (confirmation of selection and invoice generation)
        await Notification.create({
          recipient: job.employerId,
          message: `Invoice Generated: Brokerage fee for ${candidate?.name || 'Candidate'} is pending verification.`,
          type: "Payment",
          senderName: "Billing Service"
        });
      }
    }

    res.json({ message: "Protocol synchronized", application });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id }).populate("jobId").sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getApplications = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'employer') {
      const jobs = await Job.find({ employerId: req.user.id });
      const jobIds = jobs.map(j => j._id);
      query = { jobId: { $in: jobIds } };
    } else if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    const applications = await Application.find(query)
      .populate("jobId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: "Application not found" });

    const job = await Job.findById(application.jobId);
    const isOwner = application.userId.toString() === req.user.id;
    const isEmployer = job && job.employerId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isEmployer && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application removed from stream" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
