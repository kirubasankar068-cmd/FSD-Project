const mongoose = require("mongoose");

const brokerageSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: "Application" },
  
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  feeType: { type: String, enum: ["fixed", "percentage"], required: true },
  feeValue: { type: Number, required: true },
  salaryOffered: { type: String }, // Stored as provided in job/offer
  
  status: { 
    type: String, 
    enum: ["Pending", "Paid", "Failed", "Verified"], 
    default: "Pending" 
  },
  invoiceId: { type: String, unique: true },
  paymentDetails: {
    transactionId: String,
    paidAt: Date,
    method: String
  }
}, { timestamps: true });

module.exports = mongoose.models.Brokerage || mongoose.model("Brokerage", brokerageSchema);
