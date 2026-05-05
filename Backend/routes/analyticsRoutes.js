const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user-insights', authMiddleware, analyticsController.getUserInsights);
router.get('/market-trends', analyticsController.getMarketTrends);

module.exports = router;
