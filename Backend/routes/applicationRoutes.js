const express = require("express");
const router = express.Router();
const { applyJob, getApplications, updateApplicationStatus, getUserApplications, deleteApplication } = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, applyJob);

// /me must come before /:id routes to avoid conflict
router.get("/me", authMiddleware, getUserApplications);

router.get("/", authMiddleware, getApplications);
router.put("/:id/status", authMiddleware, updateApplicationStatus);
router.get("/user/:userId", authMiddleware, getUserApplications);
router.delete("/:id", authMiddleware, deleteApplication);

module.exports = router;
