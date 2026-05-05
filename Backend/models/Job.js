const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  companyLogo: String,
  category: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    default: 0
  },
  salaryNum: {
    type: Number,
    default: 0
  },
  feeType: {
    type: String,
    enum: ["fixed", "percentage"],
    default: "percentage"
  },
  feeValue: {
    type: Number,
    default: 8 // 8% Default
  },
  experience: {
    type: Number,
    default: 0
  },
  employmentType: {
    type: String,
    enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
    default: "Full-time"
  },
  remote: {
    type: Boolean,
    default: false
  },
  postedAt: String,
  description: String,
  skills: [String],
  isPremium: {
    type: Boolean,
    default: false
  },
  approvalStatus: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  priority: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company"
  }
}, { timestamps: true });

jobSchema.index({ title: "text" }); // For fast search
jobSchema.index({ title: 1 });       // For regex search performance
jobSchema.index({ salaryNum: -1 });  // For sorting performance
jobSchema.index({ category: 1 });    // For filter performance

module.exports = mongoose.models.Job || mongoose.model("Job", jobSchema);
