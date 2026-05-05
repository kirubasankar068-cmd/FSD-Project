const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Interview", "Selected", "Hired", "Rejected", "Pending", "Matched", "Unmatched"],
    default: "Pending"
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  },
  resumeUrl: {
    type: String,
    default: ""
  }
}, { timestamps: true });

applicationSchema.index({ userId: 1, jobId: 1 }); // Optimized for duplicate checks
applicationSchema.index({ userId: 1 });
applicationSchema.index({ jobId: 1 });

module.exports = mongoose.models.Application || mongoose.model("Application", applicationSchema);
