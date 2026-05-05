const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  stats,
  getAllUsers,
  banUser,
  approveCompany,
  getAllCompanies,
  deleteCompany,
  getAllJobs,
  approveJob,
  rejectJob,
  getPayments,
  getSystemNotifications,
  deleteUser
} = require("../controllers/adminController");
const { uploadJSON } = require("../controllers/uploadController");

router.use(authMiddleware, roleMiddleware(["admin"]));

router.post("/upload-json", uploadJSON);

router.get("/stats", stats);
router.get("/users", getAllUsers);
router.put("/users/:id/ban", banUser);
router.delete("/users/:id", deleteUser);
router.get("/companies", getAllCompanies);
router.put("/companies/:id/approve", approveCompany);
router.delete("/companies/:id", deleteCompany);
router.get("/jobs", getAllJobs);
router.put("/jobs/:id/approve", approveJob);
router.put("/jobs/:id/reject", rejectJob);
router.get("/payments", getPayments);
router.get("/notifications", getSystemNotifications);

module.exports = router;