const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  getProfile,
  updateProfile,
  uploadResume,
  saveJob,
  getSavedJobs,
  getMyApplications,
  upgradePremium,
  getMyNotifications
} = require("../controllers/userController");

router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);
router.post("/me/resume", authMiddleware, upload.single("resume"), uploadResume);
router.post("/me/saved", authMiddleware, saveJob);
router.get("/me/saved", authMiddleware, getSavedJobs);
router.get("/me/applications", authMiddleware, getMyApplications);
router.post("/me/premium", authMiddleware, upgradePremium);
router.get("/me/notifications", authMiddleware, getMyNotifications);

module.exports = router;