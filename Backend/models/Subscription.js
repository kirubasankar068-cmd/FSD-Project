const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  plan: {
    type: String,
    enum: ["free", "pro", "enterprise"],
    default: "free"
  },
  status: {
    type: String,
    enum: ["Active", "Expired", "Canceled"],
    default: "Active"
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  expiryDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
