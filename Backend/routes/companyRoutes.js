const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createProfile,
  getProfile,
  postJob,
  editJob,
  deleteJob,
  viewApplications,
  searchCandidates,
  getDashboardStats,
  getCompanies,
  getCompanyById,
  searchCompanies,
  inviteCandidate
} = require("../controllers/companyController");

// ─── PUBLIC ROUTES ──────────────────────────────────────────────────────────
router.get("/", getCompanies);
router.get("/search", searchCompanies);
router.get("/:id", getCompanyById);

// ─── PROTECTED RECRUITER ROUTES ─────────────────────────────────────────────
router.use(authMiddleware, roleMiddleware(["company"]));

router.get("/stats", getDashboardStats);
router.post("/invite", inviteCandidate);

router.post("/profile", createProfile);
router.get("/profile", getProfile);

// jobs are also handled by jobRoutes but company-specific endpoints can point there
router.post("/jobs", postJob);
router.put("/jobs/:id", editJob);
router.delete("/jobs/:id", deleteJob);
router.get("/applicants", viewApplications);
router.get("/candidates", searchCandidates);

module.exports = router;