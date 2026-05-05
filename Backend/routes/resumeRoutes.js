const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

const fs = require('fs');

// Ensure local upload directory exists
const LOCAL_UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
  fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, LOCAL_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Sanitize filename - strip emojis/non-ASCII to prevent Windows write failures
    const sanitizedName = file.originalname.replace(/[^\x00-\x7F]/g, "").replace(/\s+/g, "_") || 'resume';
    cb(null, req.user.id + '-' + Date.now() + path.extname(sanitizedName));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
}).single('resume');

// Middleware: Optional auth (tries to auth but doesn't require it)
const optionalAuth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (token) {
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
      req.user = decoded;
    }
  } catch (err) {
    // Ignore auth errors - request can proceed without user
  }
  next();
};

// Route: Parse and update DB (Wrapped with Error Handler for Multer) - PUBLIC endpoint
router.post('/upload', optionalAuth, (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ message: `File Upload Error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ message: err.message });
    }
    
    // Everything went fine. Execute controller.
    resumeController.uploadAndParseResume(req, res);
  });
});

// Route: Parse and update DB with FULL auth requirement
router.post('/upload-authenticated', authMiddleware, (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `File Upload Error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    resumeController.uploadAndParseResume(req, res);
  });
});

module.exports = router;
