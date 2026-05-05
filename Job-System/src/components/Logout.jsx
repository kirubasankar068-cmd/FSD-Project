import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Optionally call logout API endpoint
    authAPI.logout().catch(() => {});

    // Clear all auth data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    
    // Redirect to home
    navigate("/", { replace: true });
  }, [navigate]);

  return null;
};

export default Logout;
