const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getCompanyJobs
} = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// public listing
router.get("/", getJobs);
router.get("/:id", getJobById);

// company routes
router.post("/", authMiddleware, roleMiddleware(["company"]), createJob);
router.get("/mine", authMiddleware, roleMiddleware(["company"]), getCompanyJobs);
router.put("/:id", authMiddleware, updateJob);
router.delete("/:id", authMiddleware, deleteJob);

module.exports = router;

