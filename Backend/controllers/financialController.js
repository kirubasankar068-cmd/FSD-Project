const Brokerage = require("../models/Brokerage");
const Application = require("../models/Application");
const User = require("../models/User");

// Admin: Get all brokerage transactions
exports.getAdminLedger = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.companyId) filter.companyId = req.query.companyId;

    const ledger = await Brokerage.find(filter)
      .populate("jobId", "title company")
      .populate("companyId", "name email")
      .populate("candidateId", "name email")
      .sort({ createdAt: -1 });

    res.json(ledger);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin: Create manual settlement
exports.createManualBrokerage = async (req, res) => {
  try {
    const { companyId, candidateId, amount, status, feeType, feeValue } = req.body;
    
    if (!companyId || !amount) {
      return res.status(400).json({ message: "Company and Amount are required" });
    }

    const brokerage = await Brokerage.create({
      companyId,
      candidateId: candidateId || null,
      amount,
      status: status || "Pending",
      feeType: feeType || "fixed",
      feeValue: feeValue || amount,
      // Manual entries might not have job/app IDs
      jobId: null,
      applicationId: null,
      invoiceId: `MAN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    });

    res.status(201).json({ message: "Manual settlement created", brokerage });
  } catch (error) {
    console.error(">> SETTLEMENT_ERROR:", error);
    res.status(400).json({ message: error.message });
  }
};

// Company: Get my brokerage invoices
exports.getCompanyInvoices = async (req, res) => {
  try {
    const invoices = await Brokerage.find({ companyId: req.user.id })
      .populate("jobId", "title")
      .populate("candidateId", "name email")
      .sort({ createdAt: -1 });

    res.json(invoices);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mock Payment Processing
exports.processPayment = async (req, res) => {
  try {
    const { brokerageId } = req.body;
    const brokerage = await Brokerage.findById(brokerageId);
    
    if (!brokerage) return res.status(404).json({ message: "Transaction not found" });

    // Mock verification
    brokerage.status = "Paid";
    brokerage.paymentDetails = {
      transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      paidAt: new Date(),
      method: "Mock-Gateway (Stripe/Razorpay)"
    };

    await brokerage.save();

    // Signal Stream: Notify Admins of Automated Settlement
    const admins = await User.find({ role: 'admin' });
    const company = await User.findById(brokerage.companyId);
    
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        message: `Financial Sync: ${company?.name || 'Enterprise Node'} has settled a brokerage fee of ₹${brokerage.amount.toLocaleString()}. Transaction Verified.`,
        type: "Payment",
        senderName: "Finance Engine"
      });
    }

    res.json({ message: "Payment processed successfully", brokerage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin Revenue Analytics
exports.getRevenueAnalytics = async (req, res) => {
  try {
    const stats = await Brokerage.aggregate([
      { $match: { status: "Paid", createdAt: { $exists: true, $ne: null } } },
      { 
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Top paying companies
    const topCompanies = await Brokerage.aggregate([
      { $match: { status: "Paid" } },
      {
        $group: {
          _id: "$companyId",
          totalContributed: { $sum: "$amount" }
        }
      },
      { $sort: { totalContributed: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "companyInfo"
        }
      },
      { $unwind: { path: "$companyInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: "$companyInfo.name",
          totalContributed: 1
        }
      }
    ]);

    res.json({ stats, topCompanies });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBrokerageStatus = async (req, res) => {
  try {
    const { status, amount } = req.body;
    const brokerage = await Brokerage.findById(req.params.id);
    if (!brokerage) return res.status(404).json({ message: "Financial node not found" });

    if (status) brokerage.status = status;
    if (amount) brokerage.amount = amount;
    
    await brokerage.save();
    res.json({ message: "Brokerage protocol updated", brokerage });
  } catch (error) {
    res.status(400).json({ message: "Financial synchronization error", error: error.message });
  }
};
