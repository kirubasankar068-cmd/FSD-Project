const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');
const planMiddleware = require('../middleware/planMiddleware');

// Route: Get Cosine Similarity Match Array (AI Feature - Pro Unlock)
router.get('/match', authMiddleware, planMiddleware(['professional', 'enterprise']), aiController.matchJobs);
router.post('/match', authMiddleware, planMiddleware(['professional', 'enterprise']), aiController.matchJobs);

// Route: Analyze generic skills gap (Open to ALL authenticated users)
router.post('/analyze', authMiddleware, aiController.analyzeSkills);

module.exports = router;
