const express = require("express");
const router = express.Router();
const financialController = require("../controllers/financialController");
const authMiddleware = require("../middleware/authMiddleware");

// Admin Routes
router.get("/ledger", authMiddleware, financialController.getAdminLedger);
router.post("/ledger", authMiddleware, financialController.createManualBrokerage);
router.get("/analytics", authMiddleware, financialController.getRevenueAnalytics);
router.put("/brokerage/:id", authMiddleware, financialController.updateBrokerageStatus);

// Company Routes
router.get("/invoices", authMiddleware, financialController.getCompanyInvoices);
router.post("/pay", authMiddleware, financialController.processPayment);

module.exports = router;
