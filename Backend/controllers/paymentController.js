const User = require("../models/User");
const Payment = require("../models/Payment");

exports.createOrder = async (req, res) => {
  try {
    const { planName, amount } = req.body;
    const userId = req.user.id;

    // Simulate creating a payment session in Stripe/Razorpay
    const orderData = {
      userId,
      planName,
      amount,
      transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "Pending"
    };

    const order = await Payment.create(orderData);
    res.status(201).json({
      message: "Payment order initialized successfully.",
      orderId: order._id,
      transactionId: order.transactionId,
      mockGatewayUrl: `https://jobgrox-gateway.mock/pay/${order.transactionId}`
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId, status } = req.body;
    const payment = await Payment.findOne({ transactionId });

    if (!payment) return res.status(404).json({ message: "Transaction not found." });

    if (status === "Success") {
      payment.status = "Success";
      await payment.save();

      // Upgrade User Plan
      const user = await User.findById(payment.userId);
      user.isPremium = true;
      user.premiumPlan = payment.planName.toLowerCase();
      
      // Expire in 30 days for demo
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 30);
      user.premiumExpiry = expiry;

      await user.save();

      res.json({
        message: `Plan upgraded to ${payment.planName} successfully!`,
        user: {
          id: user._id,
          name: user.name,
          plan: payment.planName,
          isPremium: user.isPremium,
          expiry: user.premiumExpiry
        }
      });
    } else {
      payment.status = "Failed";
      await payment.save();
      res.status(400).json({ message: "Payment verification failed." });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};