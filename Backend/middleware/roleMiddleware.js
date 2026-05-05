const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // Get token from header
      const token = req.header("Authorization")?.replace("Bearer ", "");
      
      if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
      }

      // Verify token
      const jwt = require("jsonwebtoken");
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
      
      // Check if user role is allowed
      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ 
          message: "Access denied. You don't have permission to access this resource." 
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired, please login again" });
      }
      return res.status(401).json({ message: "Token is not valid" });
    }
  };
};

module.exports = roleMiddleware;
