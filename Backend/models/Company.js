const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  industry: { type: String, default: "Technology" },
  logo: String,
  description: String,
  descriptionFull: String,
  location: String,
  website: String,
  totalEmployees: { type: String, default: "1,000+" },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isApproved: { type: Boolean, default: true },
  premium: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.Company || mongoose.model("Company", companySchema);
