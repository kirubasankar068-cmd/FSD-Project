const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: __dirname + '/config/.env' });

const app = express();

app.use(cors());
app.use(express.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  const oldJson = res.json;
  res.json = function(data) {
    console.log(`[${new Date().toISOString()}] Response ${res.statusCode} for ${req.url}`);
    if (res.statusCode === 500) {
      console.error(`[${new Date().toISOString()}] 500 Error Data:`, JSON.stringify(data, null, 2));
    }
    return oldJson.apply(res, arguments);
  };
  next();
});

// Import middleware
const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");
const fs = require('fs');
const path = require('path');

// Ensure uploads dir exists before boot
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Routes - Public
app.use("/api/auth", require("./routes/authRoutes"));

// Public job listing
app.use("/api/jobs", require("./routes/jobRoutes"));

// Protected routes
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/companies", require("./routes/companyRoutes")); // Alias for plural endpoint
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/financial", require("./routes/financialRoutes"));

// Advanced ML and Parser Operations
app.use("/api/ai", authMiddleware, require("./routes/aiRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));

// note: individual controllers already protect based on roles


// Get current user endpoint (protected)
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const User = require("./models/User");
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Logout endpoint (client-side token removal, but can track session)
app.post("/api/auth/logout", (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({ message: "Logged out successfully" });
});

// Startup Protocol: Environment Validation
const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET'];
REQUIRED_ENV.forEach(key => {
  if (!process.env[key]) {
    console.error(`!! CORE_SYSTEM_FAILURE: Missing required variable [${key}] in config/.env !!`);
    // Note: We don't exit here so developer can see the error in the console logs
  }
});

// MongoDB Connection Protocol: Exclusive Cloud Cluster Synchronization
const connectToAtlas = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error("!! CORE_SYSTEM_FAILURE: MONGO_URI is not defined in the environment nodes.");
    return;
  }

  console.log(`>> DB_SYNC: Synchronizing with Cloud Cluster node [${MONGO_URI.split('@')[1] || 'Atlas'}]...`);

  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout for cloud handshake
    });
    console.log(">> SYSTEM_READY: MongoDB Atlas Link Established Successfully");
  } catch (err) {
    console.error("!! CRITICAL_CONNECTION_FAILURE: Cloud Cluster unreachable !!");
    console.error(`>> DIAGNOSTIC_NODE: ${err.message}`);
    
    // Check for IP Whitelist issues
    if (err.message.includes('MongooseServerSelectionError') || err.message.includes('timeout')) {
       console.error(">> ADVISORY: Potential IP Whitelist violation detected. Ensure your current IP is permitted in Atlas.");
    }
  }
};

connectToAtlas();

// Real-time connection monitoring
mongoose.connection.on('error', err => {
  console.error('>> DB_HEARTBEAT_FAILURE:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('>> DB_HEARTBEAT_LOST: Retrying connection protocols...');
});

// Global error handler middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[${new Date().toISOString()}] !! CORE_SYSTEM_CRASH !!`);
  console.error(`Path: ${req.url} | Method: ${req.method} | Status: ${status}`);
  console.error(`Message: ${message}`);
  if (err.stack) console.error(`Stack: ${err.stack}`);
  
  res.status(status).json({ 
    message: message,
    status: status,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('>> UNHANDLED_REJECTION:', reason);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

