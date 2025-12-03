/**
 * SessionExpiryHandler.jsx - Component to handle session expiry events
 *
 * Features:
 * - Listen for 'auth:sessionExpired' event from axiosConfig
 * - Show toast notification
 * - Redirect to login page
 */

import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "./Toast";
import { useAuth } from "../context/AuthContext";

const SessionExpiryHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isAuthenticated } = useAuth();

  // Track if we've already shown the expiry message to prevent duplicates
  const hasShownExpiry = useRef(false);

  useEffect(() => {
    /**
     * Handle session expired event
     */
    const handleSessionExpired = () => {
      // Don't show message if already on login page or already shown
      if (location.pathname === "/login" || hasShownExpiry.current) {
        return;
      }

      hasShownExpiry.current = true;

      // Show toast notification
      toast.warning(
        "Vui lòng đăng nhập lại để tiếp tục sử dụng.",
        "Phiên đăng nhập hết hạn"
      );

      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      }, 500);
    };

    // Add event listener
    window.addEventListener("auth:sessionExpired", handleSessionExpired);

    // Cleanup
    return () => {
      window.removeEventListener("auth:sessionExpired", handleSessionExpired);
    };
  }, [navigate, location, toast]);

  // Reset the flag when user becomes authenticated again
  useEffect(() => {
    if (isAuthenticated) {
      hasShownExpiry.current = false;
    }
  }, [isAuthenticated]);

  // This component doesn't render anything
  return null;
};

export default SessionExpiryHandler;
