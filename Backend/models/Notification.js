const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ["Application", "Selection", "Interview", "Hired", "Payment", "System", "Invitation", "Course", "Academy"],
    default: "System"
  },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  referenceId: { type: String }, // Can be JobId, CandidateId, ApplicationId
  referenceType: { 
    type: String, 
    enum: ["Job", "Company", "Candidate", "Application"] 
  },
  senderName: { type: String },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
