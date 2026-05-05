const User = require("../models/User");

const planMiddleware = (requiredPlans = []) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const userPlan = user.premiumPlan || 'free';
      
      // If requiredPlans is empty, any plan is allowed (default behavior handled by authMiddleware)
      if (requiredPlans.length > 0 && !requiredPlans.includes(userPlan)) {
        return res.status(403).json({
          message: `PREMIUM_REQUIRED: This advanced feature requires a plan with higher clearance: ${requiredPlans.join(' or ')}.`,
          currentPlan: userPlan,
          requiredPlans
        });
      }

      next();
    } catch (err) {
      res.status(500).json({ message: "Server error during clearance check." });
    }
  };
};

module.exports = planMiddleware;
