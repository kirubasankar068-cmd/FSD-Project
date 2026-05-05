const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createOrder, verifyPayment } = require("../controllers/paymentController");

// Protected Payment Routes
router.use(authMiddleware);

router.post("/order", createOrder);
router.post("/verify", verifyPayment);

module.exports = router;