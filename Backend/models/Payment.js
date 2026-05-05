const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  planName: {
    type: String,
    enum: ["Free", "Professional", "Enterprise"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: "INR"
  },
  status: {
    type: String,
    enum: ["Pending", "Success", "Failed"],
    default: "Pending"
  },
  transactionId: {
    type: String,
    unique: true,
    required: true
  },
  paymentMethod: {
    type: String,
    default: "Mock Gateway (Stripe/Razorpay)"
  },
  receiptUrl: String
}, { timestamps: true });

module.exports = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
