import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  
  // 1. Critical Token Check
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. User Data Check
  let user = null;
  try {
    if (userStr) {
      user = JSON.parse(userStr);
    } else {
      // Token exists but no user data - data corruption or cleared storage
      console.warn("Auth token present but user data missing. Redirecting to login sync.");
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }
  } catch (e) {
    console.error("Auth context corruption detected:", e);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
  
  // 3. Role Validation
  if (allowedRoles.length > 0) {
    if (!user || !user.role || !allowedRoles.includes(user.role)) {
      console.warn(`Role mismatch. Required: [${allowedRoles}], Actual: ${user?.role}. Redirecting to safety.`);
      
      // Redirect to appropriate dashboard based on actual role
      if (user?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
      if (user?.role === "company") return <Navigate to="/company-dashboard" replace />;
      return <Navigate to="/candidate-dashboard" replace />;
    }
  }
  
  return children;
};

export default ProtectedRoute;
